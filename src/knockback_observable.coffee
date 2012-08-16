###
  knockback_observable.js
  (c) 2011, 2012 Kevin Malakoff.
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
  constructor: (model, mapping_info, @view_model={}) ->
    throw 'Observable: model is missing' if not model
    throw 'Observable: mapping_info is missing' if not mapping_info

    # bind callbacks
    @__kb or= {}
    @__kb._onModelChange = _.bind(@_onModelChange, @)
    @__kb._onModelLoaded = _.bind(@_onModelLoaded, @)
    @__kb._onModelUnloaded = _.bind(@_onModelUnloaded, @)

    # extract options
    @key = if _.isString(mapping_info) or ko.isObservable(mapping_info) then mapping_info else mapping_info.key
    throw 'Observable: key is missing' unless @key
    @args = mapping_info.args
    @read = mapping_info.read
    @write = mapping_info.write

    # internal state
    value_observable = kb.utils.wrappedByKey(@, 'vo', ko.observable())
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
      read: _.bind(@_onGetValue, @)
      write: _.bind(@_onSetValue, @)
      owner: @view_model
    }))

    # determine model or model_ref type
    if Backbone.ModelRef and (model instanceof Backbone.ModelRef)
      kb.utils.wrappedModelRef(observable, model, {loaded: @__kb._onModelLoaded, unloaded: @__kb._onModelUnloaded})
      model_ref = model; model =  model_ref.model()
    else
      kb.utils.wrappedObject(observable, model)

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)

    # set up initial values
    if not model_ref or model_ref.isLoaded()
      model.bind('change', @__kb._onModelChange) 
      value_observable.notifySubscribers(value_observable())

    # wrap ourselves with a localizer
    if mapping_info.localizer
      observable = new mapping_info.localizer(observable)

    # wrap ourselves with a default value
    if mapping_info.hasOwnProperty('default')
      observable = kb.defaultWrapper(observable, mapping_info.default)

    return observable

  destroy: ->
    @_modelUnbind(kb.utils.wrappedObject(kb.utils.wrappedObservable(@)))
    @key = null; @args = null; @read = null; @write = null; @view_model = null
    kb.utils.wrappedDestroy(@)

  ####################################################
  # Internal
  ####################################################
  _onGetValue: ->
    value_observable = kb.utils.wrappedByKey(@, 'vo'); value_observable() # create dependency 
    args = [ko.utils.unwrapObservable(@key)] # create dependency if needed
    observable = kb.utils.wrappedObservable(@)
    return null unless observable
    model = kb.utils.wrappedObject(observable)
    return null unless model
    if not _.isUndefined(@args)
      if _.isArray(@args) then (args.push(ko.utils.unwrapObservable(arg)) for arg in @args) else args.push(ko.utils.unwrapObservable(@args))
    return if @read then @read.apply(@view_model, args) else model.get.apply(model, args)

  _onSetValue: (value) ->
    model = kb.utils.wrappedObject(kb.utils.wrappedObservable(@))
    if model
      set_info = {}; set_info[ko.utils.unwrapObservable(@key)] = value
      args = if @write then [value] else [set_info]
      if not _.isUndefined(@args)
        if _.isArray(@args) then (args.push(ko.utils.unwrapObservable(arg)) for arg in @args) else args.push(ko.utils.unwrapObservable(@args))
      if @write then @write.apply(@view_model, args) else model.set.apply(model, args)
    value_observable = kb.utils.wrappedByKey(@, 'vo')
    value_observable(value)

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
    kb.utils.wrappedObject(kb.utils.wrappedObservable(@), model)
    @_modelBind(model)
    value_observable = kb.utils.wrappedByKey(@, 'vo')
    value_observable(@_onGetValue())

  _onModelUnloaded: (model) ->
    (@__kb.localizer.destroy(); @__kb.localizer = null) if @__kb.localizer and @__kb.localizer.destroy
    @_modelUnbind(model)
    kb.utils.wrappedObject(kb.utils.wrappedObservable(@), null)

  _onModelChange: ->
    model = kb.utils.wrappedObject(kb.utils.wrappedObservable(@))
    return if (model and model.hasChanged) and not model.hasChanged(ko.utils.unwrapObservable(@key)) # no change, nothing to do
    value_observable = kb.utils.wrappedByKey(@, 'vo')
    value_observable(@_onGetValue())

# factory function
kb.observable = (model, mapping_info, view_model) -> return new kb.Observable(model, mapping_info, view_model)