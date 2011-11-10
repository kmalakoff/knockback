###
  knockback_collection_sync.js
  (c) 2011 Kevin Malakoff.
  Knockback.CollectionSync is freely distributable under the MIT license.
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

class Knockback.CollectionSync
  constructor: (@collection, @observable_array, @options) ->
    throw new Error('CollectionSync: collection is missing') if not @collection
    throw new Error('CollectionSync: observable_array is missing') if not @observable_array
    throw new Error('CollectionSync: options is missing') if not @options
    throw new Error('CollectionSync: options.viewModelCreate is missing') if not @options.viewModelCreate

    _.bindAll(this, '_onCollectionReset', '_onCollectionResort', '_onModelAdd', '_onModelRemove', '_onModelChanged')
    @collection.retain() if @collection.retain
    @collection.bind('reset', @_onCollectionReset)
    @collection.bind('resort', @_onCollectionResort) if not @options.sortedIndex
    @collection.bind(event, @_onModelAdd) for event in ['new', 'add']
    @collection.bind(event, @_onModelRemove) for event in ['remove', 'destroy']
    @collection.bind('change', @_onModelChanged) if @options.sortedIndex

    # load now
    @_onCollectionReset(@collection)

  destroy: ->
    @collection.unbind('reset', @_onCollectionReset)
    @collection.unbind('resort', @_onCollectionResort) if not @options.sortedIndex
    @collection.unbind(event, @_onModelAdd) for event in ['new', 'add']
    @collection.unbind(event, @_onModelRemove) for event in ['remove', 'destroy']
    @collection.unbind('change', @_onModelChanged) if @options.sortedIndex
    @collection.release() if @collection.release; @collection = null
    @observable_array
    @options = null

  modelByViewModel: (view_model) -> return _.find(@observable_array(), (test) -> return test == view_model)
  viewModelByModel: (model) ->
    id_attribute = if model.hasOwnProperty(model.idAttribute) then model.idAttribute else 'cid'
    return _.find(@observable_array(), (test) -> return (test.__kb_model[id_attribute] == model[id_attribute]))
  eachViewModel: (iterator) -> iterator(view_model) for view_model in @observable_array()

  ####################################################
  # Internal
  ####################################################
  _onCollectionReset: ->
    view_models = @observable_array.removeAll() # batch
    for view_model in view_models
      do (view_model) =>
        @options.onViewModelRemove(view_model) if @options.onViewModelRemove # notify
        kb.vmDestroy(view_model)

    view_models = [] # batch
    if @options.sortedIndex
      sorted_models = [] # use a second array of just the models so the caller doesn't need to do a reverse lookup from the model view
      for model in @collection.models
        do (model) =>
          view_model = @_viewModelCreate(model)
          add_index = @options.sortedIndex(sorted_models, model)
          sorted_models.splice(add_index, 0, model)
          view_models.splice(add_index, 0, view_model)
    else
      view_models.push(@_viewModelCreate(model)) for model in @collection.models
    @observable_array(view_models) # batch
    @options.onViewModelAdd(view_model) for view_model in @observable_array() if @options.onViewModelAdd # notify

  _onCollectionResort: (model_or_models) ->
    throw new Error("CollectionSync: collection sorting unexpected") if @options.sortedIndex
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
      add_index = @collection.indexOf(model)
    @observable_array.splice(add_index, 0, view_model)
    @options.onViewModelAdd(view_model, @observable_array()) if @options.onViewModelAdd # notify

  _onModelRemove: (model) ->
    view_model = @viewModelByModel(model)
    throw new Error("CollectionSync: view_model not found for remove") if not view_model
    @observable_array.remove(view_model)
    @options.onViewModelRemove(view_model, @observable_array()) if @options.onViewModelRemove # notify
    kb.vmDestroy(view_model)
    view_model.__kb_model = null

  _onModelChanged: (model) ->
    throw new Error("CollectionSync: change sorting unexpected") if not @options.sortedIndex
    return if @options.sort_attribute and not model.hasChanged(@options.sort_attribute) # sort not required
    view_model = @viewModelByModel(model)
    throw new Error("CollectionSync: view_model not found for resort") if not view_model
    @_viewModelResort(view_model)

  _viewModelCreate: (model) ->
    view_model = @options.viewModelCreate(model)
    throw new Error("CollectionSync: __kb_model is reserved") if view_model.__kb_model
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
      new_index = @collection.indexOf(model)
    return if previous_index == new_index # no change
    @observable_array.splice(previous_index, 1); @observable_array.splice(new_index, 0, view_model) # move
    @options.onViewModelResort(view_model, @observable_array(), new_index) if @options.onViewModelResort # notify

# factory function
Knockback.collectionSync = (collection, observable_array, options) -> return new Knockback.CollectionSync(collection, observable_array, options)

# helpers
Knockback.viewModelGetModel = Knockback.vmModel = (view_model) -> view_model.__kb_model
