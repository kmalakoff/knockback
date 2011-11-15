###
  knockback_collection_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.CollectionObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###
throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file') if not this.Knockback

####################################################
# options
#   viewModelCreate: (model) -> return view_model_instance
#   sortedIndex: (models, model) -> return add_index. Optional hook for sorting a model.
#     Default: the model's index in the collection is used.
#   sort_attribute: attribute_name. An optimization to check if a specific attribute has changed.
#     Default: resort on all changes to a model.
#   onViewModelAdd: (view_model, view_models_array)
#   onViewModelResort: (view_model, view_models_array, new_index)
#   onViewModelRemove: (view_model, view_models_array)
####################################################

class Knockback.CollectionObservable
  constructor: (collection, @observable_array, @options) ->
    throw new Error('CollectionObservable: collection is missing') if not collection
    throw new Error('CollectionObservable: observable_array is missing') if not @observable_array
    throw new Error('CollectionObservable: options is missing') if not @options
    throw new Error('CollectionObservable: options.viewModelCreate is missing') if not @options.viewModelCreate

    _.bindAll(this, 'destroy', 'collection', 'sorting', 'viewModelByModel', 'eachViewModel')
    _.bindAll(this, '_onGetValue', '_onCollectionReset', '_onCollectionResort', '_onModelAdd', '_onModelRemove', '_onModelChanged')
    @_kb_collection = collection
    @_kb_collection.retain() if @_kb_collection.retain
    @_kb_collection.bind('reset', @_onCollectionReset)
    @_kb_collection.bind('resort', @_onCollectionResort) if not @options.sortedIndex
    @_kb_collection.bind(event, @_onModelAdd) for event in ['new', 'add']
    @_kb_collection.bind(event, @_onModelRemove) for event in ['remove', 'destroy']
    @_kb_collection.bind('change', @_onModelChanged)

    # internal state
    @_kb_value_observable = ko.observableArray([])

    @_kb_observable = ko.dependentObservable(@_onGetValue)

    # publish public interface on the observable and return instead of this
    @_kb_observable.destroy = @destroy
    @_kb_observable.collection = @collection
    @_kb_observable.viewModelByModel = @viewModelByModel
    @_kb_observable.eachViewModel = @eachViewModel
    @_kb_observable.sorting = @sorting

    # start
    @_onCollectionReset(@_kb_collection)

    return kb.wrappedObservable(this)

  destroy: ->
    @_kb_collection.unbind('reset', @_onCollectionReset)
    @_kb_collection.unbind('resort', @_onCollectionResort) if not @options.sortedIndex
    @_kb_collection.unbind(event, @_onModelAdd) for event in ['new', 'add']
    @_kb_collection.unbind(event, @_onModelRemove) for event in ['remove', 'destroy']
    @_kb_collection.unbind('change', @_onModelChanged)
    @_kb_collection.release() if @_kb_collection.release; @_kb_collection = null
    @_kb_value_observable = null
    @_kb_observable.dispose(); @_kb_observable = null
    @observable_array = null
    @options = null

  collection: ->
    @_kb_value_observable() # force a dependency
    return @_kb_collection
  viewModelByModel: (model) ->
    id_attribute = if model.hasOwnProperty(model.idAttribute) then model.idAttribute else 'cid'
    return _.find(@observable_array(), (test) -> return (test.__kb_model[id_attribute] == model[id_attribute]))
  eachViewModel: (iterator) -> iterator(view_model) for view_model in @observable_array()
  sorting: (sortedIndex, sort_attribute) ->
    return {sortedIndex: @options.sortedIndex, sort_attribute: @options.sort_attribute} if arguments.length == 0

    @options.sort_attribute = sort_attribute
    @options.sortedIndex = sortedIndex
    @_onCollectionReset() # resort everything (TODO: do it incrementally if not too complex)

  ####################################################
  # Internal
  ####################################################
  _onGetValue: ->
    return @_kb_value_observable()

  _onCollectionReset: ->
    view_models = @observable_array.removeAll() # batch
    for view_model in view_models
      do (view_model) =>
        @options.onViewModelRemove(view_model) if @options.onViewModelRemove # notify
        kb.vmDestroy(view_model)
    @_kb_value_observable.removeAll()

    view_models = [] # batch
    if @options.sortedIndex
      models = [] # use a second array of just the models so the caller doesn't need to do a reverse lookup from the model view
      for model in @_kb_collection.models
        do (model) =>
          view_model = @_viewModelCreate(model)
          add_index = @options.sortedIndex(models, model)
          models.splice(add_index, 0, model)
          view_models.splice(add_index, 0, view_model)
    else
      view_models.push(@_viewModelCreate(model)) for model in @_kb_collection.models
      models = _.clone(@_kb_collection.models)
    @observable_array(view_models) # batch
    @_kb_value_observable(models)
    @options.onViewModelAdd(view_model) for view_model in @observable_array() if @options.onViewModelAdd # notify

  _onCollectionResort: (model_or_models) ->
    throw new Error("CollectionObservable: collection sorting unexpected") if @options.sortedIndex
    if _.isArray(model_or_models)
      @_viewModelResort(@viewModelByModel(model)) for model in model_or_models
    else
      @_viewModelResort(@viewModelByModel(model_or_models))

  _onModelAdd: (model) ->
    view_model = @_viewModelCreate(model)
    if @options.sortedIndex
      sorted_models = _.pluck(@observable_array(), '__kb_model')
      add_index = @options.sortedIndex(sorted_models, model)
    else
      add_index = @_kb_collection.indexOf(model)
    @observable_array.splice(add_index, 0, view_model)
    @_kb_value_observable.splice(add_index, 0, model)
    @options.onViewModelAdd(view_model, @observable_array()) if @options.onViewModelAdd # notify

  _onModelRemove: (model) ->
    view_model = @viewModelByModel(model)
    return if not view_model # both the model and collection notify of destroy so may already have been removed
    @observable_array.remove(view_model)
    @_kb_value_observable.remove(model)
    @options.onViewModelRemove(view_model, @observable_array()) if @options.onViewModelRemove # notify
    kb.vmDestroy(view_model)
    view_model.__kb_model = null

  _onModelChanged: (model) ->
    # sorting required
    if @options.sortedIndex and (not @options.sort_attribute or model.hasChanged(@options.sort_attribute))
      view_model = @viewModelByModel(model)
      throw new Error("CollectionObservable: view_model not found for resort") if not view_model
      @_viewModelResort(view_model)

    # trigger a change since observors could be looking for property changes as well
    @_kb_value_observable.valueHasMutated()

  _viewModelCreate: (model) ->
    view_model = @options.viewModelCreate(model)
    throw new Error("CollectionObservable: __kb_model is reserved") if view_model.__kb_model
    view_model.__kb_model = model
    return view_model

  _viewModelResort: (view_model) ->
    previous_index = @observable_array.indexOf(view_model)
    model = view_model.__kb_model
    if @options.sortedIndex
      sorted_models = _.pluck(@observable_array(), '__kb_model')
      sorted_models.splice(previous_index, 1)  # it is assumed that it is cheaper to copy the array during the test rather than redrawing the views multiple times if it didn't move
      new_index = @options.sortedIndex(sorted_models, model)
    else
      new_index = @_kb_collection.indexOf(model)
    return if previous_index == new_index # no change
    @observable_array.splice(previous_index, 1); @observable_array.splice(new_index, 0, view_model) # move
    @_kb_value_observable.splice(previous_index, 1); @_kb_value_observable.splice(new_index, 0, model) # move
    @options.onViewModelResort(view_model, @observable_array(), new_index) if @options.onViewModelResort # notify

# factory function
Knockback.collectionObservable = (collection, observable_array, options) -> return new Knockback.CollectionObservable(collection, observable_array, options)

# helpers
Knockback.viewModelGetModel = Knockback.vmModel = (view_model) -> view_model.__kb_model
