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

class kb.CollectionObservable
  @extend = Backbone.Model.extend # for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")

  constructor: (collection, options) ->
    options or= {}
    observable = kb.utils.wrappedObservable(@, ko.observableArray([]))
    observable.__kb_is_co = true # mark as a kb.CollectionObservable
    @in_edit = 0

    # bind callbacks
    @__kb or= {}
    @__kb._onCollectionReset = _.bind(@_onCollectionReset, @)
    @__kb._onCollectionResort = _.bind(@_onCollectionResort, @)
    @__kb._onModelAdd = _.bind(@_onModelAdd, @)
    @__kb._onModelRemove = _.bind(@_onModelRemove, @)
    @__kb._onModelChange = _.bind(@_onModelChange, @)

    # options
    options = _.defaults(_.clone(options), options.options) if options.options
    @sort_attribute = options.sort_attribute
    @sorted_index = options.sorted_index
    c_options = @c_options = {store:  kb.Store.useOptionsOrCreate(options, collection, observable)} # create options

    # view model factory create factories
    @path = options.path
    factory = c_options.factory = kb.utils.wrappedFactory(observable, new kb.Factory(options.factory))
    factory.addPathMappings(options.factories, options.path) if options.factories
    c_options.path = kb.utils.pathJoin(options.path, 'models')

    # add or deduce models create information
    c_options.creator = factory.creatorForPath(null, c_options.path)
    if c_options.creator
      @models_only = c_options.creator.models_only
    else
      if options.hasOwnProperty('models_only')
        if options.models_only
          factory.addPathMapping(c_options.path, {models_only: options.models_only})
          @models_only = options.models_only
        else
          factory.addPathMapping(c_options.path, kb.ViewModel)
      else if options.view_model
        factory.addPathMapping(c_options.path, options.view_model)
      else if options.create
        factory.addPathMapping(c_options.path, {create: options.create})
      else
        factory.addPathMapping(c_options.path, kb.ViewModel)

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)
    observable.shareOptions = _.bind(@shareOptions, @)
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
    @collection(collection, {silent: true, 'defer': options['defer']}) if collection

    # start subscribing
    observable.subscribe(_.bind(@_onObservableArrayChange, @))

    not kb.statistics or kb.statistics.register(@)     # collect memory management statistics

    return observable

  destroy: ->
    observable = kb.utils.wrappedObservable(@)
    collection = kb.utils.wrappedObject(observable)
    if collection
      @_collectionUnbind(collection)
      @_clear(true)
      kb.utils.wrappedObject(observable, null)
    @c_options = null
    kb.utils.wrappedDestroy(@)

    not kb.statistics or kb.statistics.unregister(@)     # collect memory management statistics

  shareOptions: -> 
    observable = kb.utils.wrappedObservable(@)
    return {store: kb.utils.wrappedStore(observable), factory: kb.utils.wrappedFactory(observable)}

  collection: (collection, options) ->
    observable = kb.utils.wrappedObservable(@)
    previous_collection = kb.utils.wrappedObject(observable)
    if (arguments.length is 0) or (collection == previous_collection)
      observable() # force a dependency
      return previous_collection

    # no change
    collection.retain?() if collection

    # clean up
    if previous_collection
      @_collectionUnbind(previous_collection)
      previous_collection.release?()

    # store in _kb_collection so that a collection() function can be exposed on the observable
    kb.utils.wrappedObject(observable, collection)
    if collection
      @_collectionBind(collection)
      @sortedIndex(@sorted_index, @sort_attribute, options)
    else
      @_clear()

    return collection

  sortedIndex: (sorted_index, sort_attribute, options) ->
    options or= {}
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
    id_attribute = if model.hasOwnProperty(model.idAttribute) then model.idAttribute else 'cid'
    return _.find(kb.utils.wrappedObservable(@)(), (test) -> return (test.__kb.object[id_attribute] == model[id_attribute]))

  hasViewModels: -> return !@models_only

  ####################################################
  # Internal
  ####################################################
  _collectionBind: (collection) ->
    collection.bind('reset', @__kb._onCollectionReset)
    collection.bind('resort', @__kb._onCollectionResort) if not @sorted_index
    collection.bind(event, @__kb._onModelAdd) for event in ['new', 'add']
    collection.bind(event, @__kb._onModelRemove) for event in ['remove', 'destroy']
    collection.bind('change', @__kb._onModelChange)

  _collectionUnbind: (collection) ->
    collection.unbind('reset', @__kb._onCollectionReset)
    collection.unbind('resort', @__kb._onCollectionResort) if not @sorted_index
    collection.unbind(event, @__kb._onModelAdd) for event in ['new', 'add']
    collection.unbind(event, @__kb._onModelRemove) for event in ['remove', 'destroy']
    collection.unbind('change', @__kb._onModelChange)

  _onCollectionReset: ->
    return if @in_edit # we are doing the editing
    @_collectionResync()

  _onCollectionResort: (model_or_models) ->
    not @sorted_index or throwUnexpected(this, 'sorted_index')
    if _.isArray(model_or_models)
      @trigger('resort', kb.utils.wrappedObservable(@)()) # notify
    else
      @_onModelResort(model_or_models)
    @

  _onModelAdd: (model) ->
    view_model = @_createViewModel(model)
    observable = kb.utils.wrappedObservable(@)
    collection = kb.utils.wrappedObject(observable)
    add_index = if @sorted_index then @sorted_index(observable(), view_model) else collection.indexOf(model)

    @in_edit++
    observable.splice(add_index, 0, view_model)
    @in_edit--
    @trigger('add', view_model, observable()) # notify

  _onModelRemove: (model) ->
    # either remove a view model or a model
    view_model = if @hasViewModels() then @viewModelByModel(model) else model
    return unless view_model  # it may have already been removed
    observable = kb.utils.wrappedObservable(@)
    @in_edit++
    observable.remove(view_model)
    @in_edit--
    @trigger('remove', view_model, observable) # notify

  _onModelChange: (model) ->
    # resort if needed
    @_onModelResort(model) if @sorted_index and (not @sort_attribute or model.hasChanged(@sort_attribute))

  _onModelResort: (model) ->
    # either move a view model or a model
    observable = kb.utils.wrappedObservable(@)
    collection = kb.utils.wrappedObject(observable)
    view_model = if @hasViewModels() then @viewModelByModel(model) else model
    previous_index = observable.indexOf(view_model)
    if @sorted_index
      sorted_view_models = _.clone(observable())
      sorted_view_models.splice(previous_index, 1)  # it is assumed that it is cheaper to copy the array during the test rather than redrawing the views multiple times if it didn't move
      new_index = @sorted_index(sorted_view_models, view_model)
    else
      new_index = collection.indexOf(model)
    return if previous_index == new_index # no change

    # either remove a view model or a model
    @in_edit++
    observable.splice(previous_index, 1); observable.splice(new_index, 0, view_model) # move
    @in_edit--
    @trigger('resort', view_model, observable(), new_index) # notify

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

    # don't notify if destroying
    if silent
      array = observable()
      array.splice(0, array.length)
    else
      @in_edit++
      observable.removeAll()
      @in_edit--
    @

  _collectionResync: (silent) ->
    @_clear(silent)
    observable = kb.utils.wrappedObservable(@)
    collection = kb.utils.wrappedObject(observable)

    if @sorted_index
      view_models = []
      for model in collection.models
        view_model = @_createViewModel(model)
        add_index = @sorted_index(view_models, view_model)
        view_models.splice(add_index, 0, view_model)
    else
      view_models = if @hasViewModels() then _.map(collection.models, (model) => @_createViewModel(model)) else _.clone(collection.models)

    @in_edit++
    observable(view_models)
    @in_edit--
    @trigger('add', observable()) if not silent # notify

  _sortAttributeFn: (sort_attribute) ->
    if @hasViewModels()
      return (view_models, model) -> _.sortedIndex(view_models, model, (test) -> kb.utils.wrappedModel(test).get(sort_attribute))
    else
      return (models, model) -> _.sortedIndex(models, model, (test) -> test.get(sort_attribute))

  _createViewModel: (model) ->
    return if @hasViewModels() then @c_options.store.findOrCreateObservable(model, @c_options) else model

#######################################
# Mix in Backbone.Events so callers can subscribe
#######################################
kb.CollectionObservable.prototype extends Backbone.Events

# factory function
kb.collectionObservable = (collection, options) -> return new kb.CollectionObservable(collection, options)

# helpers
kb.sortedIndexWrapAttr = kb.siwa = (attribute_name, wrapper_constructor) ->
  return (models, model) -> return _.sortedIndex(models, model, (test) -> return new wrapper_constructor(kb.utils.wrappedModel(test).get(attribute_name)))
