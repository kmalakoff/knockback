###
  knockback_collection_observable.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.CollectionObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

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
#   view_model: (model) -> ... view model constructor
#   create: (model) -> ... view model create function
#   defer: if you are creating the observable during dependent cycle, you can defer the loading of the collection to avoid a cycle.
#   store
#   models_only: flags for skipping the creation of view models
#
# With view models, the following are triggered the following Backbone.Events
#   add: (view_model, collection_observable) or if batch: (collection_observable)
#   resort: (view_model, collection_observable, new_index) or if batch: (collection_observable)
#   remove: (view_model, collection_observable) or if batch: (collection_observable)
####################################################

class kb.CollectionObservable extends kb.RefCountable
  constructor: (collection, options={}) ->
    throw 'CollectionObservable: collection is missing' if not collection

    super
    kb.statistics.register('kb.CollectionObservable', @) if kb.statistics     # collect memory management statistics
    observable = kb.utils.wrappedObservable(@, ko.observableArray([]))
    @in_edit = 0

    # bind callbacks
    @__kb or= {}
    @__kb._onCollectionReset = _.bind(@_onCollectionReset, @)
    @__kb._onCollectionResort = _.bind(@_onCollectionResort, @)
    @__kb._onModelAdd = _.bind(@_onModelAdd, @)
    @__kb._onModelRemove = _.bind(@_onModelRemove, @)
    @__kb._onModelChange = _.bind(@_onModelChange, @)

    # always use a store to cache view models
    kb.Store.registerOrCreateStoreFromOptions(collection, observable, options)

    # view model factory create mappings
    factory = kb.utils.wrappedFactory(observable, new kb.Factory(options.factory))
    kb.utils.wrappedPath(observable, options.path)
    @models_path = kb.utils.pathJoin(options.path, 'models')
    if options.view_model
      factory.addPathMapping(@models_path, options.view_model)
    else if options.create
      factory.addPathMapping(@models_path, {create: options.create})
    factory.addPathMappings(options.mappings) if options.mappings

    # add default view model unless models only flag
    @models_only = options.models_only
    if not @models_only and not factory.hasPath(@models_path)
      factory.addPathMapping(@models_path, kb.ViewModel)

    # options
    @sort_attribute = options.sort_attribute
    @sorted_index = options.sorted_index

    # publish public interface on the observable and return instead of this
    observable.retain = _.bind(@retain, @)
    observable.refCount = _.bind(@refCount, @)
    observable.release = _.bind(@release, @)
    observable.collection = _.bind(@collection, @)
    observable.viewModelByModel = _.bind(@viewModelByModel, @)
    observable.sortedIndex = _.bind(@sortedIndex, @)
    observable.sortAttribute = _.bind(@sortAttribute, @)
    observable.hasViewModels = _.bind(@hasViewModels, @)

    # Backbone.Event interface
    observable.bind = _.bind(@bind, @)
    observable.unbind = _.bind(@unbind, @)
    observable.trigger = _.bind(@trigger, @)

    # start the processing
    kb.utils.wrappedObject(observable, null) # clear the collection so it is updated
    @collection(collection, {silent: true, 'defer': options['defer']})

    # start subscribing
    observable.subscribe(_.bind(@_onObservableArrayChange, @))

    return observable

  __destroy: ->
    @collection(null)
    kb.utils.wrappedDestroy(@)
    super

    kb.statistics.unregister('kb.CollectionObservable', @) if kb.statistics     # collect memory management statistics

  # override reference counting return value
  retain: -> super; return kb.utils.wrappedObservable(@)
  release: -> observable = kb.utils.wrappedObservable(@); super; return observable

  collection: (collection, options) ->
    observable = kb.utils.wrappedObservable(@)
    previous_collection = kb.utils.wrappedObject(observable)
    if (arguments.length == 0)
      observable() # force a dependency
      return previous_collection

    # no change
    return if (collection == previous_collection)

    # clean up
    if previous_collection
      @_clear()
      @_collectionUnbind(previous_collection)
      previous_collection.release?()

    # store in _kb_collection so that a collection() function can be exposed on the observable
    kb.utils.wrappedObject(observable, collection)
    if collection
      collection.retain?()
      @_collectionBind(collection)
      @sortedIndex(@sorted_index, @sort_attribute, options)

    return collection

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
      observable = kb.utils.wrappedObservable(@)
      collection = kb.utils.wrappedObject(observable)
      return if (collection.models.length == 0) and (observable().length == 0) # don't do anything
      @_collectionResync(true) # resort everything (TODO: do it incrementally with a notification for resort if not too complex)
      @trigger('resort', observable()) unless options.silent # notify

    # resync now or later
    if options['defer'] then _.defer(_resync) else _resync()
    @

  sortAttribute: (sort_attribute, sorted_index, silent) -> return @sortedIndex(sorted_index, sort_attribute, silent)

  viewModelByModel: (model) ->
    return null unless @hasViewModels()
    observable = kb.utils.wrappedObservable(@)
    id_attribute = if model.hasOwnProperty(model.idAttribute) then model.idAttribute else 'cid'
    return _.find(observable(), (test) -> return (test.__kb.obj[id_attribute] == model[id_attribute]))

  hasViewModels: -> return !@models_only

  ####################################################
  # Internal
  ####################################################
  _collectionBind: (collection) ->
    return unless collection
    collection.bind('reset', @__kb._onCollectionReset)
    collection.bind('resort', @__kb._onCollectionResort) if not @sorted_index
    collection.bind(event, @__kb._onModelAdd) for event in ['new', 'add']
    collection.bind(event, @__kb._onModelRemove) for event in ['remove', 'destroy']
    collection.bind('change', @__kb._onModelChange)

  _collectionUnbind: (collection) ->
    return unless collection
    collection.unbind('reset', @__kb._onCollectionReset)
    collection.unbind('resort', @__kb._onCollectionResort) if not @sorted_index
    collection.unbind(event, @__kb._onModelAdd) for event in ['new', 'add']
    collection.unbind(event, @__kb._onModelRemove) for event in ['remove', 'destroy']
    collection.unbind('change', @__kb._onModelChange)

  _onCollectionReset: ->
    return if @in_edit # we are doing the editing
    @_collectionResync()

  _onCollectionResort: (model_or_models) ->
    throw 'CollectionObservable: collection sorted_index unexpected' if @sorted_index
    if _.isArray(model_or_models)
      observable = kb.utils.wrappedObservable(@)
      @trigger('resort', observable()) # notify
    else
      @_onModelResort(model_or_models)

  _onModelAdd: (model) ->
    model_observable = @_createModelObervable(model)
    observable = kb.utils.wrappedObservable(@)
    collection = kb.utils.wrappedObject(observable)
    if @sorted_index
      add_index = @sorted_index(observable(), model_observable)
    else
      add_index = collection.indexOf(model)

    @in_edit++
    observable.splice(add_index, 0, model_observable)
    @in_edit--
    @trigger('add', model_observable, observable()) # notify

  _onModelRemove: (model) ->
    # either remove a view model or a model
    model_observable = if @hasViewModels() then @viewModelByModel(model) else model
    return unless model_observable  # it may have already been removed
    observable = kb.utils.wrappedObservable(@)
    @in_edit++
    observable.remove(model_observable)
    @in_edit--
    @trigger('remove', model_observable, observable) # notify

    # release
    kb.utils.wrappedStore(observable).releaseObservable(model_observable, kb.utils.wrappedStoreIsOwned(observable)) if @hasViewModels()

  _onModelChange: (model) ->
    # resort if needed
    @_onModelResort(model) if @sorted_index and (not @sort_attribute or model.hasChanged(@sort_attribute))

  _onModelResort: (model) ->
    # either move a view model or a model
    observable = kb.utils.wrappedObservable(@)
    collection = kb.utils.wrappedObject(observable)
    model_observable = if @hasViewModels() then @viewModelByModel(model) else model
    previous_index = observable.indexOf(model_observable)
    if @sorted_index
      sorted_model_observables = _.clone(observable())
      sorted_model_observables.splice(previous_index, 1)  # it is assumed that it is cheaper to copy the array during the test rather than redrawing the views multiple times if it didn't move
      new_index = @sorted_index(sorted_model_observables, model_observable)
    else
      new_index = collection.indexOf(model)
    return if previous_index == new_index # no change

    # either remove a view model or a model
    @in_edit++
    observable.splice(previous_index, 1); observable.splice(new_index, 0, model_observable) # move
    @in_edit--
    @trigger('resort', model_observable, observable(), new_index) # notify

  _onObservableArrayChange: (values) ->
    return if @in_edit # we are doing the editing
    observable = kb.utils.wrappedObservable(@)
    collection = kb.utils.wrappedObject(observable)

    # allow dual-sync for options: https://github.com/kmalakoff/knockback/issues/37
    @in_edit++
    collection.reset(_.map(values, (test) -> return kb.utils.wrappedModel(test)))
    @in_edit--

  _clear: (silent) ->
    observable = kb.utils.wrappedObservable(@)
    @trigger('remove', observable()) if not silent # notify
    @in_edit++
    model_observables = observable.removeAll() # batch
    @in_edit--

    # release
    store = kb.utils.wrappedStore(observable)
    (store.releaseObservable(model_observable, kb.utils.wrappedStoreIsOwned(observable)) for model_observable in model_observables) if @hasViewModels()

  _collectionResync: (silent) ->
    @_clear(silent)
    observable = kb.utils.wrappedObservable(@)
    collection = kb.utils.wrappedObject(observable)

    if @sorted_index
      model_observables = []
      for model in collection.models
        model_observable = @_createModelObervable(model)
        add_index = @sorted_index(model_observables, model_observable)
        model_observables.splice(add_index, 0, model_observable)
    else
      model_observables = if @hasViewModels() then _.map(collection.models, (model) => @_createModelObervable(model)) else _.clone(collection.models)

    @in_edit++
    observable(model_observables)
    @in_edit--
    @trigger('add', observable()) if not silent # notify

  _sortAttributeFn: (sort_attribute) ->
    if @hasViewModels()
      return (view_models, model) -> _.sortedIndex(view_models, model, (test) -> kb.utils.wrappedModel(test).get(sort_attribute))
    else
      return (models, model) -> _.sortedIndex(models, model, (test) -> test.get(sort_attribute))

  _createModelObervable: (model) ->
    observable = kb.utils.wrappedObservable(@)
    return if @hasViewModels() then kb.utils.wrappedStore(observable).resolveObservable(model, @models_path, kb.utils.wrappedFactory(observable)) else model

#######################################
# Mix in Backbone.Events so callers can subscribe
#######################################
kb.CollectionObservable.prototype extends Backbone.Events

# factory function
kb.collectionObservable = (collection, options) -> return new kb.CollectionObservable(collection, options)

# helpers
kb.sortedIndexWrapAttr = kb.siwa = (attribute_name, wrapper_constructor) ->
  return (models, model) -> return _.sortedIndex(models, model, (test) -> return new wrapper_constructor(kb.utils.wrappedModel(test).get(attribute_name)))
