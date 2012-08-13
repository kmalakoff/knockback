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
      observable.release(true)

    # then release the view models
    for index, observable of @observables
      continue unless observable

      @observables[index] = null # releasing
      if observable and _.isFunction(observable.refCount)
        observable.release(true)
      else
        kb.utils.release(observable)
    @observables = null

  registerObservable: (obj, observable, options={}) ->
    @objects.push(obj)
    observable.retain() if observable and _.isFunction(observable.refCount)
    kb.utils.wrappedModel(observable, obj)
    @observables.push(observable)

    # set the creator
    if (options.creator)
      observable.__kb.creator = options.creator  # save the creator to mark the source of the observable
    else if (options.path and options.factory)
      observable.__kb.creator = options.factory.creatorForPath(obj, options.path)  # save the creator to mark the source of the observable

  updateObservable: (obj, observable) ->
    creator = if observable.__kb then observable.__kb.creator else null

    # check for an existing one of the correct type
    if creator 
      for test, index in @objects
        observable = @observables[index]
        if (test is obj) and (observable.__kb.creator is creator)
          return # found it

    # register
    @registerObservable(obj, observable)

  resolveObservable: (obj, path, factory) ->
    creator = factory.creatorForPath(obj, path)
    return ko.observable(obj) unless creator

    # check for an existing one of the correct type
    for test, index in @objects
      observable = @observables[index]
      if (test is obj) and (observable.__kb.creator is creator)
        observable.retain() if _.isFunction(observable.refCount)
        return observable

    # create and wrap model
    observable = factory.createForPath(obj, path, this, creator)
    throw "Factory counldn't create observable for #{path}" unless observable

    # check if already registered
    for test, index in @objects
      if (test is obj) and (@observables[index] == observable)
        return observable

    # not registered yet, register now
    @registerObservable(obj, observable, {creator: creator})
    return observable

  releaseObservable: (observable) ->
    return unless observable and _.isFunction(observable.refCount) and observable.refCount() > 0
    observable.release()
    return if (observable.refCount() > 0)
    index = _.indexOf(@observables, observable)
    return unless index >= 0
    @objects[index] = null
    @observables[index] = null