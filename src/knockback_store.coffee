###
  knockback_store.js
  (c) 2012 Kevin Malakoff.
  Knockback.Store is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.Store
  @useOptionsOrCreate: (options, obj, observable) ->
    if options.store
      options.store.registerObservable(obj, observable, options)
      return kb.utils.wrappedStore(observable, options.store)
    else
      kb.utils.wrappedStoreIsOwned(observable, true)
      return kb.utils.wrappedStore(observable, new kb.Store())

  constructor: ->
    @objects = []
    @observables = []

  destroy: ->
    for index, observable of @observables
      kb.release(observable)
    @objects = null
    @observables = null

  registerObservable: (obj, observable, options) ->
    return unless (obj and observable) # nothing to register

    # only store view models not basic ko.observables nor kb.CollectionObservables
    return if ko.isObservable(observable) or observable.__kb_is_co

    options or= {}
    @objects.push(obj)
    kb.utils.wrappedObject(observable, obj)
    @observables.push(observable)

    # set the creator
    observable.__kb or= {}
    if (options.creator)
      observable.__kb.creator = options.creator  # save the creator to mark the source of the observable
    else if (options.path and options.factory)
      observable.__kb.creator = options.factory.creatorForPath(obj, options.path)  # save the creator to mark the source of the observable

  findObservable: (obj, creator) ->
    if (obj instanceof Backbone.Model)
      for test, index in @objects
        if observable = @observables[index]

          # already released, release our references
          if observable.__kb_destroyed
            @observables[index] = null
            @objects[index] = null

          # a match, share this
          else if (test is obj) and (observable.__kb.creator is creator)
            return observable
    return null

  findOrCreateObservable: (obj, options) ->
    options.store = this
    options.creator or (options.creator = kb.utils.inferCreator(obj, options.factory, options.path))
    options.creator = kv.ViewModel if not options.creator and (obj instanceof Backbone.Model)
    creator = options.creator

    # no creator, create default and don't store
    if not creator 
      return kb.utils.createDefaultObservable(obj, options)
    else if creator.models_only
      return obj

    # found existing
    observable = @findObservable(obj, creator)
    return observable if observable

    # create
    if creator.create
      observable = creator.create(obj, options)
    else
      observable = new creator(obj, options)
    observable or= ko.observable(null) # default to null

    # for view models, check if already stored
    unless ko.isObservable(observable)
      (_.indexOf(@observables, observable) >= 0) or @registerObservable(obj, observable, options) # not registered yet, register now
    return observable