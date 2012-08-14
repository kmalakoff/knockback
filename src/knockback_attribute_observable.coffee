###
  knockback_attribute_observable.js
  (c) 2012 Kevin Malakoff.
  Knockback.AttributeObservable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.AttributeObservable
  constructor: (model, key, options={}) ->
    kb.utils.wrappedObject(@, model)
    kb.utils.wrappedStore(@, options.store)
    kb.utils.wrappedFactory(@, options.factory)
    kb.utils.wrappedPath(@, options.path)
    @key = key

    # update to create
    @update()

    observable = kb.utils.wrappedObservable(@, ko.dependentObservable(
      read: _.bind(@read, @)
      write: _.bind(@write, @)
    ))

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)
    observable.model = _.bind(@model, @)
    observable.update = _.bind(@update, @)

    return observable

  destroy: ->
    kb.utils.wrappedDestroy(@)

  read: ->
    return ko.utils.unwrapObservable(kb.utils.wrappedValueObservable(@))

  write: (new_value) ->
    # update the model
    model = kb.utils.wrappedObject(@)
    if model and model.get(@key) isnt new_value
      set_info = {}; set_info[@key] = new_value
      model.set(set_info)

    # update the observable
    @update(new_value)

  model: (new_model) ->
    model = kb.utils.wrappedObject(@)
    return model if (arguments.length == 0) # get
    return if model is new_model # no change
    kb.utils.wrappedObject(@, new_model)
    @update()

  update: (new_value) ->
    model = kb.utils.wrappedObject(@)
    new_value = model.get(@key) if model and not arguments.length

    # set up a new value obseravble, store separately from the attribute observable so it can be referred to even if the model is not yet loaded
    value_observable = kb.utils.wrappedValueObservable(@)
    unless value_observable
      @_createValueObservable(new_value, false)
      return

    # a view model, recognizes view_models as non-observable
    if not ko.isObservable(value_observable)

      # no longer a model -> switch types
      if new_value and not new_value instanceof Backbone.Model
        @_createValueObservable(new_value, true)

      # update if needed
      else
        value_observable.model(new_value) if value_observable.model() isnt new_value

    # a collection observable
    else if kb.utils.observableInstanceOf(value_observable, kb.CollectionObservable)

      # no longer a collection -> switch types
      if new_value and not new_value instanceof Backbone.Collection
        @_createValueObservable(new_value, true)

      # update if needed
      else
        value_observable.collection(new_value) if value_observable.collection() isnt new_value

    # a simple observable
    else

      # now a model or collection -> switch types
      if new_value and (new_value instanceof Backbone.Model or new_value instanceof Backbone.Collection)
        @_createValueObservable(new_value, true)

      # update if needed
      else
        value_observable(new_value) if value_observable() isnt new_value

  _createValueObservable: (new_value, notify) ->
    store = kb.utils.wrappedStore(@)
    store.releaseObservable(kb.utils.wrappedValueObservable(@)) # release previous
    value_observable = kb.utils.wrappedValueObservable(@, store.resolveObservable(new_value, kb.utils.wrappedPath(@), kb.utils.wrappedFactory(@)))
    kb.utils.wrappedObservable(@).notifySubscribers(ko.utils.unwrapObservable(value_observable)) if notify

kb.attributeObservable = (model, key, options) -> new kb.AttributeObservable(model, key, options)