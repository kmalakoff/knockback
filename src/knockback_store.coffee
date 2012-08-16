###
  knockback_store.js
  (c) 2012 Kevin Malakoff.
  Knockback.Store is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.Store
  @registerOrCreateStoreFromOptions: (obj, observable, options) ->
    if options.store
      kb.utils.wrappedStore(observable, options.store)
      options.store.registerObservable(obj, observable, options)
    else
      kb.utils.wrappedStore(observable, new kb.Store())
      kb.utils.wrappedStoreIsOwned(observable, true)

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
      if observable and observable.release
        observable.release(true)
      else
        kb.utils.release(observable)
    @observables = null

  registerObservable: (obj, observable, options={}) ->
    return unless obj # nothing to register
    @objects.push(obj)
    kb.utils.wrappedObject(observable, obj)
    @observables.push(observable)
    observable.retain?()

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
        observable.retain?()
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

  releaseObservable: (observable, owns_store) ->
    return unless observable
    index = _.indexOf(@observables, observable)
    return unless index >= 0

    # cares about ownership -> do not clear out observables unless owned or ref count is 0
    return if arguments.length is 2 and not owns_store and not observable.release

    # just release
    kb.utils.release(observable)
    return if observable.refCount and observable.refCount() > 0
    kb.utils.wrappedObject(observable, null)
    index = _.indexOf(@observables, observable) unless @observables[index] == observable
    @objects[index] = null
    @observables[index] = null