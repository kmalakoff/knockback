###
  knockback.js 0.20.5
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

{_, ko} = kb = require './kb'

# @nodoc
assignViewModelKey = (vm, key) ->
  vm_key = if vm.__kb.internals and _.contains(vm.__kb.internals, key) then "_#{key}" else key
  return if vm.__kb.view_model.hasOwnProperty(vm_key) # already exists, skip
  vm.__kb.view_model[vm_key] = null
  return vm_key

# @nodoc
createObservable = (vm, model, key, create_options) ->
  return if vm.__kb.excludes and _.contains(vm.__kb.excludes, key)
  return if vm.__kb.statics and _.contains(vm.__kb.statics, key)
  return unless vm_key = assignViewModelKey(vm, key)
  vm[vm_key] = vm.__kb.view_model[vm_key] = kb.observable(model, key, create_options, vm)

# @nodoc
createStaticObservables = (vm, model) ->
  for key in vm.__kb.statics when vm_key = assignViewModelKey(vm, key)
    if model.has(vm_key)
      vm[vm_key] = vm.__kb.view_model[vm_key] = model.get(vm_key)
    else if vm.__kb.static_defaults and vm_key of vm.__kb.static_defaults
      vm[vm_key] = vm.__kb.view_model[vm_key] = vm.__kb.static_defaults[vm_key]
    else
      delete vm.__kb.view_model[vm_key]
  return

KEYS_OPTIONS = ['keys', 'internals', 'excludes', 'statics', 'static_defaults']

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
  # @nodoc
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
  constructor: (model, options={}, view_model) -> args = Array.prototype.slice.call(if _.isArguments(model) then model else arguments); return kb.ignore =>
    not (model = args.shift()) or kb.isModel(model) or kb._throwUnexpected(@, 'not a model')
    args[0] = {keys: args[0]} if _.isArray(args[0])
    @__kb or= {}; @__kb.view_model = (if args.length > 1 then args.pop() else @)
    options = {}; _.extend(options, arg) for arg in args; options = kb.utils.collapseOptions(options)
    @__kb[key] = options[key] for key in KEYS_OPTIONS when options.hasOwnProperty(key)

    # always use a store to ensure recursive view models are handled correctly
    kb.Store.useOptionsOrCreate(options, model, @)

    # view model factory
    @__kb.path = options.path
    kb.Factory.useOptionsOrCreate(options, @, options.path)

    _model = kb.utils.set(@, '_model', ko.observable())
    @model = ko.computed {
      read: => ko.utils.unwrapObservable(_model)
      write: (new_model) => kb.ignore =>
        return if (kb.utils.wrappedObject(@) is new_model) or kb.wasReleased(@) or not event_watcher

        @__kb.store.reuse(@, kb.utils.resolveModel(new_model))
        event_watcher.emitter(new_model); _model(event_watcher.ee)
        not event_watcher.ee or @createObservables(event_watcher.ee)
    }
    event_watcher = kb.utils.wrappedEventWatcher(@, new kb.EventWatcher(model, @, {emitter: @_model, update: (=> kb.ignore => not event_watcher?.ee or @createObservables(event_watcher?.ee))}))
    kb.utils.wrappedObject(@, model = event_watcher.ee); _model(event_watcher.ee)

    # update the observables
    @__kb.create_options = {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@), path: @__kb.path, event_watcher: kb.utils.wrappedEventWatcher(@)}
    not options.requires or @createObservables(model, options.requires)
    not @__kb.internals or @createObservables(model, @__kb.internals)
    not options.mappings or @createObservables(model, options.mappings)
    not @__kb.statics or createStaticObservables(@, model)
    @createObservables(model, @__kb.keys)

    not kb.statistics or kb.statistics.register('ViewModel', @)     # collect memory management statistics
    return @

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: ->
    @__kb_released = true
    (@__kb.view_model[vm_key] = null for vm_key of @__kb.vm_keys) if @__kb.view_model isnt @ # clear the external references
    @__kb.view_model = @__kb.create_options = null
    kb.releaseKeys(@)
    kb.utils.wrappedDestroy(@)

    not kb.statistics or kb.statistics.unregister('ViewModel', @)     # collect memory management statistics

  # Get the options for a new view model that can be used for sharing view models.
  shareOptions: -> {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@)}

  # create observables manually
  createObservables: (model, keys) ->
    if not keys
      return if @__kb.keys or not model # only use the keys provided
      createObservable(@, model, key, @__kb.create_options) for key of model.attributes
      (createObservable(@, model, key, @__kb.create_options) for key in rel_keys) if rel_keys = kb.orm?.keys?(model)
    else if _.isArray(keys)
      createObservable(@, model, key, @__kb.create_options) for key in keys
    else
      for key, mapping_info of keys when vm_key = assignViewModelKey(@, key)
        mapping_info.key or= vm_key unless _.isString(mapping_info)
        @[vm_key] = @__kb.view_model[vm_key] = kb.observable(model, mapping_info, @__kb.create_options, @)
    return

# Factory function to create a kb.ViewModel.
kb.viewModel = (model, options, view_model) -> return new kb.ViewModel(arguments)