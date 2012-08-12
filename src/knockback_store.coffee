###
  knockback_store.js
  (c) 2012 Kevin Malakoff.
  Knockback.Store is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.Store
  constructor: ->
    @objects = []
    @observables = []

  destroy: ->
    @objects = null

    # first break cycles in the collections since relations are the typical source of recursion
    for index, observable of @observables
      continue unless kb.utils.observableInstanceOf(observable, kb.CollectionObservable)

      @observables[index] = null # releasing
      observable.release() while (observable.refCount() > 0)

    # then release the view models
    for index, observable of @observables
      continue unless observable

      @observables[index] = null # releasing
      if observable and _.isFunction(observable.refCount)
        observable.release() while (observable.refCount() > 0)
      else
        kb.utils.release(observable)
    @observables = null

  registerObservable: (obj, observable) ->
    @objects.push(obj)
    observable.retain() if observable and _.isFunction(observable.refCount)
    @observables.push(observable)

  findObservable: (obj, path, factory) ->
    creator = factory.creatorForPath(obj, path)
    test_type = if creator then creator else ko.observable

    # check for an existing one of the correct type
    for test, index in @objects
      return index if (test is obj) and (@observables[index] instanceof test_type)
    return -1

  resolveObservable: (obj, path, factory) ->
    index = @findObservable(obj, path, factory)
    if index >= 0
      observable = @observables[index]
      observable.retain() if _.isFunction(observable.refCount)
      return observable

    # create and wrap model
    observable = factory.createForPath(obj, path, this)
    throw "Factory counldn't create observable for #{path}" unless observable
    kb.utils.wrappedModel(observable, obj) unless observable instanceof ko.observable

    # register if needed
    index = @findObservable(obj, path, factory)
    @registerObservable(obj, observable) if index < 0

    return observable

  releaseObservable: (observable) ->
    return unless observable and _.isFunction(observable.refCount) and observable.refCount() > 0
    observable.release()
    return if (observable.refCount() > 0)
    index = _.indexOf(@observables, observable)
    return unless index >= 0
    @observables[index] = 0