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
    kb.stats.collection_observables++ if kb.stats_on     # collect memory management statistics
    observable = kb.utils.wrappedObservable(@, ko.observableArray([]))

    # always use a store to cache view models
    if options.store
      @__kb.store = options.store
      @__kb.store.registerObservable(collection, kb.utils.wrappedObservable(@))
    else
      @__kb.store = new kb.Store(); @__kb.store_is_owned = true

    # view model factory
    @__kb.factory = new kb.Factory(options.path, options.factory)
    @__kb.models_path = kb.utils.pathJoin(options.path, 'models')
    if options.view_model
      @__kb.factory.addPathMapping(@__kb.models_path, options.view_model)
    else if options.create
      @__kb.factory.addPathMapping(@__kb.models_path, {create: options.create})
    @__kb.factory.addPathMappings(options.mappings) if options.mappings

    # add default view model unless models only flag
    @models_only = options.models_only
    if not @models_only and not @__kb.factory.hasPath(@__kb.models_path)
      @__kb.factory.addPathMapping(@__kb.models_path, kb.ViewModel)

    # options
    @sort_attribute = options.sort_attribute
    @sorted_index = options.sorted_index

    # bind callbacks
    @__kb._onCollectionReset = _.bind(@_onCollectionReset, @)
    @__kb._onCollectionResort = _.bind(@_onCollectionResort, @)
    @__kb._onModelAdd = _.bind(@_onModelAdd, @)
    @__kb._onModelRemove = _.bind(@_onModelRemove, @)
    @__kb._onModelChange = _.bind(@_onModelChange, @)

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
    @collection(collection, {silent: true, defer: options.defer})

    return observable

  __destroy: ->
    @collection(null)
    (@__kb.store.destroy(); @__kb.store = null) if @hasViewModels() and @__kb.store_is_owned
    @__kb.factory = null
    @__kb.collection = null
    kb.utils.wrappedObservable(@, null)
    super

    kb.stats.collection_observables-- if kb.stats_on       # collect memory management statistics

  # override reference counting return value
  retain: -> super; return kb.utils.wrappedObservable(@)
  release: -> observable = kb.utils.wrappedObservable(@); super; return observable

  collection: (collection, options) ->
    observable = kb.utils.wrappedObservable(@)
    if (arguments.length == 0)
      observable() # force a dependency
      return @__kb.collection

    # no change
    return if (collection == @__kb.collection)

    # clean up
    if @__kb.collection
      @_clear()
      @_collectionUnbind(@__kb.collection)
      @__kb.collection.release?(); @__kb.collection = null

    # store in _kb_collection so that a collection() function can be exposed on the observable
    @__kb.collection = collection
    if @__kb.collection
      @__kb.collection.retain?()
      @_collectionBind(@__kb.collection)

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
      observable = kb.utils.wrappedObservable(@)
      return if (@__kb.collection.models.length == 0) and (observable().length == 0) # don't do anything
      @_collectionResync(true) # resort everything (TODO: do it incrementally with a notification for resort if not too complex)
      @trigger('resort', observable()) unless options.silent # notify

    # resync now or later
    if options.defer then _.defer(_resync) else _resync()
    @

  sortAttribute: (sort_attribute, sorted_index, silent) -> return @sortedIndex(sorted_index, sort_attribute, silent)

  viewModelByModel: (model) ->
    return null unless @hasViewModels()
    observable = kb.utils.wrappedObservable(@)
    id_attribute = if model.hasOwnProperty(model.idAttribute) then model.idAttribute else 'cid'
    return _.find(observable(), (test) -> return (test.__kb.model[id_attribute] == model[id_attribute]))

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

  _onCollectionReset: -> @_collectionResync()
  _onCollectionResort: (model_or_models) ->
    throw 'CollectionObservable: collection sorted_index unexpected' if @sorted_index
    if _.isArray(model_or_models)
      observable = kb.utils.wrappedObservable(@)
      @trigger('resort', observable()) # notify
    else
      @_onModelResort(model_or_models)

  _onModelAdd: (model) ->
    target = if @hasViewModels() then @_createTarget(model) else model
    observable = kb.utils.wrappedObservable(@)
    if @sorted_index
      add_index = @sorted_index(observable(), target)
    else
      add_index = @__kb.collection.indexOf(model)

    observable.splice(add_index, 0, target)
    @trigger('add', target, observable()) # notify

  _onModelRemove: (model) ->
    # either remove a view model or a model
    target = if @hasViewModels() then @viewModelByModel(model) else model
    return unless target  # it may have already been removed
    observable = kb.utils.wrappedObservable(@)
    observable.remove(target)
    @trigger('remove', target, observable) # notify

    # release
    @__kb.store.releaseObservable(target) if @hasViewModels()

  _onModelChange: (model) ->
    # resort if needed
    @_onModelResort(model) if @sorted_index and (not @sort_attribute or model.hasChanged(@sort_attribute))

  _onModelResort: (model) ->
    # either move a view model or a model
    observable = kb.utils.wrappedObservable(@)
    target = if @hasViewModels() then @viewModelByModel(model) else model
    previous_index = observable.indexOf(target)
    if @sorted_index
      sorted_targets = _.clone(observable())
      sorted_targets.splice(previous_index, 1)  # it is assumed that it is cheaper to copy the array during the test rather than redrawing the views multiple times if it didn't move
      new_index = @sorted_index(sorted_targets, target)
    else
      new_index = @__kb.collection.indexOf(model)
    return if previous_index == new_index # no change

    # either remove a view model or a model
    observable.splice(previous_index, 1); observable.splice(new_index, 0, target) # move
    @trigger('resort', target, observable(), new_index) # notify

  _clear: (silent) ->
    observable = kb.utils.wrappedObservable(@)
    @trigger('remove', observable()) if not silent # notify
    targets = observable.removeAll() # batch

    # release
    (@__kb.store.releaseObservable(target) for target in targets) if @hasViewModels()

  _collectionResync: (silent) ->
    @_clear(silent)
    observable = kb.utils.wrappedObservable(@)

    if @sorted_index
      targets = []
      for model in @__kb.collection.models
        target = @_createTarget(model)
        add_index = @sorted_index(targets, target)
        targets.splice(add_index, 0, target)
    else
      targets = if @hasViewModels() then _.map(@__kb.collection.models, (model) => @_createTarget(model)) else _.clone(@__kb.collection.models)

    observable(targets)
    @trigger('add', observable()) if not silent # notify

  _sortAttributeFn: (sort_attribute) ->
    if @hasViewModels()
      return (view_models, model) -> _.sortedIndex(view_models, model, (test) -> kb.utils.wrappedModel(test).get(sort_attribute))
    else
      return (models, model) -> _.sortedIndex(models, model, (test) -> test.get(sort_attribute))

  _createTarget: (model) ->
    return if @hasViewModels() then @__kb.store.resolveObservable(model, @__kb.models_path, @__kb.factory) else model

#######################################
# Mix in Backbone.Events so callers can subscribe
#######################################
kb.CollectionObservable.prototype extends Backbone.Events

# factory function
kb.collectionObservable = (collection, options) -> return new kb.CollectionObservable(collection, options)

# helpers
kb.sortedIndexWrapAttr = kb.siwa = (attribute_name, wrapper_constructor) ->
  return (models, model) -> return _.sortedIndex(models, model, (test) -> return new wrapper_constructor(kb.utils.wrappedModel(test).get(attribute_name)))
