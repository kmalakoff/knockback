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

class Knockback.ViewModel
  constructor: (@model, @options={}, @_kb_view_model) ->
    @ref_count = 1
    throw new Error('ViewModel: model is missing') if not @model

    _.bindAll(this, '_onModelChange', '_onModelLoaded', '_onModelUnloaded')
    if not @_kb_view_model
      @_kb_view_model = this
    else
      @_kb_observables = [] # we are being added to an external view model so we clean up only our observables

    # determine model or model_ref type
    if Backbone.ModelRef and (@model instanceof Backbone.ModelRef)
      @model_ref = @model; @model_ref.retain()
      @model_ref.bind('loaded', @_onModelLoaded)
      @model_ref.bind('unloaded', @_onModelUnloaded)
      @model = @model_ref.getModel()

    # start
    @_onModelLoaded(@model) if not @model_ref or @model_ref.isLoaded()

    return @ if not @options.internals and not @options.requires
    missing = _.union((if @options.internals then @options.internals else []), (if @options.requires then @options.requires else []))
    missing = _.difference(missing, _.keys(@model.attributes)) if not @model_ref or @model_ref.isLoaded()
    @_updateAttributeObservor(@model, key) for key in missing

  _destroy: ->
    (@model.unbind('change', @_onModelChange); @model = null) if @model
    view_model = @_kb_view_model; @_kb_view_model = null
    kb.vmReleaseObservables(view_model, @_kb_observables)
    @_kb_observables = null if @_kb_observables

  # reference counting
  retain: ->
    throw new Error("ViewModel: ref_count is corrupt: " + @ref_count) if (@ref_count <= 0)
    @ref_count++
    @

  release: ->
    throw new Error("ViewModel: ref_count is corrupt: " + @ref_count) if (@ref_count <= 0)
    @ref_count--
    @_destroy(this) if (@ref_count == 0)
    @

  refCount: -> return @ref_count

  ####################################################
  # Internal
  ####################################################
  _onModelLoaded: (model) ->
    @model = model
    @model.bind('change', @_onModelChange) # all attributes if it is manually triggered
    @_updateAttributeObservor(@model, key) for key of @model.attributes

  _onModelUnloaded: (model) ->
    @model.unbind('change', @_onModelChange) # all attributes if it is manually triggered
    model = @model; @model = null
    @_updateAttributeObservor(@model, key) for key of model.attributes

  _onModelChange: ->
    return if not @model._changed
    (@_updateAttributeObservor(@model, key) if @model.hasChanged(key)) for key of @model.attributes

  _updateAttributeObservor: (model, key) ->
    vm_key = if @options.internals and _.contains(@options.internals, key) then '_' + key else key

    if (@_kb_view_model.hasOwnProperty(vm_key))
      @_kb_view_model[vm_key].setModel(model) if @_kb_view_model[vm_key]
    else
      @_kb_observables.push(vm_key) if @_kb_observables
      @_kb_view_model[vm_key] = new AttributeConnector(model, key, @options.read_only)

# factory function
Knockback.viewModel = (model, options, view_model) -> return new Knockback.ViewModel(model, options, view_model)