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
#   sorted_index: (models, model) -> return add_index. Optional hook for sorted_index a model.
#     Default: the model's index in the collection is used.
#     Setter: sorted_index: (sorted_index, sort_attribute) -> where sort_attribute is optional
#   sort_attribute: attribute_name. An optimization to check if a specific attribute has changed.
#     Default: resort on all changes to a model.
#     Setter: sort_attribute: (sort_attribute, sorted_index) -> where sort_attribute is optional
#
# Options:
#   view_model or view_model_constructor: (model) -> ... view model constructor
#   view_model_create: (model) -> ... view model create function
#   defer: if you are creating the observable during dependent cycle, you can defer the loading of the collection to avoid a cycle.
# Optional: If you wish to create view models, you must supply a target observable array and the view_model_create or view_model_constructor option.
#
# With view models, the following are triggered the following Backbone.Events
#   add: (view_model, collection_observable) or if batch: (collection_observable)
#   resort: (view_model, collection_observable, new_index) or if batch: (collection_observable)
#   remove: (view_model, collection_observable) or if batch: (collection_observable)
####################################################

class Knockback.CollectionObservable
  constructor: (collection, options={}) ->
    throw new Error('CollectionObservable: collection is missing') if not collection

    # LEGACY
    if ko.isObservable(options) and options.hasOwnProperty('indexOf')
      Knockback.legacyWarning('kb.collectionObservable with an external ko.observableArray', 'Please use the kb.collectionObservable directly instead of passing a ko.observableArray')
      @_kb_observable = options
      options = arguments[2] || {}
    else
      @_kb_observable = ko.observableArray([])

    # options
    @vm_create_fn = @_viewModelCreateFn(options)
    @sort_attribute = options.sort_attribute
    @sorted_index = options.sorted_index

    _.bindAll(this, 'destroy', 'collection', 'sortedIndex', 'sortAttribute', 'viewModelByModel', 'hasViewModels', 'bind', 'unbind', 'trigger')
    _.bindAll(this, '_onCollectionReset', '_onCollectionResort', '_onModelAdd', '_onModelRemove', '_onModelChanged')

    # store as _kb_collection so that a collection() function can be exposed
    @_kb_collection = collection
    @_kb_collection.retain() if @_kb_collection.retain
    @_kb_collection.bind('reset', @_onCollectionReset)
    @_kb_collection.bind('resort', @_onCollectionResort) if not @sorted_index
    @_kb_collection.bind(event, @_onModelAdd) for event in ['new', 'add']
    @_kb_collection.bind(event, @_onModelRemove) for event in ['remove', 'destroy']
    @_kb_collection.bind('change', @_onModelChanged)

    # publish public interface on the observable and return instead of this
    @_kb_observable.destroy = @destroy
    @_kb_observable.collection = @collection
    @_kb_observable.viewModelByModel = @viewModelByModel
    @_kb_observable.sortedIndex = @sortedIndex
    @_kb_observable.sortAttribute = @sortAttribute
    @_kb_observable.hasViewModels = @hasViewModels
    # Backbone.Event interface
    @_kb_observable.bind = @bind
    @_kb_observable.unbind = @unbind
    @_kb_observable.trigger = @trigger

    # start
    @sortedIndex(@sorted_index, @sort_attribute, {silent: true, defer: options.defer})

    return kb.unwrapObservable(this)

  destroy: ->
    @_clear()
    @_kb_collection.unbind('reset', @_onCollectionReset)
    @_kb_collection.unbind('resort', @_onCollectionResort) if not @sorted_index
    @_kb_collection.unbind(event, @_onModelAdd) for event in ['new', 'add']
    @_kb_collection.unbind(event, @_onModelRemove) for event in ['remove', 'destroy']
    @_kb_collection.unbind('change', @_onModelChanged)
    @_kb_collection.release() if @_kb_collection.release; @_kb_collection = null
    @_kb_observable.dispose(); @_kb_observable = null
    @vm_create_fn = null

  collection: ->
    @_kb_observable() # force a dependency
    return @_kb_collection

  sortedIndex: (sorted_index, sort_attribute, options={}) ->
    if sorted_index
      @sorted_index = sorted_index
      @sort_attribute = sort_attribute
    else if sort_attribute
      @sort_attribute = sort_attribute
      @sorted_index = @_sortAttributeFn(sort_attribute)
    else
      @sort_attribute = null
      @sorted_index = null

    _resync = =>
      return if (@_kb_collection.models.length == 0) and (@_kb_observable().length == 0) # don't do anything
      @_collectionResync(true) # resort everything (TODO: do it incrementally with a notification for resort if not too complex)
      @trigger('resort', @_kb_observable()) unless options.silent # notify

    # resync now or later
    if options.defer then _.defer(_resync) else _resync()
    @

  sortAttribute: (sort_attribute, sorted_index, silent) -> return @sortedIndex(sorted_index, sort_attribute, silent)

  viewModelByModel: (model) ->
    return null unless @hasViewModels()
    id_attribute = if model.hasOwnProperty(model.idAttribute) then model.idAttribute else 'cid'
    return _.find(@_kb_observable(), (test) -> return (test.__kb_model[id_attribute] == model[id_attribute]))

  hasViewModels: -> return !!@vm_create_fn

  ####################################################
  # Internal
  ####################################################
  _onCollectionReset: -> @_collectionResync()
  _onCollectionResort: (model_or_models) ->
    throw new Error("CollectionObservable: collection sorted_index unexpected") if @sorted_index
    if _.isArray(model_or_models)
      @(true) # TODO: optimize for incremental resorted_index
      @trigger('resort', @_kb_observable()) # notify
    else
      @_onModelResort(model_or_models)

  _onModelAdd: (model) ->
    target = if @hasViewModels() then @vm_create_fn(model) else model
    if @sorted_index
      add_index = @sorted_index(@_kb_observable(), target)
    else
      add_index = @_kb_collection.indexOf(model)

    @_kb_observable.splice(add_index, 0, target)
    @trigger('add', target, @_kb_observable()) # notify

  _onModelRemove: (model) ->
    # either remove a view model or a model
    target = if @hasViewModels() then @viewModelByModel(model) else model
    return unless target  # it may have already been removed
    @_kb_observable.remove(target)
    @trigger('remove', target, @_kb_observable()) # notify

    # clean up view models
    return unless @hasViewModels()
    kb.vmRelease(target)
    target.__kb_model = null

  _onModelChanged: (model) ->
    # sorted_index required
    if @sorted_index and (not @sort_attribute or model.hasChanged(@sort_attribute))
      @_onModelResort(model)
    @_kb_observable.valueHasMutated()

  _onModelResort: (model) ->
    # either move a view model or a model
    target = if @hasViewModels() then @viewModelByModel(model) else model
    previous_index = @_kb_observable.indexOf(target)
    if @sorted_index
      sorted_targets = _.clone(@_kb_observable())
      sorted_targets.splice(previous_index, 1)  # it is assumed that it is cheaper to copy the array during the test rather than redrawing the views multiple times if it didn't move
      new_index = @sorted_index(sorted_targets, target)
    else
      new_index = @_kb_collection.indexOf(model)
    return if previous_index == new_index # no change

    # either remove a view model or a model
    @_kb_observable.splice(previous_index, 1); @_kb_observable.splice(new_index, 0, target) # move
    @trigger('resort', target, @_kb_observable(), new_index) # notify

  _clear: (silent) ->
    @trigger('remove', @_kb_observable()) if not silent # notify
    targets = @_kb_observable.removeAll() # batch

    # clean up view models
    return unless @hasViewModels()
    kb.vmRelease(view_model) for view_model in targets

  _collectionResync: (silent) ->
    @_clear(silent)

    if @sorted_index
      targets = []
      for model in @_kb_collection.models
        target = if @hasViewModels() then @vm_create_fn(model) else model
        add_index = @sorted_index(targets, target)
        targets.splice(add_index, 0, target)
    else
      targets = if @hasViewModels() then _.map(@_kb_collection.models, (model) => @vm_create_fn(model)) else _.clone(@_kb_collection.models)

    @_kb_observable(targets)
    @trigger('add', @_kb_observable()) if not silent # notify

  _sortAttributeFn: (sort_attribute) ->
    if @hasViewModels()
      return (view_models, model) -> _.sortedIndex(view_models, model, (test) -> kb.unwrapModel(test).get(sort_attribute))
    else
      return (models, model) -> _.sortedIndex(models, model, (test) -> test.get(sort_attribute))

  _viewModelCreateFn: (options) ->

    # view_model is equivalent to view_model_constructor
    if options.hasOwnProperty('view_model') or options.hasOwnProperty('view_model_constructor')
      vm_constructor = if options.hasOwnProperty('view_model') then options.view_model else options.view_model_constructor
      return (model) -> view_model = new vm_constructor(model); view_model.__kb_model = model; return view_model

    # use a create function
    else if options.hasOwnProperty('view_model_create')
      vm_create = options.view_model_create
      return  (model) -> view_model = vm_create(model); view_model.__kb_model = model; return view_model

    # no view model
    else
       return null

#######################################
# Mix in Backbone.Events so callers can subscribe
#######################################
Knockback.CollectionObservable.prototype extends Backbone.Events

# factory function
Knockback.collectionObservable = (collection, options, legacy) -> return new Knockback.CollectionObservable(collection, options, legacy)

# helpers
Knockback.sortedIndexWrapAttr = Knockback.siwa = (attribute_name, wrapper_constructor) ->
  return (models, model) -> return _.sortedIndex(models, model, (test) -> return new wrapper_constructor(kb.unwrapModel(test).get(attribute_name)))
