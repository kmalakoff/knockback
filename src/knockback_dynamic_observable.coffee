###
  knockback_dynamic_observable.js
  (c) 2012 Kevin Malakoff.
  Knockback.DynamicObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.DynamicObservable
  constructor: (model, options) ->
    kb.utils.throwMissing(this, 'options') unless options

    # extract options
    @key = if _.isString(options) or ko.isObservable(options) then options else options.key
    kb.utils.throwMissing(this, 'key') unless @key

    # set up basics
    kb.utils.wrappedByKey(@, 'vo', ko.observable()) # create a value observable for the first dependency
    observable = kb.utils.wrappedObservable(@, ko.dependentObservable(
      read: _.bind(@read, @)
      write: _.bind(@write, @)
    ))
    kb.utils.wrappedObject(observable, model)
    kb.utils.wrappedStore(observable, options.store)
    kb.utils.wrappedFactory(observable, options.factory)
    kb.utils.wrappedPath(observable, kb.utils.pathJoin(options.path, @key))

    # publish public interface on the observable and return instead of this
    observable.valueType = _.bind(@valueType, @)
    observable.destroy = _.bind(@destroy, @)
    observable.model = _.bind(@model, @)
    observable.update = _.bind(@update, @)

    # update to set up first values observable
    @update()

    return observable

  destroy: ->
    kb.utils.wrappedDestroy(@)

  read: -> 
    ko.utils.unwrapObservable(@key) # create a dependency
    return ko.utils.unwrapObservable(kb.utils.wrappedByKey(@, 'vo')())

  write: (new_value) ->
    # update the model
    observable = kb.utils.wrappedObservable(@)
    model = kb.utils.wrappedObject(observable)
    if model and model.get(@key) isnt new_value
      set_info = {}; set_info[@key] = new_value
      model.set(set_info)

    # update the observable
    @update(new_value)

  model: (new_model) ->
    observable = kb.utils.wrappedObservable(@)
    model = kb.utils.wrappedObject(observable)
    return model if (arguments.length == 0) # get
    return if model is new_model # no change
    kb.utils.wrappedObject(observable, new_model)
    @update()

  update: (new_value) ->
    observable = kb.utils.wrappedObservable(@)
    value = kb.utils.wrappedByKey(@, 'vo')()

    model = kb.utils.wrappedObject(observable)
    new_value = model.get(@key) if model and not arguments.length
    new_type = kb.utils.valueType(new_value)

    # create or change in type
    if _.isUndefined(@type) or @type isnt new_type
      @_updateValueObservable(new_value)

    else if @type == kb.TYPE_MODEL
      # update if needed
      value.model(new_value) if value.model() isnt new_value

    else if @type == kb.TYPE_COLLECTION
      value.collection(new_value) if value.collection() isnt new_value

    else # a simple observable
      # update if needed
      value(new_value) if value() isnt new_value

  valueType: ->
    @_updateValueObservable(new_value) unless @value_type # create so we can check the type
    return @value_type

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

    # notify of the change
    kb.utils.wrappedByKey(@, 'vo')(value)

kb.dynamicObservable = (model, key, options) -> new kb.DynamicObservable(model, key, options)