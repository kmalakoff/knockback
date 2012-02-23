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
    _.bindAll(this, 'destroy', 'setModel')

    @_kb_observable = ko.observable()
    @_kb_observable.subscription = @_kb_observable.subscribe((value) =>
      if @read_only
        if @model
          value = @model.get(@key)
          return if @_kb_observable() == value
          @_kb_observable(value)
        throw "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters."
      else if @model
        set_info = {}; set_info[@key] = value
        @model.set(set_info)
    )

    # publish public interface on the observable and return instead of this
    @_kb_observable.destroy = @destroy
    @_kb_observable.setModel = @setModel

    # start
    @setModel(model) if model

    return kb.wrappedObservable(this)

  destroy: ->
    @model = null
    @_kb_observable = null

  setModel: (model) ->
    if model
      @model = model
      @_kb_observable(@model.get(@key))
    else
      @model = null

####################################################
# options
#   * read_only - default is read_write
#   * internals - an array of atttributes that should be scoped with an underscore, eg. name -> _name
#       internals can be used to ensure a required attribute observable exists for later use, eg. for a lazy loaded model
#   * requires - an array of atttributes that should be stubbed out if they don't exist on the model
#       used to ensure a required attribute observable exists for later use, eg. for a lazy loaded model
####################################################

class Knockback.ViewModel_RCBase
  constructor: ->
    @ref_count = 1

  __destroy: ->
    kb.vmReleaseObservables(this)

  # reference counting
  retain: ->
    throw new Error("ViewModel: ref_count is corrupt: " + @ref_count) if (@ref_count <= 0)
    @ref_count++
    @

  release: ->
    throw new Error("ViewModel: ref_count is corrupt: " + @ref_count) if (@ref_count <= 0)
    @ref_count--
    @__destroy() unless @ref_count
    @

  refCount: -> return @ref_count

class Knockback.ViewModel extends kb.ViewModel_RCBase
  constructor: (model, options={}, view_model) ->
    @_kb_vm = {}
    @_kb_vm.model = model
    @_kb_vm.options = options
    @_kb_vm.view_model = view_model
    throw new Error('ViewModel: model is missing') if not @_kb_vm.model

    _.bindAll(this, '_kb_vm_onModelChange', '_kb_vm_onModelLoaded', '_kb_vm_onModelUnloaded')
    if not @_kb_vm.view_model
      @_kb_vm.view_model = this
    else
      @_kb_vm.observables = [] # we are being added to an external view model so we clean up only our observables

    # determine model or model_ref type
    if Backbone.ModelRef and (@_kb_vm.model instanceof Backbone.ModelRef)
      @_kb_vm.model_ref = @_kb_vm.model; @_kb_vm.model_ref.retain()
      @_kb_vm.model_ref.bind('loaded', @_kb_vm_onModelLoaded)
      @_kb_vm.model_ref.bind('unloaded', @_kb_vm_onModelUnloaded)
      @_kb_vm.model = @_kb_vm.model_ref.getModel()

    # start
    @_kb_vm_onModelLoaded(@_kb_vm.model) if not @_kb_vm.model_ref or @_kb_vm.model_ref.isLoaded()

    return @ if not @_kb_vm.options.internals and not @_kb_vm.options.requires
    missing = _.union((if @_kb_vm.options.internals then @_kb_vm.options.internals else []), (if @_kb_vm.options.requires then @_kb_vm.options.requires else []))
    missing = _.difference(missing, _.keys(@_kb_vm.model.attributes)) if not @_kb_vm.model_ref or @_kb_vm.model_ref.isLoaded()
    @_updateAttributeObservor(@_kb_vm.model, key) for key in missing

  __destroy: ->
    (@_kb_vm.model.unbind('change', @_kb_vm_onModelChange); @_kb_vm.model = null) if @_kb_vm.model
    view_model = @_kb_vm.view_model; @_kb_vm.view_model = null
    kb.vmReleaseObservables(view_model, @_kb_vm.observables)
    @_kb_vm.observables = null if @_kb_vm.observables

  ####################################################
  # Internal
  ####################################################
  _kb_vm_onModelLoaded: (model) ->
    @_kb_vm.model = model
    @_kb_vm.model.bind('change', @_kb_vm_onModelChange) # all attributes if it is manually triggered
    @_updateAttributeObservor(@_kb_vm.model, key) for key of @_kb_vm.model.attributes

  _kb_vm_onModelUnloaded: (model) ->
    @_kb_vm.model.unbind('change', @_kb_vm_onModelChange) # all attributes if it is manually triggered
    model = @_kb_vm.model; @_kb_vm.model = null
    @_updateAttributeObservor(@_kb_vm.model, key) for key of model.attributes

  _kb_vm_onModelChange: ->
    return if not @_kb_vm.model._changed
    (@_updateAttributeObservor(@_kb_vm.model, key) if @_kb_vm.model.hasChanged(key)) for key of @_kb_vm.model.attributes

  _updateAttributeObservor: (model, key) ->
    vm_key = if @_kb_vm.options.internals and _.contains(@_kb_vm.options.internals, key) then '_' + key else key

    if (@_kb_vm.view_model.hasOwnProperty(vm_key))
      @_kb_vm.view_model[vm_key].setModel(model) if @_kb_vm.view_model[vm_key]
    else
      @_kb_vm.observables.push(vm_key) if @_kb_vm.observables
      @_kb_vm.view_model[vm_key] = new AttributeConnector(model, key, @_kb_vm.options.read_only)

# factory function
Knockback.viewModel = (model, options, view_model) -> return new Knockback.ViewModel(model, options, view_model)