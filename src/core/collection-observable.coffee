###
  knockback.js 0.20.5
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

{_, ko} = kb = require './kb'

COMPARE_EQUAL = 0
COMPARE_ASCENDING = -1
COMPARE_DESCENDING = 1

KEYS_PUBLISH = ['destroy', 'shareOptions', 'filters', 'comparator', 'sortAttribute', 'viewModelByModel', 'hasViewModels']

kb.compare = (value_a, value_b) ->
  # String compare
  return value_a.localeCompare("#{value_b}") if _.isString(value_a)
  return value_b.localeCompare("#{value_a}") if _.isString(value_b)

  # compare raw values
  return if (value_a is value_b) then COMPARE_EQUAL else (if (value_a < value_b) then COMPARE_ASCENDING else COMPARE_DESCENDING)

# Base class for observing collections.
#
# @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
#   var collection = new Collection([{name: 'name1'}, {name: 'name2'}]);
#   var view_model = {
#     todos: kb.collectionObservable(collection)
#   };
#
# @example How to access and change the observed collection.
#    var todos = new kb.CollectionObservable(new kb.Collection([{name: 'name1'}, {name: 'name2'}]);
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
#
# @method #collection()
#   Dual-purpose getter/setter ko.computed for the observed collection.
#   @return [Collection|void] getter: the collection whose models are being observed (can be null) OR setter: void
#
class kb.CollectionObservable
  # @nodoc
  @extend = kb.extend # for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")

  # Used to create a new kb.CollectionObservable.
  #
  # When the observable is updated, the following Backbone.Events are triggered:
  #
  # * ***add***: (view_model, collection_observable) or if batch: (collection_observable)
  # * ***resort***: (view_model, collection_observable, new_index) or if batch: (collection_observable)
  # * ***remove***: (view_model, collection_observable) or if batch: (collection_observable)
  #
  # @param [Collection] collection the collection to observe (can be null)
  # @param [Object] options the create options
  # @option options [Boolean] models_only flag for skipping the creation of view models. The collection observable will be populated with (possibly sorted) models.
  # @option options [Boolean] auto_compact flag used to compact memory used by the collection observable when large changes occur, eg. resetting the collection.
  # @option options [Constructor] view_model the view model constructor used for models in the collection. Signature: constructor(model, options)
  # @option options [Function] create a function used to create a view model for models in the collection. Signature: create(model, options)
  # @option options [Object] factories a map of dot-deliminated paths; for example 'models.owner': kb.ViewModel to either constructors or create functions. Signature: 'some.path': function(object, options)
  # @option options [Function] comparator a function that is used to sort an object. Signature: `function(model_a, model_b)` returns negative value for ascending, 0 for equal, and positive for descending
  # @option options [String] sort_attribute the name of an attribute. Default: resort on all changes to a model.
  # @option options [Id|Function|Array] filters filters can be individual ids (observable or simple) or arrays of ids, functions, or arrays of functions.
  # @option options [String] path the path to the value (used to create related observables from the factory).
  # @option options [kb.Store] store a store used to cache and share view models.
  # @option options [kb.Factory] factory a factory used to create view models.
  # @option options [Object] options a set of options merge into these options. Useful for extending options when deriving classes rather than merging them by hand.
  # @return [ko.observableArray] the constructor does not return 'this' but a ko.observableArray
  # @note the constructor does not return 'this' but a ko.observableArray
  constructor: (collection, view_model, options) -> args = Array.prototype.slice.call(if _.isArguments(collection) then collection else arguments); return kb.ignore =>
    collection = if args[0] instanceof kb.Collection then args.shift() else (if _.isArray(args[0]) then new kb.Collection(args.shift()) else new kb.Collection())
    args[0] = {view_model: args[0]} if _.isFunction(args[0])
    options = {}; _.extend(options, arg) for arg in args
    observable = kb.utils.wrappedObservable(@, ko.observableArray([]))
    observable.__kb_is_co = true # mark as a kb.CollectionObservable
    @in_edit = 0

    # bind callbacks
    @__kb or= {}

    # options
    options = kb.utils.collapseOptions(options)
    @auto_compact = true if options.auto_compact
    if options.sort_attribute
      @_comparator = ko.observable(@_attributeComparator(options.sort_attribute))
    else
      @_comparator = ko.observable(options.comparator)
    if options.filters
      @_filters = ko.observableArray(if _.isArray(options.filters) then options.filters else [options.filters] if options.filters)
    else
      @_filters = ko.observableArray([])
    create_options = @create_options = {store:  kb.Store.useOptionsOrCreate(options, collection, observable)} # create options
    kb.utils.wrappedObject(observable, collection)

    # view model factory create factories
    @path = options.path
    create_options.factory = kb.utils.wrappedFactory(observable, @_shareOrCreateFactory(options))
    create_options.path = kb.utils.pathJoin(options.path, 'models')

    # check for models only
    create_options.creator = create_options.factory.creatorForPath(null, create_options.path)
    @models_only = create_options.creator.models_only if create_options.creator

    # publish public interface on the observable and return instead of this
    kb.publishMethods(observable, @, KEYS_PUBLISH)

    # start the processing
    @_collection = ko.observable(collection)
    observable.collection = @collection = ko.computed {
      read: => return @_collection()
      write: (new_collection) => kb.ignore =>
        return if ((previous_collection = @_collection()) is new_collection) # no change
        # @create_options.store.reuse(@, new_collection) # not meant to be shared
        kb.utils.wrappedObject(observable, new_collection)

        # clean up
        previous_collection.unbind('all', @_onCollectionChange) if previous_collection

        # store in _kb_collection so that a collection() function can be exposed on the observable and so the collection can be
        new_collection.bind('all', @_onCollectionChange) if new_collection

        # update references (including notification)
        @_collection(new_collection)
    }
    collection.bind('all', @_onCollectionChange) if collection # bind now

    # observable that will re-trigger when sort or filters or collection changes
    @_mapper = ko.computed =>
      comparator = @_comparator() # create dependency
      filters = @_filters() # create dependency
      (ko.utils.unwrapObservable(filter) for filter in filters) if filters # create a dependency
      current_collection = @_collection() # create dependency
      return if @in_edit # we are doing the editing

      # no models
      observable = kb.utils.wrappedObservable(@)
      previous_view_models = kb.peek(observable)
      models = current_collection.models if current_collection
      if not models or (current_collection.models.length is 0) then view_models = []

      # process filters, sorting, etc
      else
        # apply filters
        models = _.filter(models, (model) => not filters.length or @_selectModel(model))

        # apply sorting
        if comparator
          view_models = _.map(models, (model) => @_createViewModel(model)).sort(comparator)

        # no sorting
        else
          if @models_only
            view_models = if filters.length then models else models.slice() # clone the array if it wasn't filtered
          else
            view_models = _.map(models, (model) => @_createViewModel(model))

      # update the observable array for this collection observable
      @in_edit++
      observable(view_models)
      @in_edit--

      # TODO: release previous
      # unless @models_only
      #   create_options.store.release(view_model) for view_model in previous_view_models
      return

    # start subscribing
    observable.subscribe(_.bind(@_onObservableArrayChange, @))

    not kb.statistics or kb.statistics.register('CollectionObservable', @)     # collect memory management statistics

    return observable

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: ->
    @__kb_released = true
    observable = kb.utils.wrappedObservable(@)
    collection = kb.peek(@_collection); kb.utils.wrappedObject(observable, null)
    if collection
      collection.unbind('all', @_onCollectionChange)
      array = kb.peek(observable); array.splice(0, array.length) # clear the view models or models
    @collection.dispose(); @_collection = observable.collection = @collection = null
    @_mapper.dispose(); @_mapper = null
    kb.release(@_filters); @_filters = null
    @_comparator(null); @_comparator = null
    @create_options = null
    observable.collection = null; kb.utils.wrappedDestroy(@)

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

  # Setter for the filters array for excluding models in the collection observable.
  #
  # @param [Id|Function|Array] filters filters can be individual ids (observable or simple) or arrays of ids, functions, or arrays of functions.
  #
  # @example
  #    // exclude a single model by id
  #    collection_observable.filters(model.id);
  filters: (filters) ->
    if filters
      @_filters(if _.isArray(filters) then filters else [filters])
    else
      @_filters([])

  # Setter for the sorted index function for auto-sorting the ViewModels or Models in a kb.CollectionObservable.
  #
  # @param [Function] comparator a function that returns an index where to insert the model. Signature: function(models, model)
  # @param [Function] comparator a function that is used to sort an object. Signature: `function(model_a, model_b)` returns negative value for ascending, 0 for equal, and positive for descending
  #
  # @example
  #    // change the sorting function
  #    collection_observable.comparator(
  #      function(view_models, vm){
  #        return _.comparator(view_models, vm, (test) -> kb.utils.wrappedModel(test).get('name'));
  #      }
  #    );
  comparator: (comparator) -> @_comparator(comparator)

  # Setter for the sort attribute name for auto-sorting the ViewModels or Models in a kb.CollectionObservable.
  #
  # @param [String] sort_attribute the name of an attribute. Default: resort on all changes to a model.
  #
  # @example
  #    var todos = new kb.CollectionObservable(new Backbone.Collection([{name: 'Zanadu', name: 'Alex'}]));
  #    // in order of Zanadu then Alex
  #    todos.sortAttribute('name');
  #    // in order of Alex then Zanadu
  sortAttribute: (sort_attribute) -> @_comparator(if sort_attribute then @_attributeComparator(sort_attribute) else null)

  # Reverse lookup for a view model by model. If created with models_only option, will return null.
  viewModelByModel: (model) ->
    return null if @models_only
    id_attribute = if model.hasOwnProperty(model.idAttribute) then model.idAttribute else 'cid'
    return _.find(kb.peek(kb.utils.wrappedObservable(@)), (test) -> return if test?.__kb?.object then (test.__kb.object[id_attribute] == model[id_attribute]) else false)

  # Will return true unless created with models_only option.
  #
  # @example
  #   var todos1 = new kb.CollectionObservable(new Backbone.Collection(), {models_only: true});
  #   todos1.hasViewModels();     // false
  #   var todos2 = new kb.CollectionObservable(new Backbone.Collection());
  #   todos2.hasViewModels();     // true
  hasViewModels: -> return not @models_only

  # Compacts the Collection Observable to use the least amount of memory. Currently, this is brute force meaning it releases than regenerates all view models when called.
  #
  compact: -> return kb.ignore =>
    observable = kb.utils.wrappedObservable(@)
    return unless kb.utils.wrappedStoreIsOwned(observable)
    kb.utils.wrappedStore(observable).clear()
    @_collection.notifySubscribers(@_collection())

  ####################################################
  # Internal
  ####################################################

  # @nodoc
  _shareOrCreateFactory: (options) ->
    absolute_models_path = kb.utils.pathJoin(options.path, 'models')
    factories = options.factories

    # check the existing factory
    if (factory = options.factory)
      # models matches, check additional paths
      if (existing_creator = factory.creatorForPath(null, absolute_models_path)) and (not factories or (factories['models'] is existing_creator))
        return factory unless factories # all match, share the factory

        # all match, share the factory
        return factory if factory.hasPathMappings(factories, options.path)

    # need to create a new factory
    factory = new kb.Factory(options.factory)
    factory.addPathMappings(factories, options.path) if factories

    # set up the default create function
    unless factory.creatorForPath(null, absolute_models_path)
      if options.hasOwnProperty('models_only')
        if options.models_only
          factory.addPathMapping(absolute_models_path, {models_only: true})
        else
          factory.addPathMapping(absolute_models_path, kb.ViewModel)
      else if options.view_model
        factory.addPathMapping(absolute_models_path, options.view_model)
      else if options.create
        factory.addPathMapping(absolute_models_path, {create: options.create})
      else
        factory.addPathMapping(absolute_models_path, kb.ViewModel)
    return factory

  # @nodoc
  _onCollectionChange: (event, arg) => return kb.ignore =>
    return if @in_edit or kb.wasReleased(@) # we are doing the editing or have been released

    switch event
      when 'reset'
        if @auto_compact then @compact() else @_collection.notifySubscribers(@_collection())
      when 'sort', 'resort'
        @_collection.notifySubscribers(@_collection())

      when 'new', 'add'
        return unless @_selectModel(arg) # filtered

        observable = kb.utils.wrappedObservable(@)
        collection = @_collection()
        return if (collection.indexOf(arg) == -1) # the model may have been removed before we got a chance to add it
        return if (view_model = @viewModelByModel(arg)) # it may have already been added by a change event
        @in_edit++
        if (comparator = @_comparator())
          observable().push(@_createViewModel(arg))
          observable.sort(comparator)
        else
          observable.splice(collection.indexOf(arg), 0, @_createViewModel(arg))
        @in_edit--

      when 'remove', 'destroy' then @_onModelRemove(arg)
      when 'change'
        # filtered, remove
        return @_onModelRemove(arg) unless @_selectModel(arg)

        view_model = if @models_only then arg else @viewModelByModel(arg)
        return @_onCollectionChange('add', arg) unless view_model # add new
        return unless (comparator = @_comparator())

        @in_edit++
        kb.utils.wrappedObservable(@).sort(comparator)
        @in_edit--

    return

  # @nodoc
  _onModelRemove: (model) ->
    view_model = if @models_only then model else @viewModelByModel(model) # either remove a view model or a model
    return unless view_model  # it may have already been removed
    observable = kb.utils.wrappedObservable(@)
    @in_edit++
    observable.remove(view_model)
    @in_edit--

  # @nodoc
  _onObservableArrayChange: (models_or_view_models) -> return kb.ignore =>
    return if @in_edit # we are doing the editing

    # validate input
    (@models_only and (not models_or_view_models.length or kb.isModel(models_or_view_models[0]))) or (not @models_only and (not models_or_view_models.length or (_.isObject(models_or_view_models[0]) and not kb.isModel(models_or_view_models[0])))) or kb._throwUnexpected(@, 'incorrect type passed')

    observable = kb.utils.wrappedObservable(@)
    collection = kb.peek(@_collection)
    has_filters = kb.peek(@_filters).length
    return if not collection # no collection or we are updating ourselves

    view_models = models_or_view_models

    # set Models
    if @models_only
      models = _.filter(models_or_view_models, (model) => not has_filters or @_selectModel(model))

    # set ViewModels
    else
      not has_filters or (view_models = []) # check for filtering of ViewModels
      models = []
      for view_model in models_or_view_models
        model = kb.utils.wrappedObject(view_model)
        if has_filters
          continue unless @_selectModel(model) # filtered so skip
          view_models.push(view_model)

        # check for view models being different (will occur if a ko select selectedOptions is bound to this collection observable) -> update our store
        if current_view_model = @create_options.store.find(model, @create_options.creator)
          (current_view_model.constructor is view_model.constructor) or kb._throwUnexpected(@, 'replacing different type of view model')
        @create_options.store.retain(view_model, model, @create_options.creator)
        models.push(model)

    # a change, update models
    @in_edit++
    (models_or_view_models.length is view_models.length) or observable(view_models) # replace the ViewModels because they were filtered
    _.isEqual(collection.models, models) or collection.reset(models)
    @in_edit--
    return

  # @nodoc
  _attributeComparator: (sort_attribute) ->
    modelAttributeCompare = (model_a, model_b) ->
      attribute_name = ko.utils.unwrapObservable(sort_attribute)
      kb.compare(model_a.get(attribute_name), model_b.get(attribute_name))
    return (if @models_only then modelAttributeCompare else (model_a, model_b) -> modelAttributeCompare(kb.utils.wrappedModel(model_a), kb.utils.wrappedModel(model_b)))

  # @nodoc
  _createViewModel: (model) ->
    return model if @models_only
    return @create_options.store.retainOrCreate(model, @create_options)

  # @nodoc
  _selectModel: (model) ->
    filters = kb.peek(@_filters)
    for filter in filters
      filter = kb.peek(filter)
      if _.isFunction(filter)
        return false if not filter(model)
      else if _.isArray(filter)
        return false unless model.id in filter
      else
        return false unless model.id is filter
    return true

# factory function
kb.collectionObservable = (collection, view_model, options) -> return new kb.CollectionObservable(arguments)
