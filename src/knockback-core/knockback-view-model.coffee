###
  knockback-view-model.js
  (c) 2011-2013 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# Base class for ViewModels for Models.
#
# @example How to create a ViewModel with first_name and last_name observables.
#   var view_model = kb.viewModel(new Backbone.Model({first_name: "Planet", last_name: "Earth"}));
#
# @example Bulk kb.Observable create using 'key' Object to customize the kb.Observable created per attribute.
#   var ContactViewModel = function(model) {
#     this.loading_message = new kb.LocalizedStringLocalizer(new kb.LocalizedString('loading'));
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
#         this.full_name = ko.dependentObservable(function() { return this.first_name() + " " + this.last_name(); }, this);
#       }
#     });
#     var view_model = new ViewModel(model);
#
# @method #model()
#   Dual-purpose getter/setter ko.dependentObservable/ko.computed for the observed model.
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
  # @option options [Object|Array|String] if an array is supplied, excludes keys to exclude on the view model; for example, if you want to provide a custom implementation. If an Object, it provides options to the kb.Observable constructor.
  # @option options [String] path the path to the value (used to create related observables from the factory).
  # @option options [kb.Store] store a store used to cache and share view models.
  # @option options [Object] factories a map of dot-deliminated paths; for example `{'models.name': kb.ViewModel}` to either constructors or create functions. Signature: `{'some.path': function(object, options)}`
  # @option options [kb.Factory] factory a factory used to create view models.
  # @option options [Object] options a set of options merge into these options using _.defaults. Useful for extending options when deriving classes rather than merging them by hand.
  # @return [ko.observable] the constructor returns 'this'
  # @param [Object] view_model a view model to also set the kb.Observables on. Useful when batch creating observable on an owning view model.
  constructor: (model, options, view_model) ->
    not model or (model instanceof kb.Model) or ((typeof(model.get) is 'function') and (typeof(model.bind) is 'function')) or _throwUnexpected(@, 'not a model')

    options or= {}
    view_model or= {}

    # bind and extract options
    if _.isArray(options)
      options = {keys: options}
    else
      options = collapseOptions(options)
    @__kb or= {}
    @__kb.vm_keys = {}
    @__kb.model_keys = {}
    @__kb.view_model = if _.isUndefined(view_model) then this else view_model
    not options.internals or @__kb.internals = (if _.isArray(options.internals) then options.internals else [options.internals])
    not options.excludes or @__kb.excludes = (if _.isArray(options.excludes) then options.excludes else [options.excludes])

    # always use a store to ensure recursive view models are handled correctly
    kb.Store.useOptionsOrCreate(options, model, @)

    # view model factory
    @__kb.path = options.path
    kb.Factory.useOptionsOrCreate(options, @, options.path)

    # create an observable model function and use watcher
    _mdl = _wrappedKey(@, '_mdl', ko.observable())
    @model = ko.dependentObservable(
      read: => _mdl(); return kb.utils.wrappedObject(@)
      write: (new_model) =>
        return if (kb.utils.wrappedObject(@) is new_model) # no change

        # SHARED NULL MODEL - keep it that way
        (not new_model or _throwUnexpected(@, 'model set on shared null'); return) if this.__kb_null

        # update references
        kb.utils.wrappedObject(@, new_model)
        event_watcher = kb.utils.wrappedEventWatcher(@)
        (_mdl(new_model); return) unless event_watcher # not yet initialized
        event_watcher.emitter(new_model) # sync with event_watcher

        # sync missing attributes
        if not (@__kb.keys or not new_model or not new_model.attributes) # only allow specific keys or nothing to add
          # NOTE: this does not remove keys that are different between the models
          missing = _.difference(_.keys(new_model.attributes), _.keys(@__kb.model_keys))
          @_createObservables(new_model, missing) if missing
        _mdl(new_model)
        return
    )
    event_watcher = kb.utils.wrappedEventWatcher(@, new kb.EventWatcher(model, @, {emitter: @model}))

    # collect requires and internls first because they could be used to define the include order
    (keys = if _.isArray(options.requires) then _.clone(options.requires) else [options.requires]) if options.requires
    (keys = if keys then _.union(keys, @__kb.internals) else _.clone(@__kb.internals)) if @__kb.internals

    # collect the important keys
    if options.keys # don't merge all the keys if keys are specified
      if _.isObject(options.keys) and not _.isArray(options.keys)
        mapped_keys = {}
        for vm_key, mapping_info of options.keys
          mapped_keys[if _.isString(mapping_info) then mapping_info else (if mapping_info.key then mapping_info.key else vm_key)] = true
        @__kb.keys = _.keys(mapped_keys)
      else
        @__kb.keys = if _.isArray(options.keys) then options.keys else [options.keys]
        (keys = if keys then _.union(keys, @__kb.keys) else _.clone(@__kb.keys))
    else
      bb_model = event_watcher.emitter()
      if bb_model and bb_model.attributes
        attribute_keys = _.keys(bb_model.attributes)
        keys = if keys then _.union(keys, attribute_keys) else attribute_keys
    keys = _.difference(keys, @__kb.excludes) if keys and @__kb.excludes  # remove excludes

    # initialize
    @_mapObservables(model, options.keys) if _.isObject(options.keys) and not _.isArray(options.keys)
    @_mapObservables(model, options.requires) if _.isObject(options.requires) and not _.isArray(options.requires)
    not options.mappings or @_mapObservables(model, options.mappings)
    not keys or @_createObservables(model, keys)

    not kb.statistics or kb.statistics.register('ViewModel', @)     # collect memory management statistics

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: ->
    if @__kb.view_model isnt @ # clear the external references
      for vm_key of @__kb.vm_keys
        @__kb.view_model[vm_key] = null
    @__kb.view_model = null
    kb.releaseKeys(@)
    kb.utils.wrappedDestroy(@)

    not kb.statistics or kb.statistics.unregister('ViewModel', @)     # collect memory management statistics

  # Get the options for a new view model that can be used for sharing view models.
  shareOptions: ->
    return {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@)}

  ####################################################
  # Internal
  ####################################################

  # @private
  _createObservables: (model, keys) ->
    create_options = {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@), path: @__kb.path, event_watcher: kb.utils.wrappedEventWatcher(@)}
    for key in keys
      vm_key = if @__kb.internals and _.contains(@__kb.internals, key) then "_#{key}" else key
      continue if @[vm_key] # already exists, skip

      # add to the keys list
      @__kb.vm_keys[vm_key]=true; @__kb.model_keys[key]=true

      # create
      create_options.key = key
      @[vm_key] = @__kb.view_model[vm_key] = kb.observable(model, create_options, @)
    return

  # @private
  _mapObservables: (model, mappings) ->
    create_options = {store: kb.utils.wrappedStore(@), factory: kb.utils.wrappedFactory(@), path: @__kb.path, event_watcher: kb.utils.wrappedEventWatcher(@)}
    for vm_key, mapping_info of mappings
      continue if @[vm_key] # already exists, skip
      mapping_info = if _.isString(mapping_info) then {key: mapping_info} else _.clone(mapping_info)
      mapping_info.key or= vm_key

      # add to the keys list
      @__kb.vm_keys[vm_key]=true; @__kb.model_keys[mapping_info.key]=true

      # create
      @[vm_key] = @__kb.view_model[vm_key] = kb.observable(model, _.defaults(mapping_info, create_options), @)
    return

# Factory function to create a kb.ViewModel.
#
# @mixin
# @author Rockstar Ninja
#
kb.viewModel = (model, options, view_model) -> return new kb.ViewModel(model, options, view_model)