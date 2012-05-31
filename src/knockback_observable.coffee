###
  knockback_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

####################################################
# mapping_info
#   * key - required to look up the model's attributes
#   * read - called to get the value and each time the locale changes
#   * write - called to set the value
#   * args - arguments passed to the read and write function
####################################################

class kb.Observable
  constructor: (@model, @mapping_info, @view_model={}) ->
    throw 'Observable: model is missing' if not @model
    throw 'Observable: mapping_info is missing' if not @mapping_info
    @mapping_info = {key: @mapping_info} if _.isString(@mapping_info) or ko.isObservable(@mapping_info)
    throw 'Observable: mapping_info.key is missing' if not @mapping_info.key

    @__kb = {}
    @__kb._onModelChange = _.bind(@_onModelChange, @)
    @__kb._onModelLoaded = _.bind(@_onModelLoaded, @)
    @__kb._onModelUnloaded = _.bind(@_onModelUnloaded, @)

    # LEGACY
    (@mapping_info = _.clone(@mapping_info); @mapping_info.read_only = !@mapping_info.write) if @mapping_info.hasOwnProperty('write') and _.isBoolean(@mapping_info.write)

    # determine model or model_ref type
    if Backbone.ModelRef and (@model instanceof Backbone.ModelRef)
      @model_ref = @model; @model_ref.retain()
      @model_ref.bind('loaded', @__kb._onModelLoaded)
      @model_ref.bind('unloaded', @__kb._onModelUnloaded)
      @model = @model_ref.getModel()

    # internal state
    @__kb.value_observable = ko.observable()
    @__kb.localizer = new @mapping_info.localizer(@_getCurrentValue()) if @mapping_info.localizer
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
      read: _.bind(@_onGetValue, @)
      write: if @mapping_info.read_only then (=> throw "kb.Observable: #{@mapping_info.key} is read only") else _.bind(@_onSetValue, @)
      owner: @view_model
    }))

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)
    observable.setToDefault = _.bind(@setToDefault, @)

    # start
    @model.bind('change', @__kb._onModelChange) if not @model_ref or @model_ref.isLoaded()

    return observable

  destroy: ->
    @__kb.value_observable = null
    kb.utils.wrappedObservable(this).dispose(); kb.utils.wrappedObservable(this, null)
    @__kb._onModelUnloaded(@model) if @model
    if @model_ref
      @model_ref.unbind('loaded', @__kb._onModelLoaded)
      @model_ref.unbind('unloaded', @__kb._onModelUnloaded)
      @model_ref.release(); @model_ref = null
    @mapping_info  = null; @view_model = null
    @__kb = null

  setToDefault: ->
    value = @_getDefaultValue()
    if @__kb.localizer
      @__kb.localizer.observedValue(value)
      value = @__kb.localizer()
    @__kb.value_observable(value) # trigger the dependable

  ####################################################
  # Internal
  ####################################################
  _getDefaultValue: ->
    return '' if not @mapping_info.hasOwnProperty('default')
    return if (typeof(@mapping_info.default) == 'function') then @mapping_info.default() else @mapping_info.default

  _getCurrentValue: ->
    return @_getDefaultValue() if not @model
    key = ko.utils.unwrapObservable(@mapping_info.key)
    args = [key]
    if not _.isUndefined(@mapping_info.args)
      if _.isArray(@mapping_info.args) then (args.push(ko.utils.unwrapObservable(arg)) for arg in @mapping_info.args) else args.push(ko.utils.unwrapObservable(@mapping_info.args))
    return if @mapping_info.read then @mapping_info.read.apply(@view_model, args) else @model.get.apply(@model, args)

  _onGetValue: ->
    # trigger all the dependables
    @__kb.value_observable()
    ko.utils.unwrapObservable(@mapping_info.key)
    if not _.isUndefined(@mapping_info.args)
      if _.isArray(@mapping_info.args) then (ko.utils.unwrapObservable(arg) for arg in @mapping_info.args) else ko.utils.unwrapObservable(@mapping_info.args)
    value = @_getCurrentValue()

    if @__kb.localizer
      @__kb.localizer.observedValue(value)
      value = @__kb.localizer()
    return value

  _onSetValue: (value) ->
    if @__kb.localizer
      @__kb.localizer(value)
      value = @__kb.localizer.observedValue()

    if @model
      set_info = {}; set_info[ko.utils.unwrapObservable(@mapping_info.key)] = value
      args = if (typeof(@mapping_info.write) == 'function') then [value] else [set_info]
      if not _.isUndefined(@mapping_info.args)
        if _.isArray(@mapping_info.args) then (args.push(ko.utils.unwrapObservable(arg)) for arg in @mapping_info.args) else args.push(ko.utils.unwrapObservable(@mapping_info.args))
      if (typeof(@mapping_info.write) == 'function') then @mapping_info.write.apply(@view_model, args) else @model.set.apply(@model, args)
    if @__kb.localizer then @__kb.value_observable(@__kb.localizer()) else @__kb.value_observable(value) # trigger the dependable and store the correct value

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
    @model = model
    @_modelBind(model)
    @_updateValue()

  _onModelUnloaded: (model) ->
    (@__kb.localizer.destroy(); @__kb.localizer = null) if @__kb.localizer and @__kb.localizer.destroy
    @_modelUnbind(model)
    @model = null

  _onModelChange: ->
    return if (@model and @model.hasChanged) and not @model.hasChanged(ko.utils.unwrapObservable(@mapping_info.key)) # no change, nothing to do
    @_updateValue()

  _updateValue: ->
    value = @_getCurrentValue()
    if @__kb.localizer
      @__kb.localizer.observedValue(value)
      value = @__kb.localizer()
    @__kb.value_observable(value) # trigger the dependable

# factory function
kb.observable = (model, mapping_info, view_model) -> return new kb.Observable(model, mapping_info, view_model)