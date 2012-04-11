###
  knockback_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###
throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file') if not this.Knockback

####################################################
# options
#   * key - required to look up the model's attributes
#   * read - called to get the value and each time the locale changes
#   * write - called to set the value (if read_write) or a boolean to indicate write is enabled
#   * args - arguments passed to the read and write function
####################################################

class Knockback.Observable
  constructor: (@model, @options, @view_model) ->
    throw new Error('Observable: model is missing') if not @model
    throw new Error('Observable: options is missing') if not @options
    @options = {key: @options} if _.isString(@options) or ko.isObservable(@options)
    throw new Error('Observable: options.key is missing') if not @options.key

    _.bindAll(this, 'destroy', 'setToDefault', '_onGetValue', '_onSetValue', '_onModelChange', '_onModelLoaded', '_onModelUnloaded')

    # determine model or model_ref type
    if Backbone.ModelRef and (@model instanceof Backbone.ModelRef)
      @model_ref = @model; @model_ref.retain()
      @model_ref.bind('loaded', @_onModelLoaded)
      @model_ref.bind('unloaded', @_onModelUnloaded)
      @model = @model_ref.getModel()

    # internal state
    @_kb_value_observable = ko.observable()
    @_kb_localizer = new @options.localizer(@_getCurrentValue()) if @options.localizer

    if @options.write
      @view_model = {} if not @view_model   # view model needs to be provided if you need "this" scoped in your view model write function
      @_kb_observable = ko.dependentObservable({read: @_onGetValue, write: @_onSetValue, owner: @view_model})
    else
      @_kb_observable = ko.dependentObservable(@_onGetValue)

    # publish public interface on the observable and return instead of this
    @_kb_observable.destroy = @destroy
    @_kb_observable.setToDefault = @setToDefault

    # start
    @model.bind('change', @_onModelChange) if not @model_ref or @model_ref.isLoaded()

    return kb.wrappedObservable(this)

  destroy: ->
    @_kb_value_observable = null
    @_kb_observable.dispose(); @_kb_observable = null
    @_onModelUnloaded(@model) if @model
    if @model_ref
      @model_ref.unbind('loaded', @_onModelLoaded)
      @model_ref.unbind('unloaded', @_onModelUnloaded)
      @model_ref.release(); @model_ref = null
    @options  = null; @view_model = null

  setToDefault: ->
    value = @_getDefaultValue()
    if @_kb_localizer
      @_kb_localizer.observedValue(value)
      value = @_kb_localizer()
    @_kb_value_observable(value) # trigger the dependable

  ####################################################
  # Internal
  ####################################################
  _getDefaultValue: ->
    return '' if not @options.hasOwnProperty('default')
    return if _.isFunction(@options.default) then @options.default() else @options.default

  _getCurrentValue: ->
    return @_getDefaultValue() if not @model
    key = ko.utils.unwrapObservable(@options.key)
    args = [key]
    if not _.isUndefined(@options.args)
      if _.isArray(@options.args) then (args.push(ko.utils.unwrapObservable(arg)) for arg in @options.args) else args.push(ko.utils.unwrapObservable(@options.args))
    return if @options.read then @options.read.apply(@view_model, args) else @model.get.apply(@model, args)

  _onGetValue: ->
    # trigger all the dependables
    @_kb_value_observable()
    ko.utils.unwrapObservable(@options.key)
    if not _.isUndefined(@options.args)
      if _.isArray(@options.args) then (ko.utils.unwrapObservable(arg) for arg in @options.args) else ko.utils.unwrapObservable(@options.args)
    value = @_getCurrentValue()

    if @_kb_localizer
      @_kb_localizer.observedValue(value)
      value = @_kb_localizer()
    return value

  _onSetValue: (value) ->
    if @_kb_localizer
      @_kb_localizer(value)
      value = @_kb_localizer.observedValue()

    if @model
      set_info = {}; set_info[ko.utils.unwrapObservable(@options.key)] = value
      args = if _.isFunction(@options.write) then [value] else [set_info]
      if not _.isUndefined(@options.args)
        if _.isArray(@options.args) then (args.push(ko.utils.unwrapObservable(arg)) for arg in @options.args) else args.push(ko.utils.unwrapObservable(@options.args))
      if _.isFunction(@options.write) then @options.write.apply(@view_model, args) else @model.set.apply(@model, args)
    if @_kb_localizer then @_kb_value_observable(@_kb_localizer()) else @_kb_value_observable(value) # trigger the dependable and store the correct value

  _onModelLoaded: (model) ->
    @model = model
    @model.bind('change', @_onModelChange) # all attributes if it is manually triggered
    @_updateValue()

  _onModelUnloaded: (model) ->
    (@_kb_localizer.destroy(); @_kb_localizer = null) if @_kb_localizer and @_kb_localizer.destroy
    @model.unbind('change', @_onModelChange) # all attributes if it is manually triggered
    @model = null

  _onModelChange: ->
    return if (@model and @model.hasChanged) and not @model.hasChanged(ko.utils.unwrapObservable(@options.key)) # no change, nothing to do
    @_updateValue()

  _updateValue: ->
    value = @_getCurrentValue()
    if @_kb_localizer
      @_kb_localizer.observedValue(value)
      value = @_kb_localizer()
    @_kb_value_observable(value) # trigger the dependable

# factory function
Knockback.observable = (model, options, view_model) -> return new Knockback.Observable(model, options, view_model)