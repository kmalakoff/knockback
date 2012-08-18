###
  knockback_observable.js
  (c) 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.Observable
  constructor: (model, options, @view_model={}) ->
    kb.utils.throwMissing(this, 'options') unless options

    # extract options
    @key = if _.isString(options) or ko.isObservable(options) then options else options.key
    kb.utils.throwMissing(this, 'key') unless @key
    @args = options.args
    @read = options.read
    @write = options.write

    # set up basics
    kb.utils.wrappedByKey(@, 'vo', ko.observable(null)) # create a value observable for the first dependency
    observable = kb.utils.wrappedObservable(@, ko.dependentObservable(
      read: =>
        # create dependencies if needed
        args = [ko.utils.unwrapObservable(@key)] 
        if @args
          if _.isArray(@args) then (args.push(ko.utils.unwrapObservable(arg)) for arg in @args) else args.push(ko.utils.unwrapObservable(@args))

        # read and update
        observable = kb.utils.wrappedObservable(@)
        current_model = if observable then kb.utils.wrappedObject(observable) else null
        if current_model
          new_value = if @read then @read.apply(@view_model, args) else current_model.get.apply(current_model, args)
          @update(new_value)

        # get the observable
        return ko.utils.unwrapObservable(kb.utils.wrappedByKey(@, 'vo')())

      write: (new_value) =>
        # set on model
        set_info = {}; set_info[ko.utils.unwrapObservable(@key)] = new_value
        args = if @write then [new_value] else [set_info]
        if @args
          if _.isArray(@args) then (args.push(ko.utils.unwrapObservable(arg)) for arg in @args) else args.push(ko.utils.unwrapObservable(@args))

        # write
        current_model = kb.utils.wrappedObject(kb.utils.wrappedObservable(@))
        if current_model
          if @write then @write.apply(@view_model, args) else current_model.set.apply(current_model, args)

        # update the observable
        @update(new_value)

      owner: @view_model
    ))
    kb.utils.wrappedStore(observable, options.store)
    kb.utils.wrappedFactory(observable, options.factory)
    kb.utils.wrappedPath(observable, kb.utils.pathJoin(options.path, @key))

    # publish public interface on the observable and return instead of this
    observable.valueType = _.bind(@valueType, @)
    observable.model = _.bind(@model, @)
    observable.update = _.bind(@update, @)
    observable.destroy = _.bind(@destroy, @)

    # use external model observable or create
    kb.ModelObservable.useOptionsOrCreate(options, model, @, {model: _.bind(@model, @), update: _.bind(@update, @), key: @key})

    # wrap ourselves with a localizer
    if options.localizer
      observable = new options.localizer(observable)

    # wrap ourselves with a default value
    if options.hasOwnProperty('default')
      observable = kb.defaultWrapper(observable, options.default)

    return observable

  destroy: ->
    # manually release the observable since we own it but not the store
    value_observable = kb.utils.wrappedByKey(@, 'vo')
    store = kb.utils.wrappedStore(kb.utils.wrappedObservable(@))
    if store then store.releaseObservable(value_observable()) else kb.utils.release(value_observable()) # release previous
    kb.utils.wrappedByKey(@, 'vo', null)

    kb.utils.wrappedDestroy(@)

  model: (new_model) ->
    observable = kb.utils.wrappedObservable(@)
    model = kb.utils.wrappedObject(observable)

    # get or no change
    return model if (arguments.length == 0) or (model is new_model)
    kb.utils.wrappedObject(observable, new_model)
    return unless new_model # no model
    @update()

  update: (new_value) ->
    observable = kb.utils.wrappedObservable(@)
    model = kb.utils.wrappedObject(observable)
    value = kb.utils.wrappedByKey(@, 'vo')()
    new_value = model.get(ko.utils.unwrapObservable(@key)) if model and not arguments.length
    new_type = kb.utils.valueType(new_value)

    # create or change in type
    if _.isUndefined(@value_type) or (@value_type isnt new_type and new_type isnt kb.TYPE_UNKNOWN)
      @_updateValueObservable(new_value) # create new

    else if @value_type == kb.TYPE_MODEL
      # use the get/set methods
      if typeof(value.model) == 'function'
        value.model(new_value) if value.model() isnt new_value # different so update

      # different so create a new one (no way to update)
      else if kb.utils.wrappedObject(value) isnt new_value
        @_updateValueObservable(new_value) # create new

    else if @value_type == kb.TYPE_COLLECTION
      value.collection(new_value) if value.collection() isnt new_value # different so update

    else # a simple observable
      value(new_value) if value() isnt new_value # different so update

  valueType: ->
    model = kb.utils.wrappedObject(kb.utils.wrappedObservable(@))
    new_value = if model then model.get(@key) else null
    @_updateValueObservable(new_value) unless @value_type # create so we can check the type
    return @value_type

  ####################################################
  # Internal
  ####################################################
  _updateValueObservable: (new_value) ->
    observable = kb.utils.wrappedObservable(@)
    store = kb.utils.wrappedStore(observable)
    if store
      value = store.findOrCreateObservable(new_value, kb.utils.wrappedPath(observable), kb.utils.wrappedFactory(observable))
    else
      value = kb.Factory.createDefault(new_value, {path: kb.utils.wrappedPath(observable)})

    # cache the type
    if not ko.isObservable(value) # a view model, recognize view_models as non-observable
      @value_type = kb.TYPE_MODEL
    else if kb.utils.observableInstanceOf(value, kb.CollectionObservable)
      @value_type = kb.TYPE_COLLECTION
    else
      @value_type = kb.TYPE_SIMPLE

    # set the value
    value_observable = kb.utils.wrappedByKey(@, 'vo')
    if store then store.releaseObservable(value_observable()) else kb.utils.release(value_observable()) # release previous
    value_observable(value)

kb.observable = (model, key, options) -> new kb.Observable(model, key, options)