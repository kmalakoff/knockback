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

class Knockback.CollectionObservable extends kb.RefCountable
  constructor: (collection, options={}) ->
    throw new Error('CollectionObservable: collection is missing') if not collection

    super

    # LEGACY
    if ko.isObservable(options) and options.hasOwnProperty('indexOf')
      Knockback.legacyWarning('kb.collectionObservable with an external ko.observableArray', 'Please use the kb.collectionObservable directly instead of passing a ko.observableArray')
      @__kb.observable = options
      options = arguments[2] || {}
    else
      @__kb.observable = ko.observableArray([])

    # register ourselves to handle recursive view models
    @__kb.store = options.__kb_store || new kb.Store()
    @__kb.store.add(options.__kb_store_key, kb.unwrapObservable(this)) if options.__kb_store_key

    # options
    if options.hasOwnProperty('view_model') or options.hasOwnProperty('view_model_constructor')
      @view_model_create_fn = options.view_model || options.view_model_constructor
      @view_model_create_with_new = true
    else if options.hasOwnProperty('view_model_create')
      @view_model_create_fn = options.view_model_create
    @sort_attribute = options.sort_attribute
    @sorted_index = options.sorted_index

    # bind callbacks
    @__kb._onCollectionReset = _.bind(@_onCollectionReset, @)
    @__kb._onCollectionResort = _.bind(@_onCollectionResort, @)
    @__kb._onModelAdd = _.bind(@_onModelAdd, @)
    @__kb._onModelRemove = _.bind(@_onModelRemove, @)
    @__kb._onModelChange = _.bind(@_onModelChange, @)

    # publish public interface on the observable and return instead of this
    @__kb.observable.retain = _.bind(@retain, @)
    @__kb.observable.refCount = _.bind(@refCount, @)
    @__kb.observable.release = _.bind(@release, @)
    @__kb.observable.collection = _.bind(@collection, @)
    @__kb.observable.viewModelByModel = _.bind(@viewModelByModel, @)
    @__kb.observable.sortedIndex = _.bind(@sortedIndex, @)
    @__kb.observable.sortAttribute = _.bind(@sortAttribute, @)
    @__kb.observable.hasViewModels = _.bind(@hasViewModels, @)

    # Backbone.Event interface
    @__kb.observable.bind = _.bind(@bind, @)
    @__kb.observable.unbind = _.bind(@unbind, @)
    @__kb.observable.trigger = _.bind(@trigger, @)

    # start the processing
    @collection(collection, {silent: true, defer: options.defer})

    return kb.unwrapObservable(this)

  __destroy: ->
    @collection(null)
    @__kb.observable.destroyAll(); @__kb.observable = null
    @view_model_create_fn = null
    @__kb.store = null
    @__kb.co = null
    super

  collection: (collection, options) ->
    if (arguments.length == 0)
      @__kb.observable() # force a dependency
      return @__kb.collection

    # no change
    return if (collection == @__kb.collection)

    # clean up
    if @__kb.collection
      @_clear()
      @__kb.collection.unbind('reset', @__kb._onCollectionReset)
      @__kb.collection.unbind('resort', @__kb._onCollectionResort) if not @sorted_index
      @__kb.collection.unbind(event, @__kb._onModelAdd) for event in ['new', 'add']
      @__kb.collection.unbind(event, @__kb._onModelRemove) for event in ['remove', 'destroy']
      @__kb.collection.unbind('change', @__kb._onModelChange)
      @__kb.collection.release?(); @__kb.collection = null

    @__kb.collection = collection # store as _kb_collection so that a collection() function can be exposed
    if @__kb.collection
      @__kb.collection.retain?()
      @__kb.collection.bind('reset', @__kb._onCollectionReset)
      @__kb.collection.bind('resort', @__kb._onCollectionResort) if not @sorted_index
      @__kb.collection.bind(event, @__kb._onModelAdd) for event in ['new', 'add']
      @__kb.collection.bind(event, @__kb._onModelRemove) for event in ['remove', 'destroy']
      @__kb.collection.bind('change', @__kb._onModelChange)

      # generate
      @sortedIndex(@sorted_index, @sort_attribute, options)

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
      return if (@__kb.collection.models.length == 0) and (@__kb.observable().length == 0) # don't do anything
      @_collectionResync(true) # resort everything (TODO: do it incrementally with a notification for resort if not too complex)
      @trigger('resort', @__kb.observable()) unless options.silent # notify

    # resync now or later
    if options.defer then _.defer(_resync) else _resync()
    @

  sortAttribute: (sort_attribute, sorted_index, silent) -> return @sortedIndex(sorted_index, sort_attribute, silent)

  viewModelByModel: (model) ->
    return null unless @hasViewModels()
    id_attribute = if model.hasOwnProperty(model.idAttribute) then model.idAttribute else 'cid'
    return _.find(@__kb.observable(), (test) -> return (test.__kb.model[id_attribute] == model[id_attribute]))

  hasViewModels: -> return !!@view_model_create_fn

  ####################################################
  # Internal
  ####################################################
  _onCollectionReset: -> @_collectionResync()
  _onCollectionResort: (model_or_models) ->
    throw new Error("CollectionObservable: collection sorted_index unexpected") if @sorted_index
    if _.isArray(model_or_models)
      @(true) # TODO: optimize for incremental resorted_index
      @trigger('resort', @__kb.observable()) # notify
    else
      @_onModelResort(model_or_models)

  _onModelAdd: (model) ->
    target = if @hasViewModels() then @_createTarget(model) else model
    if @sorted_index
      add_index = @sorted_index(@__kb.observable(), target)
    else
      add_index = @__kb.collection.indexOf(model)

    @__kb.observable.splice(add_index, 0, target)
    @trigger('add', target, @__kb.observable()) # notify

  _onModelRemove: (model) ->
    # either remove a view model or a model
    target = if @hasViewModels() then @viewModelByModel(model) else model
    return unless target  # it may have already been removed
    @__kb.observable.remove(target)
    @trigger('remove', target, @__kb.observable()) # notify

    # clean up view models
    return unless @hasViewModels()
    kb.vmRelease(target)
    kb.wrapModel(target, null)

  _onModelChange: (model) ->
    # sorted_index required
    if @sorted_index and (not @sort_attribute or model.hasChanged(@sort_attribute))
      @_onModelResort(model)
    @__kb.observable.valueHasMutated()

  _onModelResort: (model) ->
    # either move a view model or a model
    target = if @hasViewModels() then @viewModelByModel(model) else model
    previous_index = @__kb.observable.indexOf(target)
    if @sorted_index
      sorted_targets = _.clone(@__kb.observable())
      sorted_targets.splice(previous_index, 1)  # it is assumed that it is cheaper to copy the array during the test rather than redrawing the views multiple times if it didn't move
      new_index = @sorted_index(sorted_targets, target)
    else
      new_index = @__kb.collection.indexOf(model)
    return if previous_index == new_index # no change

    # either remove a view model or a model
    @__kb.observable.splice(previous_index, 1); @__kb.observable.splice(new_index, 0, target) # move
    @trigger('resort', target, @__kb.observable(), new_index) # notify

  _clear: (silent) ->
    @trigger('remove', @__kb.observable()) if not silent # notify
    targets = @__kb.observable.removeAll() # batch

    # clean up view models
    return unless @hasViewModels()
    kb.vmRelease(view_model) for view_model in targets

  _collectionResync: (silent) ->
    @_clear(silent)

    if @sorted_index
      targets = []
      for model in @__kb.collection.models
        target = @_createTarget(model)
        add_index = @sorted_index(targets, target)
        targets.splice(add_index, 0, target)
    else
      targets = if @hasViewModels() then _.map(@__kb.collection.models, (model) => @_createTarget(model)) else _.clone(@__kb.collection.models)

    @__kb.observable(targets)
    @trigger('add', @__kb.observable()) if not silent # notify

  _sortAttributeFn: (sort_attribute) ->
    if @hasViewModels()
      return (view_models, model) -> _.sortedIndex(view_models, model, (test) -> kb.unwrapModel(test).get(sort_attribute))
    else
      return (models, model) -> _.sortedIndex(models, model, (test) -> test.get(sort_attribute))

  _createTarget: (model) ->
    return model unless @view_model_create_fn
    return @__kb.store.resolve(model, =>
      view_model = if @view_model_create_with_new then (new @view_model_create_fn(model, {__kb_store: @__kb.store, __kb_store_key: model})) else @view_model_create_fn(model, {__kb_store: @__kb.store})
      kb.wrapModel(view_model, model)
      return view_model
    )

#######################################
# Mix in Backbone.Events so callers can subscribe
#######################################
Knockback.CollectionObservable.prototype extends Backbone.Events

# factory function
Knockback.collectionObservable = (collection, options, legacy) -> return new Knockback.CollectionObservable(collection, options, legacy)

# helpers
Knockback.sortedIndexWrapAttr = Knockback.siwa = (attribute_name, wrapper_constructor) ->
  return (models, model) -> return _.sortedIndex(models, model, (test) -> return new wrapper_constructor(kb.unwrapModel(test).get(attribute_name)))
