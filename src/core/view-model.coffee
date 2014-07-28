###
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

{_, ko} = kb = require './kb'

# @nodoc
updateObservables = (model) ->
  return if kb.wasReleased(@) or not model

  # NOTE: this does not remove keys that are different between the models
  keys = _.keys(model.attributes)
  keys = _.union(keys, rel_keys) if rel_keys = kb.orm?.keys?(model)
  keys = _.difference(keys, @__kb.excludes) if @__kb.excludes  # remove excludes
  keys = _.difference(keys, @__kb.statics) if @__kb.statics  # remove statics
  missing = _.difference(keys, _.keys(@__kb.model_keys))
  @createObservables(model, missing) if missing.length

# Base class for ViewModels for Models.
#
# @example How to create a ViewModel with first_name and last_name observables.
#   var view_model = kb.viewModel(new Backbone.Model({first_name: "Planet", last_name: "Earth"}));
#
# @example Bulk kb.Observable create using 'key' Object to customize the kb.Observable created per attribute.
#   var ContactViewModel = function(model) {
#     this.loading_message = new kb.LocalizedStringLocalizer(new LocalizedString('loading'));
#     this._auto = kb.viewModel(model, {
#       keys: {
#         name: { key: 'name', 'default': this.loading_message },
#         number: { key: 'number', 'default': this.loading_message },
#         date: { key: 'date', 'default': this.loading_message, localizer: kb.ShortDateLocalizer }
#       }
#     }, this);
#     return this;
#   };
#
# @example Creating ko.Observables on a target ViewModel
#   var view_model = {};
#   kb.viewModel(model, ['name', 'date'], view_model); // observables are added to view_model
#
# @method .extend(prototype_properties, class_properties)
#   Class method for JavaScript inheritance.
#   @param [Object] prototype_properties the properties to add to the prototype
#   @param [Object] class_properties the properties to add to the class
#   @return [kb.ViewModel] the constructor returns 'this'
#   @example
#     var ContactViewModel = kb.ViewModel.extend({
#       constructor: function(model) {
#         kb.ViewModel.prototype.constructor.call(this, model, {internals: ['email', 'date']});   // call super constructor: @name, @_email, and @_date created in super from the model attributes
#         this.email = kb.defaultObservable(this._email, 'your.name@yourplace.com');
#         this.date = new LongDateLocalizer(this._date);
#         return this;
#       }
#     });
#   @example
#     var ViewModel = kb.ViewModel.extend({
#       constructor: function(model){
#         kb.ViewModel.prototype.constructor.apply(this, arguments);
#         this.full_name = ko.computed(function() { return this.first_name() + " " + this.last_name(); }, this);
#       }
#     });
#     var view_model = new ViewModel(model);
#
# @method #model()
#   Dual-purpose getter/setter ko.computed for the observed model.
#   @return [Model|ModelRef|void] getter: the model whose attributes are being observed (can be null) OR setter: void
#   @example
#     var view_model = kb.viewModel(new Backbone.Model({name: 'bob'}));
#     var the_model = view_model.model(); // get
#     view_model.model(new Backbone.Model({name: 'fred'})); // set
#
class kb.ViewModel
  @extend = kb.extend # for Backbone non-Coffeescript inheritance (use "kb.SuperClass.extend({})" in Javascript instead of "class MyClass extends kb.SuperClass")

  # Used to create a new kb.ViewModel.
  #
  # @param [Model|ModelRef] model the model to observe (can be null)
  # @param [Object] options the create options
  # @option options [Array|String] internals an array of atttributes that should be scoped with an underscore, eg. name -> _name
  # @option options [Array|String] requires an array of atttributes that will have kb.Observables created even if they do not exist on the Model. Useful for binding Views that require specific observables to exist
  # @option options [Array|String] keys restricts the keys used on a model. Useful for reducing the number of kb.Observables created from a limited set of Model attributes
  # @option options [Object|Array|String] excludes if an array is supplied, excludes keys to exclude on the view model; for example, if you want to provide a custom implementation. If an Object, it provides options to the kb.Observable constructor.
  # @option options [Array] statics creates non-observable properties on your view model for Model attributes that do not need to be observed for changes.
  # @option options [Object] static_defaults provides default values for statics.
  # @option options [String] path the path to the value (used to create related observables from the factory).
  # @option options [kb.Store] store a store used to cache and share view models.
  # @option options [Object] factories a map of dot-deliminated paths; for example `{'models.name': kb.ViewModel}` to either constructors or create functions. Signature: `{'some.path': function(object, options)}`
  # @option options [kb.Factory] factory a factory used to create view models.
  # @option options [Object] options a set of options merge into these options. Useful for extending options when deriving classes rather than merging them by hand.
  # @return [ko.observable] the constructor returns 'this'
  # @param [Object] view_model a view model to also set the kb.Observables on. Useful when batch creating observable on an owning view model.
  constructor: (model, options, view_model) -> return kb.ignore =>
    not model or (model instanceof kb.Model) or ((typeof(model.get) is 'function') and (typeof(model.bind) is 'function')) or kb._throwUnexpected(@, 'not a model')

    options or= {}
    view_model or= {}

    # bind and extract options
    if _.isArray(options)
      options = {keys: options}
    else
      options = kb.utils.collapseOptions(options)
    @__kb or= {}
    @__kb.vm_keys = {}
    @__kb.model_keys = {}
    @__kb.view_model = if _.isUndefined(view_model) then this else view_model
    @__kb[key] = options[key] for key in ['internals', 'excludes', 'statics', 'static_defaults'] when options.hasOwnProperty(key)

    # always use a store to ensure recursive view models are handled correctly
    kb.Store.useOptionsOrCreate(options, model, @)

    # view model factory
    @__kb.path = options.path
    kb.Factory.useOptionsOrCreate(options, @, options.path)

    _model = kb._wrappedKey(@, '_model', ko.observable())
    @model = ko.computed {
      read: => ko.utils.unwrapObservable(_model)
      write: (new_model) => kb.ignore =>
        return if kb.wasReleased(@)
        return unless event_watcher

        event_watcher.emitter(new_model)
        kb.utils.wrappedObject(@, event_watcher.ee); _model(event_watcher.ee)
        updateObservables.call(@, model) if model = event_watcher.ee
    }
    event_watcher = kb.utils.wrappedEventWatcher(@, new kb.EventWatcher(model, @, {emitter: @_model, update: (=> kb.ignore => updateObservables.call(@, event_watcher?.ee))}))
    kb.utils.wrappedObject(@, model = event_watcher.ee); _model(event_watcher.ee)

    # collect requires and internals first because they could be used to define the include order
    keys = options.requires
    keys = _.union(keys or [], @__kb.internals) if @__kb.internals
    keys = _.union(keys or [], rel_keys) if model and (rel_keys = kb.orm?.keys?(model))

    # collect the important keys
    if options.keys # don't merge all the keys if keys are specified
      if _.isObject(options.keys) and not _.isArray(options.keys)
        mapped_keys = {}
        for vm_key, mapping_info of options.keys
          mapped_keys[if _.isString(mapping_info) then mapping_info else (if mapping_info.key then mapping_info.key else vm_key)] = true
        @__kb.keys = _.keys(mapped_keys)
      else
        @__kb.keys = options.keys
        (keys = if keys then _.union(keys, @__kb.keys) else _.clone(@__kb.keys))
    else if model
      keys = if keys then _.union(keys, _.keys(model.attributes)) else _.keys(model.attributes)
    keys = _.difference(keys, @__kb.excludes) if keys and @__kb.excludes  # remove excludes
    keys = _.difference(keys, @__kb.statics) if keys and @__kb.statics  # remove statics

    # initialize
    @mapObservables(model, options.keys) if _.isObject(options.keys) and not _.isArray(options.keys)
    @mapObservables(model, options.requires) if _.isObject(options.requires) and not _.isArray(options.requires)
    not options.mappings or @mapObservables(model, options.mappings)
    not keys or @createObservables(model, keys)
    not @__kb.statics or @createObservables(model, @__kb.statics, true)

    not kb.statistics or kb.statistics.register('ViewModel', @)     # collect memory management statistics
    return @

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: ->
    @__kb_released = true
    if @__kb.view_model isnt @ # clear the external references
      @__kb.view_model[vm_key] = null for vm_key of @__kb.vm_keys
    @__kb.view_model = null
    kb.releaseKeys(@)
    kb.utils.wrappedDestroy(@)

    not kb.statistics or kb.statistics.unregister('ViewModel', @)     # collect memory management statistics

  # Get the options for a new view model that can be used for sharing view models.
  shareOptions: ->
    return {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@)}

  # Manually add observables to the view model by keys if the obervables do not yet exist
  createObservables: (model, keys, is_static) ->
    if is_static
      static_defaults = @__kb.static_defaults or {}
    else
      create_options = {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@), path: @__kb.path, event_watcher: kb.utils.wrappedEventWatcher(@)}

    for key in keys
      vm_key = if @__kb.internals and _.contains(@__kb.internals, key) then "_#{key}" else key
      continue if @__kb.view_model[vm_key] # already exists, skip

      # add to the keys list
      @__kb.vm_keys[vm_key] = @__kb.model_keys[key] = true

      # create
      if is_static
        if model.has(vm_key)
          @[vm_key] = @__kb.view_model[vm_key] = model.get(vm_key)
        else if vm_key of static_defaults
          @[vm_key] = @__kb.view_model[vm_key] = static_defaults[vm_key]
      else
        create_options.key = key
        @[vm_key] = @__kb.view_model[vm_key] = kb.observable(model, create_options, @)
    return

  # Manually add observables to the view model by object map if the obervables do not yet exist
  mapObservables: (model, mappings) ->
    create_options = {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@), path: @__kb.path, event_watcher: kb.utils.wrappedEventWatcher(@)}
    for vm_key, mapping_info of mappings
      continue if @__kb.view_model[vm_key] # already exists, skip
      mapping_info = if _.isString(mapping_info) then {key: mapping_info} else _.clone(mapping_info)
      mapping_info.key or= vm_key

      # add to the keys list
      @__kb.vm_keys[vm_key] = @__kb.model_keys[mapping_info.key] = true

      # create
      @[vm_key] = @__kb.view_model[vm_key] = kb.observable(model, _.defaults(mapping_info, create_options), @)
    return

# Factory function to create a kb.ViewModel.
kb.viewModel = (model, options, view_model) -> return new kb.ViewModel(model, options, view_model)