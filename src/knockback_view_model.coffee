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
        if @__kb.model
          value = @__kb.model.get(@key)
          return if @__kb.observable() == value
          @__kb.observable(value)
        throw "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters."
      else if @__kb.model
        set_info = {}; set_info[@key] = value
        @__kb.model.set(set_info)
    )

    # publish public interface on the observable and return instead of this
    @__kb.observable.destroy = _.bind(@destroy, @)
    @__kb.observable.update = _.bind(@update, @)

    # start
    @update(model)

    return kb.unwrapObservable(this)

  destroy: ->
    kb.wrapModel(this, null)
    @__kb.observable = null

  update: (model) ->
    if model
      value = model.get(@key)
      needs_update = (@__kb.model != model) or not _.isEqual(@__kb.observable(), value)
      kb.wrapModel(this, model)
      @__kb.observable(value) if needs_update
    else
      kb.wrapModel(this, null)

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
  constructor: (model, options={}) ->
    super

    # register ourselves to handle recursive view models
    @__kb.store = options.__kb_store || new kb.Store()
    @__kb.store.add(options.__kb_store_key, this) if options.__kb_store_key

    @__kb._onModelChange = _.bind(@_onModelChange, @)
    @__kb._onModelLoaded = _.bind(@_onModelLoaded, @)
    @__kb._onModelUnloaded = _.bind(@_onModelUnloaded, @)
    @__kb.internals = options.internals
    @__kb.requires = options.requires
    @__kb.read_only = options.read_only

    throw new Error('ViewModel: model is missing') unless model
    kb.wrapModel(this, model)

    # determine model or model_ref type
    if Backbone.ModelRef and (model instanceof Backbone.ModelRef)
      @__kb.model_ref = model; @__kb.model_ref.retain()
      kb.wrapModel(this, @__kb.model_ref.getModel())
      @__kb.model_ref.bind('loaded', @__kb._onModelLoaded)
      @__kb.model_ref.bind('unloaded', @__kb._onModelUnloaded)

    # start
    @_onModelLoaded(@__kb.model) if not @__kb.model_ref or @__kb.model_ref.isLoaded()

    return @ if not @__kb.internals and not @__kb.requires
    missing = _.union((if @__kb.internals then @__kb.internals else []), (if @__kb.requires then @__kb.requires else []))
    missing = _.difference(missing, _.keys(@__kb.model.attributes)) if not @__kb.model_ref or @__kb.model_ref.isLoaded()
    @_updateAttributeObservor(@__kb.model, key) for key in missing

  __destroy: ->
    model = @__kb.model; kb.wrapModel(this, null)
    @_modelUnbind(model)
    @__kb.store = null
    super

  ####################################################
  # Internal
  ####################################################
  _modelBind: (model) ->
    return unless model
    model.bind('change', @__kb._onModelChange)
    if Backbone.RelationalModel and (model instanceof Backbone.RelationalModel)
      model.bind('add', @__kb._onModelChange)
      model.bind('remove', @__kb._onModelChange)
      model.bind('update', @__kb._onModelChange)

  _modelUnbind: (model) ->
    return unless model
    model.unbind('change', @__kb._onModelChange)
    if Backbone.RelationalModel and (model instanceof Backbone.RelationalModel)
      model.unbind('add', @__kb._onModelChange)
      model.unbind('remove', @__kb._onModelChange)
      model.unbind('update', @__kb._onModelChange)

  _onModelLoaded: (model) ->
    kb.wrapModel(this, model)
    @_modelBind(model)
    @_updateAttributeObservor(@__kb.model, key) for key of @__kb.model.attributes

  _onModelUnloaded: (model) ->
    @_modelUnbind()
    kb.wrapModel(this, null)
    @_updateAttributeObservor(null, key) for key of model.attributes

  _onModelChange: ->
    # COMPATIBILITY: pre-Backbone-0.9.2 changed attributes hash
    if @__kb.model._changed
      (@_updateAttributeObservor(@__kb.model, key) if @__kb.model.hasChanged(key)) for key of @__kb.model.attributes

    # COMPATIBILITY: post-Backbone-0.9.2 changed attributes hash
    else if @__kb.model.changed
      @_updateAttributeObservor(@__kb.model, key) for key of @__kb.model.changed

  _updateAttributeObservor: (model, key) ->
    vm_key = if @__kb.internals and _.contains(@__kb.internals, key) then '_' + key else key
    value = if model then model.get(key) else null

    if (@hasOwnProperty(vm_key))
      view_model = @[vm_key]
      throw new Error("Knockback.ViewModel: property '#{vm_key}' has been unexpectedly removed") unless view_model
      if view_model.__kb and (view_model.__kb.vm_type == 'CollectionObservable')
        view_model.collection(value)

      # tricky case, if a model in an attribute changes, its dependent observables may get out of sync
      else if view_model.__kb and (view_model.__kb.vm_type == 'ModelViewModel')
        # no change
        current_model = kb.unwrapModel(view_model)
        return if (current_model == value) or (Backbone.ModelRef and (current_model instanceof Backbone.ModelRef) and (current_model.model() == value.model()))

        # recreate the view model
        @[vm_key] = null; kb.vmRelease(view_model)
        @[vm_key] = @__kb.store.resolve(value, => return new @constructor(value, {__kb_store: @__kb.store, __kb_store_key: value}))

      else if view_model.__kb and (view_model.__kb.vm_type == 'AttributeConnector')
        view_model.update(model)

    else
      if (value instanceof Backbone.Collection)
        view_model = @__kb.store.resolve(value, => return kb.collectionObservable(value, {view_model_constructor: @constructor, __kb_store: @__kb.store, __kb_store_key: value}))
        view_model.__kb or= {}; view_model.__kb.vm_type = 'CollectionObservable'

      else if (value instanceof Backbone.Model) or (Backbone.ModelRef and (value instanceof Backbone.ModelRef))
        view_model = @__kb.store.resolve(value, => return new @constructor(value, {__kb_store: @__kb.store, __kb_store_key: value}))
        view_model.__kb or= {}; view_model.__kb.vm_type = 'ModelViewModel'
        kb.wrapModel(view_model, value) if not view_model.__kb.model

      else
         view_model = new AttributeConnector(model, key, @__kb.read_only)
         view_model.__kb or= {}; view_model.__kb.vm_type = 'AttributeConnector'

      @[vm_key] = view_model

# factory function
Knockback.viewModel = (model, options, view_model) -> return new Knockback.ViewModel(model, options, view_model)