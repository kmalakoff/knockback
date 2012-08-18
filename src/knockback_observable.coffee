###
  knockback_observable.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

####################################################
# options
#   * key - required to look up the model's attributes
#   * read - called to get the value and each time the locale changes
#   * write - called to set the value
#   * args - arguments passed to the read and write function
####################################################

class kb.Observable
  constructor: (model, options, @view_model={}) ->
    kb.utils.throwMissing(this, 'model') unless model
    kb.utils.throwMissing(this, 'options') unless options

    # extract options
    @key = if _.isString(options) or ko.isObservable(options) then options else options.key
    kb.utils.throwMissing(this, 'key') unless @key
    @args = options.args
    @read = options.read
    @write = options.write

    # internal state
    value_observable = kb.utils.wrappedByKey(@, 'vo', ko.observable())
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable({
      read: _.bind(@_onGetValue, @)
      write: _.bind(@_onSetValue, @)
      owner: @view_model
    }))

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)

    # wrap ourselves with a localizer
    if options.localizer
      observable = new options.localizer(observable)

    # wrap ourselves with a default value
    if options.hasOwnProperty('default')
      observable = kb.defaultWrapper(observable, options.default)

    # update to set up first values observable
    kb.utils.wrappedModelObservable(@, new kb.ModelObservable(model, {model: _.bind(@model, @), update: _.bind(@update, @), key: @key}))

    return observable

  destroy: ->
    @key = null; @args = null; @read = null; @write = null; @view_model = null
    kb.utils.wrappedDestroy(@)

  model: (new_model) ->
    observable = kb.utils.wrappedObservable(@)
    model = kb.utils.wrappedObject(observable)

    # get or no change
    return model if (arguments.length == 0) or (model is new_model)
    kb.utils.wrappedObject(observable, new_model)
    @update()

  update: ->
    kb.utils.wrappedByKey(@, 'vo').valueHasMutated() # trigger an update

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

# factory function
kb.observable = (model, options, view_model) -> return new kb.Observable(model, options, view_model)