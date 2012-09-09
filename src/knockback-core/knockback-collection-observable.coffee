###
  knockback-collection-observable.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.CollectionObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# Base class for observing collections.
#
# @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
#   var collection = new Backbone.Collection([{name: 'name1'}, {name: 'name2'}]);
#   var view_model = {
#     todos: kb.collectionObservable(collection)
#   };
#
# @example How to access and change the observed collection.
#    var todos = new kb.CollectionObservable(new Backbone.Collection([{name: 'name1'}, {name: 'name2'}]);
#    var current_collection = todos.collection(); // get
#    todos.collection(new Backbone.Collection([{name: 'name3'}, {name: 'name4'}])); // set
#
# @method .extend(prototype_properties, class_properties)
#   Class method for JavaScript inheritance.
#   @param [Object] prototype_properties the properties to add to the prototype
#   @param [Object] class_properties the properties to add to the class
#   @return [ko.observable] the constructor does not return 'this' but a ko.observableArray
#   @example
#     var MyCollectionObservable = kb.CollectionObservable.extend({
#        constructor: function(collection, options) {
#          // the constructor does not return 'this' but a ko.observableArray
#          return kb.CollectionObservable.prototype.constructor.call(this, collection, {
#            view_model: MyViewModel,
#            options: options
#        });
#     });
class kb.CollectionObservable
  @extend = Backbone.Model.extend # for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")

  # Used to create a new kb.CollectionObservable.
  #
  # When the observable is updated, the following Backbone.Events are triggered:
  #
  # * ***add***: (view_model, collection_observable) or if batch: (collection_observable)
  # * ***resort***: (view_model, collection_observable, new_index) or if batch: (collection_observable)
  # * ***remove***: (view_model, collection_observable) or if batch: (collection_observable)
  #
  # @param [Backbone.Collection] collection the collection to observe (can be null)
  # @param [Object] options the create options
  # @option options [Boolean] models_only flag for skipping the creation of view models. The collection observable will be populated with (possibly sorted) models.
  # @option options [Constructor] view_model the view model constructor used for models in the collection. Signature: constructor(model, options)
  # @option options [Function] create a function used to create a view model for models in the collection. Signature: create(model, options)
  # @option options [Object] factories a map of dot-deliminated paths; for example 'models.owner': kb.ViewModel to either constructors or create functions. Signature: 'some.path': function(object, options)
  # @option options [Function] sorted_index_fn a function that returns an index where to insert the model. Signature: function(models, model)
  # @option options [String] sort_attribute the name of an attribute. Default: resort on all changes to a model.
  # @option options [Id|Function|Array] filters filters can be individual ids (observable or simple) or arrays of ids, functions, or arrays of functions.
  # @option options [String] path the path to the value (used to create related observables from the factory).
  # @option options [kb.Store] store a store used to cache and share view models.
  # @option options [kb.Factory] factory a factory used to create view models.
  # @option options [Object] options a set of options merge into these options using _.defaults. Useful for extending options when deriving classes rather than merging them by hand.
  # @return [ko.observableArray] the constructor does not return 'this' but a ko.observableArray
  # @note the constructor does not return 'this' but a ko.observableArray
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
    if options.sort_attribute
      @sorted_index_fn = ko.observable(@_sortAttributeFn(options.sort_attribute))
    else
      if options.sorted_index
        legacyWarning(this, '0.16.2', 'use sorted_index_fn instead')
        options.sorted_index_fn = options.sorted_index
      @sorted_index_fn = ko.observable(options.sorted_index_fn)
    if options.filters
      @filters = ko.observableArray(if _.isArray(options.filters) then options.filters else [options.filters] if options.filters)
    else
      @filters = ko.observableArray([])
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

    # start the processing
    @_col = ko.observable() # use for sorting dependencies
    @collection(collection)

    # observable that will re-trigger when sort or filters or collection changes
    @_mapper = ko.dependentObservable(=>
      observable = kb.utils.wrappedObservable(@)

      # get the filters, sorting, models and create a dependency
      collection = @_col()
      models = collection.models if collection
      sorted_index_fn = @sorted_index_fn()
      filters = @filters()

      # no models
      if not models or (collection.models.length is 0)
        view_models = []

      # process filters, sorting, etc
      else
        # apply filters
        models = _.filter(models, (model) => not @_modelIsFiltered(model)) if filters.length

        # apply sorting
        if sorted_index_fn
          view_models = []
          for model in models
            view_model = @_createViewModel(model)
            add_index = sorted_index_fn(view_models, view_model)
            view_models.splice(add_index, 0, view_model)

        # no sorting
        else
          if @models_only
           view_models = if filters.length then models else _.clone(models) # may need to clone so array isn't shared
          else
            view_models = _.map(models, (model) => @_createViewModel(model))

      # update the observable array for this collection observable
      @in_edit++
      observable(view_models)
      @in_edit--
    )

    # start subscribing
    observable.subscribe(_.bind(@_onObservableArrayChange, @))

    not kb.statistics or kb.statistics.register('CollectionObservable', @)     # collect memory management statistics

    return observable

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: ->
    observable = kb.utils.wrappedObservable(@)
    collection = @_col()
    if collection
      collection.unbind('all', @__kb._onCollectionChange)
      @_clear(true)
    kb.release(@filters); @filters = null; @create_options = null
    kb.utils.wrappedDestroy(@)

    not kb.statistics or kb.statistics.unregister('CollectionObservable', @)     # collect memory management statistics

  # Get the options for a new collection that can be used for sharing view models.
  #
  # @example Sharing view models for an HTML select element.
  #   var selected_collection = new Backbone.Collection();
  #   var available_collection = new Backbone.Collection([{name: 'Bob'}, {name: 'Fred'}]);
  #   var selected = kb.collectionObservable(available_collection);
  #   var available = kb.collectionObservable(available_collection, available_collection.shareOptions()); // view models shared with selected collection observable
  shareOptions: ->
    observable = kb.utils.wrappedObservable(@)
    return {store: kb.utils.wrappedStore(observable), factory: kb.utils.wrappedFactory(observable)}

  # Dual-purpose getter/setter for the observed collection.
  #
  # @overload collection()
  #   Gets the collection from a kb.CollectionObservable
  #   @return [Backbone.Collection] the collection
  # @overload collection(collection)
  #   Sets the collection on a kb.CollectionObservable
  #   @param [Backbone.Collection] collection the collection
  collection: (collection) ->
    observable = kb.utils.wrappedObservable(@)
    previous_collection = @_col()
    if (arguments.length is 0) or (collection == previous_collection)
      observable() # force a dependency
      return previous_collection

    # clean up
    previous_collection.unbind('all', @__kb._onCollectionChange) if previous_collection

    # store in _kb_collection so that a collection() function can be exposed on the observable and so the collection can be
    collection.bind('all', @__kb._onCollectionChange) if collection
    @_col(collection) # update the observed collection to trigger a resync

    return collection

  # Setter for the filters array for excluding models in the collection observable.
  #
  # @param [Id|Function|Array] filters filters can be individual ids (observable or simple) or arrays of ids, functions, or arrays of functions.
  #
  # @example
  #    // change the sorting function
  #    collection_observable.sortedIndex(
  #      function(view_models, vm){
  #        return _.sortedIndex(view_models, vm, (test) -> kb.utils.wrappedModel(test).get('name'));
  #      }
  #    );
  filters: (filters) ->
    if filters
      @filters(if _.isArray(filters) then filters else [filters])
    else
      @filters([])

  # Setter for the sorted index function for auto-sorting the ViewModels or Models in a kb.CollectionObservable.
  #
  # @param [Function] sorted_index_fn a function that returns an index where to insert the model. Signature: function(models, model)
  #
  # @example
  #    // change the sorting function
  #    collection_observable.sortedIndex(
  #      function(view_models, vm){
  #        return _.sortedIndex(view_models, vm, (test) -> kb.utils.wrappedModel(test).get('name'));
  #      }
  #    );
  sortedIndex: (sorted_index_fn) -> @sorted_index_fn(sorted_index_fn)

  # Setter for the sort attribute name for auto-sorting the ViewModels or Models in a kb.CollectionObservable.
  #
  # @param [String] sort_attribute the name of an attribute. Default: resort on all changes to a model.
  #
  # @example
  #    var todos = new kb.CollectionObservable(new Backbone.Collection([{name: 'Zanadu', name: 'Alex'}]));
  #    // in order of Zanadu then Alex
  #    todos.sortAttribute('name');
  #    // in order of Alex then Zanadu
  sortAttribute: (sort_attribute) -> @sorted_index_fn(if sort_attribute then @_sortAttributeFn(sort_attribute) else null)

  # Reverse lookup for a view model by model. If created with models_only option, will return null.
  viewModelByModel: (model) ->
    return null if @models_only
    id_attribute = if model.hasOwnProperty(model.idAttribute) then model.idAttribute else 'cid'
    return _.find(kb.utils.wrappedObservable(@)(), (test) -> return (test.__kb.object[id_attribute] == model[id_attribute]))

  # Will return true unless created with models_only option.
  #
  # @example
  #   var todos1 = new kb.CollectionObservable(new Backbone.Collection(), {models_only: true});
  #   todos1.hasViewModels();     // false
  #   var todos2 = new kb.CollectionObservable(new Backbone.Collection());
  #   todos2.hasViewModels();     // true
  hasViewModels: -> return not @models_only

  ####################################################
  # Internal
  ####################################################

  # @private
  _onCollectionChange: (event, arg) ->
    return if @in_edit # we are doing the editing

    switch event
      when 'reset', 'resort'
        return if event is 'resort' and not @sorted_index_fn() # no sorting
        @_col.notifySubscribers(@_col())

      when 'new', 'add'
        return if @_modelIsFiltered(arg) # filtered

        observable = kb.utils.wrappedObservable(@)
        collection = @_col()
        view_model = @_createViewModel(arg)
        if (sorted_index_fn = @sorted_index_fn())
          add_index = sorted_index_fn(observable(), view_model)
        else
          add_index = collection.indexOf(arg)

        @in_edit++
        observable.splice(add_index, 0, view_model)
        @in_edit--

      when 'remove', 'destroy' then @_onModelRemove(arg)
      when 'change' then @_onModelChange(arg)

  # @private
  _onModelRemove: (model) ->
    view_model = if @models_only then model else @viewModelByModel(model) # either remove a view model or a model
    return unless view_model  # it may have already been removed
    observable = kb.utils.wrappedObservable(@)
    @in_edit++
    observable.remove(view_model)
    @in_edit--

  # @private
  _onModelChange: (model) ->
    # filtered, remove
    if @_modelIsFiltered(model)
      @_onModelRemove(model)

    # resort if needed
    else if @sorted_index_fn()
      @_onModelResort(model)

  # @private
  _onModelResort: (model) ->
    # either move a view model or a model
    observable = kb.utils.wrappedObservable(@)
    view_model = if @models_only then model else @viewModelByModel(model)
    previous_index = observable.indexOf(view_model)
    if @sorted_index_fn
      sorted_view_models = _.clone(observable())
      sorted_view_models.splice(previous_index, 1)  # it is assumed that it is cheaper to copy the array during the test rather than redrawing the views multiple times if it didn't move
      new_index = @sorted_index_fn(sorted_view_models, view_model)
    else
      new_index = @_col().indexOf(model)
    return if previous_index == new_index # no change

    # either remove a view model or a model
    @in_edit++
    observable.splice(previous_index, 1); observable.splice(new_index, 0, view_model) # move
    @in_edit--

  # @private
  _onObservableArrayChange: (values) ->
    return if @in_edit # we are doing the editing
    observable = kb.utils.wrappedObservable(@)
    collection = @_col()
    return unless collection # no collection

    # check for view models being different (will occur if a ko select selectedOptions is bound to this collection observable) -> update our store
    if not @models_only
      for value in values
        (has_view_model = true; break) if value and not (value instanceof Backbone.Model)
      # ensure we have the right view models in the store
      if has_view_model
        @create_options.store.findOrReplace(kb.utils.wrappedObject(value), @create_options.creator, value) for value in values

    # get the new models
    models = _.map(values, (test) -> return kb.utils.wrappedModel(test))
    if @filters().length
      models = _.filter(models, (model) => not @_modelIsFiltered(model))

    # a change
    if (models.length isnt values.length) or _.difference(collection.models, models).length
      @in_edit++
      collection.reset(models)
      @in_edit--
    @

  # @private
  _clear: (silent) ->
    observable = kb.utils.wrappedObservable(@)

    # don't notify if destroying
    if silent
      array = observable()
      array.splice(0, array.length)
    else
      @in_edit++
      observable.removeAll()
      @in_edit--
    @

  # @private
  _sortAttributeFn: (sort_attribute) ->
    if @models_only
      return (models, model) ->
        attribute_name = ko.utils.unwrapObservable(sort_attribute)
        _.sortedIndex(models, model, (test) -> test.get(attribute_name))
    else
      return (view_models, model) ->
        attribute_name = ko.utils.unwrapObservable(sort_attribute)
        _.sortedIndex(view_models, model, (test) -> kb.utils.wrappedModel(test).get(attribute_name))

  # @private
  _createViewModel: (model) ->
    return if @models_only then model else @create_options.store.findOrCreate(model, @create_options)

  # @private
  _modelIsFiltered: (model) ->
    filters = @filters()
    for filter in filters
      filter = ko.utils.unwrapObservable(filter)
      if ((typeof(filter) is 'function') and filter(model)) or (model and (model.id is filter))
        return true
    return false

# factory function
kb.collectionObservable = (collection, options) -> return new kb.CollectionObservable(collection, options)

# helpers
kb.sortedIndexWrapAttr = kb.siwa = (attribute_name, wrapper_constructor) ->
  return (models, model) -> return _.sortedIndex(models, model, (test) -> return new wrapper_constructor(kb.utils.wrappedModel(test).get(attribute_name)))