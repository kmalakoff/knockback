###
  knockback_collection_observable.js
  (c) 2011 Kevin Malakoff.
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
#   view_model_create: (model) -> ... view model create function
#   defer: if you are creating the observable during dependent cycle, you can defer the loading of the collection to avoid a cycle.
#   store
# Optional: If you wish to create view models, you must supply a target observable array and the view_model_create or view_model option.
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
    kb.stats.collection_observables++ if Knockback.stats_on     # collect memory management statistics

    # LEGACY
    if ko.isObservable(options) and options.hasOwnProperty('indexOf')
      kb.utils.legacyWarning('kb.collectionObservable with an external ko.observableArray', '0.16.0', 'Please use the kb.collectionObservable directly instead of passing a ko.observableArray')
      observable = kb.utils.wrappedObservable(this, options)
      options = arguments[2] || {}
      bind_model_changes = true
    else
      observable = kb.utils.wrappedObservable(this, ko.observableArray([]))

    # register ourselves to handle recursive view models
    kb.Store.resolveFromOptions(options, kb.utils.wrappedObservable(this)) unless options.store_skip_resolve

    # always use a store to cache view models
    if options.store then (@__kb.store = options.store) else (@__kb.store = new kb.Store(); @__kb.store_is_owned = true)

    # options
    if options.hasOwnProperty('view_model')
      throw new Error('Knockback.CollectionObservable: options.view_model is empty') if not options.view_model
      @view_model_create_fn = options.view_model
      @view_model_create_with_new = true
    else if options.hasOwnProperty('view_model_constructor')
      throw new Error('Knockback.CollectionObservable: options.view_model_constructor is empty') if not options.view_model_constructor
      kb.utils.legacyWarning('kb.collectionObservable option view_model_constructor', '0.16.0', 'Please use view_model option instead')
      @view_model_create_fn = options.view_model_constructor
      @view_model_create_with_new = true
    else if options.hasOwnProperty('view_model_create')
      throw new Error('Knockback.CollectionObservable: options.view_model_create is empty') if not options.view_model_create
      @view_model_create_fn = options.view_model_create
    else if options.hasOwnProperty('create')
      throw new Error('Knockback.CollectionObservable: options.create is empty') if not options.create
      @view_model_create_fn = options.create
    @sort_attribute = options.sort_attribute
    @sorted_index = options.sorted_index

    # bind callbacks
    @__kb._onCollectionReset = _.bind(@_onCollectionReset, @)
    @__kb._onCollectionResort = _.bind(@_onCollectionResort, @)
    @__kb._onModelAdd = _.bind(@_onModelAdd, @)
    @__kb._onModelRemove = _.bind(@_onModelRemove, @)
    @__kb._onModelChange = _.bind(@_onModelChange, @)

    # LEGACY
    collection.bind('change', => kb.utils.wrappedObservable(this).valueHasMutated()) if bind_model_changes and collection

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
    @view_model_create_fn = null
    @__kb.collection = null
    kb.utils.wrappedObservable(this, null)
    super

    kb.stats.collection_observables-- if Knockback.stats_on       # collect memory management statistics

  # override reference counting return value
  retain: -> super; return kb.utils.wrappedObservable(this)
  release: -> observable = kb.utils.wrappedObservable(this); super; return observable

  collection: (new_collection, options) ->
    observable = kb.utils.wrappedObservable(this)
    if (arguments.length == 0)
      observable() # force a dependency
      return @__kb.collection

    # no change
    return if (new_collection == @__kb.collection)

    # clean up
    if @__kb.collection
      @_clear()
      @_collectionUnbind(@__kb.collection)
      @__kb.collection.release?(); @__kb.collection = null

    # store in _kb_collection so that a collection() function can be exposed on the observable
    @__kb.collection = new_collection
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
      observable = kb.utils.wrappedObservable(this)
      return if (@__kb.collection.models.length == 0) and (observable().length == 0) # don't do anything
      @_collectionResync(true) # resort everything (TODO: do it incrementally with a notification for resort if not too complex)
      @trigger('resort', observable()) unless options.silent # notify

    # resync now or later
    if options.defer then _.defer(_resync) else _resync()
    @

  sortAttribute: (sort_attribute, sorted_index, silent) -> return @sortedIndex(sorted_index, sort_attribute, silent)

  viewModelByModel: (model) ->
    return null unless @hasViewModels()
    observable = kb.utils.wrappedObservable(this)
    id_attribute = if model.hasOwnProperty(model.idAttribute) then model.idAttribute else 'cid'
    return _.find(observable(), (test) -> return (test.__kb.model[id_attribute] == model[id_attribute]))

  hasViewModels: -> return !!@view_model_create_fn

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
    throw new Error("CollectionObservable: collection sorted_index unexpected") if @sorted_index
    if _.isArray(model_or_models)
      observable = kb.utils.wrappedObservable(this)
      @trigger('resort', observable()) # notify
    else
      @_onModelResort(model_or_models)

  _onModelAdd: (model) ->
    target = if @hasViewModels() then @_createTarget(model) else model
    observable = kb.utils.wrappedObservable(this)
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
    observable = kb.utils.wrappedObservable(this)
    observable.remove(target)
    @trigger('remove', target, observable) # notify

    # release
    @__kb.store.release(target) if @hasViewModels()

  _onModelChange: (model) ->
    # resort if needed
    @_onModelResort(model) if @sorted_index and (not @sort_attribute or model.hasChanged(@sort_attribute))

  _onModelResort: (model) ->
    # either move a view model or a model
    observable = kb.utils.wrappedObservable(this)
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
    observable = kb.utils.wrappedObservable(this)
    @trigger('remove', observable()) if not silent # notify
    targets = observable.removeAll() # batch

    # release
    (@__kb.store.release(target) for target in targets) if @hasViewModels()

  _collectionResync: (silent) ->
    @_clear(silent)
    observable = kb.utils.wrappedObservable(this)

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
    create_fn = =>
      options = @__kb.store.addResolverToOptions({}, model)
      observable = kb.utils.wrappedObservable(this)
      view_model = if @view_model_create_with_new then (new @view_model_create_fn(model, options, observable)) else @view_model_create_fn(model, options, observable)
      kb.utils.wrappedModel(view_model, model)
      return view_model

    return if @hasViewModels() then @__kb.store.resolve(model, create_fn) else model

#######################################
# Mix in Backbone.Events so callers can subscribe
#######################################
Knockback.CollectionObservable.prototype extends Backbone.Events

# factory function
Knockback.collectionObservable = (collection, options, legacy) -> return new Knockback.CollectionObservable(collection, options, legacy)

# helpers
Knockback.sortedIndexWrapAttr = Knockback.siwa = (attribute_name, wrapper_constructor) ->
  return (models, model) -> return _.sortedIndex(models, model, (test) -> return new wrapper_constructor(kb.utils.wrappedModel(test).get(attribute_name)))
