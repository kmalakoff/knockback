###
  knockback_view_model.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###
throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file') if not @Knockback

# internal helper
class AttributeConnector
  constructor: (model, @key, @read_only) ->
    @__kb = {}
    @__kb.observable = ko.observable()
    @__kb.observable.subscription = @__kb.observable.subscribe((value) =>
      if @read_only
        if @model
          value = @model.get(@key)
          return if @__kb.observable() == value
          @__kb.observable(value)
        throw "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters."
      else if @model
        set_info = {}; set_info[@key] = value
        @model.set(set_info)
    )

    # publish public interface on the observable and return instead of this
    @__kb.observable.destroy = _.bind(@destroy, @)
    @__kb.observable.update = _.bind(@update, @)

    # start
    @update(model)

    return kb.unwrapObservable(this)

  destroy: ->
    @model = null
    @__kb.observable = null

  update: (model) ->
    if model
      value = model.get(@key)
      needs_update = (@model != model) or not _.isEqual(@__kb.observable(), value)
      @model = model
      @__kb.observable(value) if needs_update
    else
      @model = null

class Knockback.ViewModel_RCBase extends Knockback.RefCountable
  __destroy: ->
    kb.vmReleaseObservables(this)
    super

####################################################
# options
#   * read_only - default is read_write
#   * internals - an array of atttributes that should be scoped with an underscore, eg. name -> _name
#       internals can be used to ensure a required attribute observable exists for later use, eg. for a lazy loaded model
#   * requires - an array of atttributes that should be stubbed out if they don't exist on the model
#       used to ensure a required attribute observable exists for later use, eg. for a lazy loaded model
####################################################

class Knockback.ViewModel extends Knockback.ViewModel_RCBase
  constructor: (model, options={}, view_model) ->
    super

    # register ourselves to handle recursive view models
    @__kb.store = options.__kb_store || new kb.Store()
    @__kb.store.add(options.__kb_store_key, this) if options.__kb_store_key

    @__kb._onModelChange = _.bind(@_onModelChange, @)
    @__kb._onModelLoaded = _.bind(@_onModelLoaded, @)
    @__kb._onModelUnloaded = _.bind(@_onModelUnloaded, @)
    @__kb.model = model
    @__kb.internals = options.internals
    @__kb.requires = options.requires
    @__kb.read_only = options.read_only
    @__kb.view_model = view_model
    throw new Error('ViewModel: model is missing') if not @__kb.model

    if not @__kb.view_model
      @__kb.view_model = this
    else
      @__kb.observables = [] # we are being added to an external view model so we clean up only our observables

    # determine model or model_ref type
    if Backbone.ModelRef and (@__kb.model instanceof Backbone.ModelRef)
      @__kb.model_ref = @__kb.model; @__kb.model_ref.retain()
      @__kb.model = @__kb.model_ref.getModel()
      @__kb.model_ref.bind('loaded', @__kb._onModelLoaded)
      @__kb.model_ref.bind('unloaded', @__kb._onModelUnloaded)

    # start
    @_onModelLoaded(@__kb.model) if not @__kb.model_ref or @__kb.model_ref.isLoaded()

    return @ if not @__kb.internals and not @__kb.requires
    missing = _.union((if @__kb.internals then @__kb.internals else []), (if @__kb.requires then @__kb.requires else []))
    missing = _.difference(missing, _.keys(@__kb.model.attributes)) if not @__kb.model_ref or @__kb.model_ref.isLoaded()
    @_updateAttributeObservor(@__kb.model, key) for key in missing

  __destroy: ->
    (@__kb.model.unbind('change', @__kb._onModelChange); @__kb.model = null) if @__kb.model
    view_model = @__kb.view_model; @__kb.view_model = null
    kb.vmReleaseObservables(view_model, @__kb.observables)
    @__kb.store = null
    @__kb.vm = null
    super

  ####################################################
  # Internal
  ####################################################
  _onModelLoaded: (model) ->
    @__kb.model = model
    @__kb.model.bind('change', @__kb._onModelChange) # all attributes if it is manually triggered
    @_updateAttributeObservor(@__kb.model, key) for key of @__kb.model.attributes

  _onModelUnloaded: (model) ->
    @__kb.model.unbind('change', @__kb._onModelChange) # all attributes if it is manually triggered
    model = @__kb.model; @__kb.model = null
    @_updateAttributeObservor(@__kb.model, key) for key of model.attributes

  _onModelChange: ->
    # COMPATIBILITY: pre-Backbone-0.9.2 changed attributes hash
    if @__kb.model._changed
      (@_updateAttributeObservor(@__kb.model, key) if @__kb.model.hasChanged(key)) for key of @__kb.model.attributes

    # COMPATIBILITY: post-Backbone-0.9.2 changed attributes hash
    else if @__kb.model.changed
      @_updateAttributeObservor(@__kb.model, key) for key of @__kb.model.changed

  _updateAttributeObservor: (model, key) ->
    vm_key = if @__kb.internals and _.contains(@__kb.internals, key) then '_' + key else key

    if (@__kb.view_model.hasOwnProperty(vm_key))
      throw new Error("Knockback.ViewModel: property '#{vm_key}' has been unexpectedly removed") unless @__kb.view_model[vm_key]
      @__kb.view_model[vm_key].update(model) if (@__kb.view_model[vm_key].update)  # manual update required to optimize Backbone.trigger 'change' registrations
    else
      @__kb.observables.push(vm_key) if @__kb.observables

      value = if model then model.get(key) else null
      if (value instanceof Backbone.Collection) or (value instanceof Backbone.Model)
        @__kb.view_model[vm_key] = @__kb.store.resolve(value, =>
          if (value instanceof Backbone.Collection)
            return kb.collectionObservable(value, {view_model_constructor: @constructor, __kb_store: @__kb.store, __kb_store_key: value})
          else
            return new @constructor(value, {__kb_store: @__kb.store, __kb_store_key: value})
        )
      else
        @__kb.view_model[vm_key] = new AttributeConnector(model, key, @__kb.read_only)

# factory function
Knockback.viewModel = (model, options, view_model) -> return new Knockback.ViewModel(model, options, view_model)