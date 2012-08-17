###
  knockback_attribute_observable.js
  (c) 2012 Kevin Malakoff.
  Knockback.AttributeObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.AttributeObservable
  constructor: (model, key, options={}) ->
    kb.utils.wrappedByKey(@, 'vo', ko.observable()) # create a value observable for the first dependency
    observable = kb.utils.wrappedObservable(@, ko.dependentObservable(
      read: _.bind(@read, @)
      write: _.bind(@write, @)
    ))

    kb.utils.wrappedObject(observable, model)
    kb.utils.wrappedStore(observable, options.store)
    kb.utils.wrappedFactory(observable, options.factory)
    kb.utils.wrappedPath(observable, kb.utils.pathJoin(options.path, key))
    @key = key

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

  read: -> return ko.utils.unwrapObservable(kb.utils.wrappedByKey(@, 'vo'))

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
    model = kb.utils.wrappedObject(observable)
    new_value = model.get(@key) if model and not arguments.length

    # set up a new value observable, store separately from the attribute observable so it can be referred to even if the model is not yet loaded
    value_observable = kb.utils.wrappedByKey(@, 'vo')
    (@_createValueObservable(new_value); return) unless value_observable
    type = @valueType()

    if type == kb.TYPE_MODEL
      # no longer a model -> switch types
      if new_value and not new_value instanceof Backbone.Model
        @_createValueObservable(new_value)

      # update if needed
      else
        value_observable.model(new_value) if value_observable.model() isnt new_value

    else if type == kb.TYPE_COLLECTION
      # no longer a collection -> switch types
      if new_value and not new_value instanceof Backbone.Collection
        @_createValueObservable(new_value)

      # update if needed
      else
        value_observable.collection(new_value) if value_observable.collection() isnt new_value

    else # a simple observable
      # now a model or collection -> switch types
      if new_value and (new_value instanceof Backbone.Model or new_value instanceof Backbone.Collection)
        @_createValueObservable(new_value)

      # update if needed
      else
        value_observable(new_value) if value_observable() isnt new_value

  valueType: ->
    value_observable = kb.utils.wrappedByKey(@, 'vo')
    value_observable = @_createValueObservable(new_value) unless value_observable # create so we can check the type

    return kb.TYPE_MODEL        unless ko.isObservable(value_observable) # a view model, recognizes view_models as non-observable
    return kb.TYPE_COLLECTION   if kb.utils.observableInstanceOf(value_observable, kb.CollectionObservable)
    return kb.TYPE_SIMPLE

  _createValueObservable: (new_value) ->
    observable = kb.utils.wrappedObservable(@)
    store = kb.utils.wrappedStore(observable)
    previous_value_observable = kb.utils.wrappedByKey(@, 'vo')
    value_observable = kb.utils.wrappedByKey(@, 'vo', store.findOrCreateObservable(new_value, kb.utils.wrappedPath(observable), kb.utils.wrappedFactory(observable)))

    # notify of the change and release the previous
    previous_value_observable.notifySubscribers(ko.utils.unwrapObservable(value_observable))
    store.releaseObservable(previous_value_observable)
    return value_observable

kb.attributeObservable = (model, key, options) -> new kb.AttributeObservable(model, key, options)