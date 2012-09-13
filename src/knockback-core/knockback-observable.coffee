###
  knockback-observable.js
  (c) 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# Base class for observing model attributes.
#
# @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
#   var ContactViewModel = function(model) {
#     this.name = kb.observable(model, 'name');
#     this.number = kb.observable(model, { key: 'number'});
#   };
#   var model = new Contact({ name: 'Ringo', number: '555-555-5556' });
#   var view_model = new ContactViewModel(model);
#
# @example How to create a kb.Observable with a default value.
#   var model = Backbone.Model({name: 'Bob'});
#   var name = kb.observable(model, {key:'name', default: '(none)'}); // name is Bob
#   name.setToDefault(); // name is (none)
class kb.Observable

  # Used to create a new kb.Observable.
  #
  # @param [Backbone.Model] model the model to observe (can be null)
  # @param [String|Array|Object] options the create options. String is a single attribute name, Array is an array of attribute names.
  # @option options [String] key the name of the attribute.
  # @option options [Function] read a function used to provide transform the attribute value before passing it to the caller. Signature: read()
  # @option options [Function] write a function used to provide transform the value before passing it to the model set function. Signature: write(value)
  # @option options [Array] args arguments to pass to the read and write functions (they can be ko.observables). Can be useful for passing arguments to a locale manager.
  # @option options [Constructor] localizer a concrete kb.LocalizedObservable constructor for localization.
  # @option options [Data|ko.observable] default the default value. Can be a value, string or ko.observable.
  # @option options [String] path the path to the value (used to create related observables from the factory).
  # @option options [kb.Store] store a store used to cache and share view models.
  # @option options [kb.Factory] factory a factory used to create view models.
  # @option options [Object] options a set of options merge into these options using _.defaults. Useful for extending options when deriving classes rather than merging them by hand.
  # @return [ko.observable] the constructor does not return 'this' but a ko.observable
  # @note the constructor does not return 'this' but a ko.observable
  constructor: (model, options, @vm) ->
    options or throwMissing(this, 'options')
    @vm or = {}

    # copy create options
    if _.isString(options) or ko.isObservable(options)
      create_options = @create_options = {key: options}
    else
      create_options = @create_options = collapseOptions(options)

    # extract options
    @key = create_options.key; delete create_options.key; @key or throwMissing(this, 'key')
    not create_options.args or (@args = create_options.args; delete create_options.args)
    not create_options.read or (@read = create_options.read; delete create_options.read)
    not create_options.write or (@write = create_options.write; delete create_options.write)
    model_watcher = create_options.model_watcher
    delete create_options.model_watcher

    # set up basics
    @vo = ko.observable(null) # create a value observable for the first dependency
    observable = kb.utils.wrappedObservable(@, ko.dependentObservable(
      read: =>
        # create dependencies if needed
        args = [ko.utils.unwrapObservable(@key)]
        if @args
          if _.isArray(@args) then (args.push(ko.utils.unwrapObservable(arg)) for arg in @args) else args.push(ko.utils.unwrapObservable(@args))

        # read and update
        if @m
          new_value = if @read then @read.apply(@vm, args) else @m.get.apply(@m, args)
          @update(new_value)

        # get the observable
        return ko.utils.unwrapObservable(@vo())

      write: (new_value) =>
        # set on model
        unwrapped_new_value = _unwrapModels(new_value) # unwrap for set (knockout may pass view models which are required for the observable but not the model)
        set_info = {}; set_info[ko.utils.unwrapObservable(@key)] = unwrapped_new_value
        args = if @write then [unwrapped_new_value] else [set_info]
        if @args
          if _.isArray(@args) then (args.push(ko.utils.unwrapObservable(arg)) for arg in @args) else args.push(ko.utils.unwrapObservable(@args))

        # write
        if @m
          if @write then @write.apply(@vm, args) else @m.set.apply(@m, args)

        # update the observable
        @update(new_value)

      owner: @vm
    ))
    observable.__kb_is_o = true # mark as a kb.Observable
    create_options.store = kb.utils.wrappedStore(observable, create_options.store)
    create_options.path = kb.utils.pathJoin(create_options.path, @key)
    if create_options.factories and ((typeof(create_options.factories) == 'function') or create_options.factories.create)
      create_options.factory = kb.utils.wrappedFactory(observable, new kb.Factory(create_options.factory))
      create_options.factory.addPathMapping(create_options.path, create_options.factories)
    else
      create_options.factory = kb.Factory.useOptionsOrCreate(create_options, observable, create_options.path)
    delete create_options.factories

    # publish public interface on the observable and return instead of this
    observable.value = _.bind(@value, @)
    observable.valueType = _.bind(@valueType, @)
    observable.destroy = _.bind(@destroy, @)

    # use external model observable or create
    kb.ModelWatcher.useOptionsOrCreate({model_watcher: model_watcher}, model, @, {model: _.bind(@model, @), update: _.bind(@update, @), key: @key, path: create_options.path})
    @__kb_value or @update() # wasn't loaded so create

    # wrap ourselves with a localizer
    if kb.LocalizedObservable and create_options.localizer
      observable = new create_options.localizer(observable)
      delete create_options.localizer

    # wrap ourselves with a default value
    if kb.DefaultObservable and create_options.hasOwnProperty('default')
      observable = kb.defaultObservable(observable, create_options.default)
      delete create_options.default

    return observable

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: ->
    @__kb_destroyed = true
    kb.release(@__kb_value); @__kb_value = null
    @vm = null
    @create_options = null
    kb.utils.wrappedDestroy(@)

  # @return [kb.CollectionObservable|kb.ViewModel|ko.observable] exposes the raw value inside the kb.observable. For example, if your attribute is a Backbone.Collection, it will hold a kb.CollectionObservable.
  value: ->
    return @__kb_value

  # @return [kb.TYPE_UNKNOWN|kb.TYPE_SIMPLE|kb.TYPE_ARRAY|kb.TYPE_MODEL|kb.TYPE_COLLECTION] provides the type of the wrapped value.
  valueType: ->
    new_value = if @m then @m.get(@key) else null
    @value_type or @_updateValueObservable(new_value) # create so we can check the type
    return @value_type

  # Dual-purpose getter/setter for the observed model.
  #
  # @overload model()
  #   Gets the model or model reference
  #   @return [Backbone.Model|Backbone.ModelRef] the model whose attribute by key is being observed (can be null)
  # @overload model(new_model)
  #   Sets the model or model reference
  #   @param [Backbone.Model|Backbone.ModelRef] new_model the model whose attribute by key will be observed (can be null)
  model: (new_model) ->
    return if @__kb_destroyed # destroyed, nothing to do

    # get or no change
    return @m if (arguments.length == 0) or (@m is new_model)
    @m = new_model
    @update()

  ####################################################
  # Internal
  ####################################################
  # @private
  update: (new_value) ->
    return if @__kb_destroyed # destroyed, nothing to do

    # determine the new type
    new_value = @m.get(ko.utils.unwrapObservable(@key)) if @m and not arguments.length
    new_value or= null # ensure null instead of undefined
    new_type = kb.utils.valueType(new_value)

    # SHARED NULL MODEL - update reference
    if not @__kb_value or (@__kb_value.__kb_destroyed or (@__kb_value.__kb_null and new_value))
      @__kb_value = null
      @value_type = undefined
    value = @__kb_value

    # create or change in type
    if _.isUndefined(@value_type) or (@value_type isnt new_type and new_type isnt KB_TYPE_UNKNOWN)

      # set the collection array
      if (@value_type is KB_TYPE_COLLECTION) and (new_type == KB_TYPE_ARRAY)
        value(new_value)

      else
        @_updateValueObservable(new_value) # create new

    else if @value_type == KB_TYPE_MODEL
      # use the get/set methods
      if typeof(value.model) is 'function'
        value.model(new_value) if value.model() isnt new_value # different so update

      # different so create a new one (no way to update)
      else if kb.utils.wrappedObject(value) isnt new_value
        @_updateValueObservable(new_value) # create new

    else if @value_type == KB_TYPE_COLLECTION
      value.collection(new_value) if value.collection() isnt new_value # different so update

    else # a simple observable
      value(new_value) if value() isnt new_value # different so update

  # @private
  _updateValueObservable: (new_value) ->
    create_options = @create_options
    create_options.creator = kb.utils.inferCreator(new_value, create_options.factory, create_options.path, @m, @key)
    @value_type = KB_TYPE_UNKNOWN
    creator = create_options.creator

    # release the previous value
    previous_value = @__kb_value; @__kb_value = null
    kb.release(previous_value) if previous_value # release previous

    # found a creator
    if creator
      # have the store, use it to create
      if create_options.store
        value = create_options.store.findOrCreate(new_value, create_options)

      # create manually
      else
        if creator.models_only
          value = new_value
          @value_type = KB_TYPE_SIMPLE
        else if creator.create
          value = creator.create(new_value, create_options)
        else
          value = new creator(new_value, create_options)

    # create and cache the type
    else
      @value_type = KB_TYPE_SIMPLE
      if _.isArray(new_value)
        value = ko.observableArray(new_value)
      else
        value = ko.observable(new_value)

    # determine the type
    if @value_type is KB_TYPE_UNKNOWN
      if not ko.isObservable(value) # a view model, recognize view_models as non-observable
        @value_type = KB_TYPE_MODEL
        if typeof(value.model) isnt 'function' # manually cache the model to check for changes later
          kb.utils.wrappedObject(value, new_value)
      else if value.__kb_is_co
        @value_type = KB_TYPE_COLLECTION
      else
        @value_type = KB_TYPE_SIMPLE

    # store the value
    @__kb_value = value
    @vo(value)

kb.observable = (model, options, view_model) -> new kb.Observable(model, options, view_model)