###
  knockback_model_attribute_observable.js
  (c) 2011 Kevin Malakoff.
  Knockback.ModelAttributeObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###
throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file') if not this.Knockback

####################################################
# options
#   * read_write - bi-directional
#   * read - called to get the value and each time the locale changes
#   * write - called to set the value (if read_write)
####################################################

class Knockback.ModelAttributeObservable
  constructor: (@model, @bind_info, @view_model) ->
    throw new Error('ModelAttributeObservable: value is missing') if not @model
    throw new Error('ModelAttributeObservable: bind_info is missing') if not @bind_info
    throw new Error('ModelAttributeObservable: bind_info.keypath is missing') if not @bind_info.keypath

    _.bindAll(this, 'destroy', '_onValueChange', '_onGetValue', '_onSetValue', '_onModelLoaded', '_onModelUnloaded')

    # determine model or model_ref type
    if Backbone.ModelRef and (@model instanceof Backbone.ModelRef)
      @model_ref = @model; @model_ref.retain()
      @model_ref.bind('loaded', @_onModelLoaded)
      @model_ref.bind('unloaded', @_onModelUnloaded)
      @model = @model_ref.getModel()

    @in_create = true # filter the forcing on setup
    if @bind_info.read_write
      throw new Error('ModelAttributeObservable: view_model is missing for read_write model attribute') if not @view_model
      @observable = ko.dependentObservable({read: @_onGetValue, write: @_onSetValue, owner: @view_model})
    else
      @observable = ko.dependentObservable(@_onGetValue)
    @in_create = false
    throw new Error('Knockback: forceRefresh is missing. Please upgrade to a compatible version of Knockout.js') if _.isUndefined(@observable.forceRefresh)

    # publish public interface on the observable and return instead of this
    @observable.destroy = @destroy
    @_onModelLoaded(@model) if not @model_ref or @model_ref.isLoaded()
    return @observable

  destroy: ->
    @observable.dispose(); @observable = null
    @_onModelUnloaded(@model) if @model
    if @model_ref
      @model_ref.unbind('loaded', @_onModelLoaded)
      @model_ref.unbind('unloaded', @_onModelUnloaded)
      @model_ref.release(); @model_ref = null
    @bind_info  = null; @view_model = null

  ####################################################
  # Internal
  ####################################################
  _getDefault: ->
    return if not @bind_info.hasOwnProperty('default')
    return if _.isFunction(@bind_info.default) then @bind_info.default() else @bind_info.default

  _onValueChange: ->
    if @localizer and @localizer.forceRefresh
      @localizer.setObservedValue(@model.get(@bind_info.keypath)) if @model
      @localizer.forceRefresh()
    @observable.forceRefresh()

  _onGetValue: ->
    return @_getDefault() if not @model
    return @localizer() if @localizer

    value = if @bind_info.read then @bind_info.read.apply(@view_model, [@model, @bind_info.keypath]) else @model.get(@bind_info.keypath)
    return if value then value else @_getDefault()

  _onSetValue: (value) ->
    return if not @model
    (@localizer(value); return) if @localizer

    # use a localized observable
    @localizer = @bind_info.localizer(value) if value and @bind_info.localizer

    set_info = {}; set_info[@bind_info.keypath] = value
    if @bind_info.write then @bind_info.write.apply(@view_model, [value, @model, set_info]) else @model.set(set_info)

  _onModelLoaded:   (model) ->
    @model = model
    @model.bind('change', @_onValueChange) # all attributes
    @model.bind("change:#{@bind_info.keypath}", @_onValueChange)
    value = if @bind_info.read then @bind_info.read.apply(@view_model, [@model, @bind_info.keypath]) else @model.get(@bind_info.keypath)

    # use a localized observable
    @localizer = @bind_info.localizer(value) if value and @bind_info.localizer

    @_onValueChange() if not @in_create # force an update

  _onModelUnloaded: ->
    (@localizer.destroy(); @localizer = null) if @localizer and @localizer.destroy
    @model.unbind('change', @_onValueChange) # all attributes
    @model.unbind("change:#{@bind_info.keypath}", @_onValueChange)
    @model = null
