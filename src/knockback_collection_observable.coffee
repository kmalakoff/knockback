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
    not collection or (collection instanceof Backbone.Collection) or throwUnexpected(@, 'not a collection')

    options or= {}
    observable = kb.utils.wrappedObservable(@, ko.observableArray([]))
    observable.__kb_is_co = true # mark as a kb.CollectionObservable
    @in_edit = 0

    # bind callbacks
    @__kb or= {}
    @__kb._onCollectionChange = _.bind(@_onCollectionChange, @)

    # options
    options = collapseOptions(options)
    @sort_attribute = options.sort_attribute
    @sorted_index = options.sorted_index
    @filters = if _.isArray(options.filters) then options.filters else [options.filters] if options.filters
    create_options = @create_options = {store:  kb.Store.useOptionsOrCreate(options, collection, observable)} # create options

    # view model factory create factories
    @path = options.path
    factory = create_options.factory = kb.utils.wrappedFactory(observable, new kb.Factory(options.factory))
    factory.addPathMappings(options.factories, options.path) if options.factories
    create_options.path = kb.utils.pathJoin(options.path, 'models')

    # add or deduce models create information
    create_options.creator = factory.creatorForPath(null, create_options.path)
    if create_options.creator
      @models_only = create_options.creator.models_only
    else
      if options.hasOwnProperty('models_only')
        if options.models_only
          factory.addPathMapping(create_options.path, {models_only: options.models_only})
          @models_only = options.models_only
        else
          factory.addPathMapping(create_options.path, kb.ViewModel)
      else if options.view_model
        factory.addPathMapping(create_options.path, options.view_model)
      else if options.create
        factory.addPathMapping(create_options.path, {create: options.create})
      else
        factory.addPathMapping(create_options.path, kb.ViewModel)
      create_options.creator = factory.creatorForPath(null, create_options.path)

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

    not kb.statistics or kb.statistics.register('CollectionObservable', @)     # collect memory management statistics

    return observable

  destroy: ->
    observable = kb.utils.wrappedObservable(@)
    collection = kb.utils.wrappedObject(observable)
    if collection
      collection.unbind('all', @__kb._onCollectionChange)
      @_clear(true)
      kb.utils.wrappedObject(observable, null)
    @filters = null; @sorted_index; @create_options = null
    kb.utils.wrappedDestroy(@)

    not kb.statistics or kb.statistics.unregister('CollectionObservable', @)     # collect memory management statistics

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
      previous_collection.unbind('all', @__kb._onCollectionChange)
      previous_collection.release?()

    # store in _kb_collection so that a collection() function can be exposed on the observable
    kb.utils.wrappedObject(observable, collection)
    if collection
      collection.bind('all', @__kb._onCollectionChange)
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
      @_collectionResync(true) # resort everything
      @trigger('resort', observable()) unless options.silent # notify

    # resync now or later
    if options['defer'] then _.defer(_resync) else _resync()
    @

  sortAttribute: (sort_attribute, sorted_index, silent) -> return @sortedIndex(sorted_index, sort_attribute, silent)

  viewModelByModel: (model) ->
    return null if @models_only
    id_attribute = if model.hasOwnProperty(model.idAttribute) then model.idAttribute else 'cid'
    return _.find(kb.utils.wrappedObservable(@)(), (test) -> return (test.__kb.object[id_attribute] == model[id_attribute]))

  hasViewModels: -> return not @models_only

  ####################################################
  # Internal
  ####################################################
  _onCollectionChange: (event, arg) ->
    return if @in_edit # we are doing the editing

    switch event
      # collection events
      when 'reset' then @_collectionResync()
      when 'resort'
        return not @sorted_index
        if _.isArray(arg)
          @trigger('resort', kb.utils.wrappedObservable(@)()) # notify
        else
          @_onModelResort(arg)

      # model events
      when 'new', 'add'
        return if @_modelIsFiltered(arg) # filtered

        observable = kb.utils.wrappedObservable(@)
        collection = kb.utils.wrappedObject(observable)
        view_model = @_createViewModel(arg)
        add_index = if @sorted_index then @sorted_index(observable(), view_model) else collection.indexOf(arg)

        @in_edit++
        observable.splice(add_index, 0, view_model)
        @in_edit--
        @trigger('add', view_model, observable()) # notify

      when 'remove', 'destroy' then @_onModelRemove(arg)
      when 'change' then @_onModelChange(arg)

  _onModelRemove: (model) ->
    view_model = if @models_only then model else @viewModelByModel(model) # either remove a view model or a model
    return unless view_model  # it may have already been removed
    observable = kb.utils.wrappedObservable(@)
    @in_edit++
    observable.remove(view_model)
    @in_edit--
    @trigger('remove', view_model, observable) # notify

  _onModelChange: (model) ->
    # filtered, remove
    if @_modelIsFiltered(model)
      @_onModelRemove(model)

    # resort if needed
    else
      @_onModelResort(model) if @sorted_index and (not @sort_attribute or model.hasChanged(@sort_attribute))

  _onModelResort: (model) ->
    # either move a view model or a model
    observable = kb.utils.wrappedObservable(@)
    collection = kb.utils.wrappedObject(observable)
    view_model = if @models_only then model else @viewModelByModel(model)
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

    # check for view models being different (will occur if a ko select selectedOptions is bound to this collection observable) -> update our store
    if not @models_only
      for value in values
        (has_view_model = true; break) if value and not (value instanceof Backbone.Model)
      # ensure we have the right view models in the store
      if has_view_model
        @create_options.store.findOrReplace(kb.utils.wrappedObject(value), @create_options.creator, value) for value in values

    # get the new models
    models = _.map(values, (test) -> return kb.utils.wrappedModel(test))
    if @filters
      models = _.filter(models, (model) => not @_modelIsFiltered(model))

    # a change
    if (models.length isnt values.length) or _.difference(collection.models, models).length
      @in_edit++
      collection.reset(models)
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
    observable = kb.utils.wrappedObservable(@)
    collection = kb.utils.wrappedObject(observable)
    @trigger('remove', observable()) if not silent # notify

    # clear the observable array manually
    array = observable()
    array.splice(0, array.length)

    if @filters
      models = _.filter(collection.models, (model) => not @_modelIsFiltered(model))
    else
      models = collection.models

    if @sorted_index
      view_models = []
      for model in models
        view_model = @_createViewModel(model)
        add_index = @sorted_index(view_models, view_model)
        view_models.splice(add_index, 0, view_model)
    else
      view_models = if @models_only then (if @filters then models else _.clone(models)) else _.map(models, (model) => @_createViewModel(model))

    @in_edit++
    observable(view_models)
    @in_edit--
    @trigger('add', observable()) if not silent # notify

  _sortAttributeFn: (sort_attribute) ->
    if @models_only
      return (models, model) -> _.sortedIndex(models, model, (test) -> test.get(sort_attribute))
    else
      return (view_models, model) -> _.sortedIndex(view_models, model, (test) -> kb.utils.wrappedModel(test).get(sort_attribute))

  _createViewModel: (model) ->
    return if @models_only then model else @create_options.store.findOrCreate(model, @create_options)

  _modelIsFiltered: (model) ->
    if @filters
      for filter in @filters
        filter = ko.utils.unwrapObservable(filter)
        if ((typeof(filter) is 'function') and filter(model)) or (model and (model.id is filter))
          return true
    return false

#######################################
# Mix in Backbone.Events so callers can subscribe
#######################################
kb.CollectionObservable.prototype extends Backbone.Events

# factory function
kb.collectionObservable = (collection, options) -> return new kb.CollectionObservable(collection, options)

# helpers
kb.sortedIndexWrapAttr = kb.siwa = (attribute_name, wrapper_constructor) ->
  return (models, model) -> return _.sortedIndex(models, model, (test) -> return new wrapper_constructor(kb.utils.wrappedModel(test).get(attribute_name)))