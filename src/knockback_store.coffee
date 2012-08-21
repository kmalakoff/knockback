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

  findOrCreateObservable: (obj, path, factory, creator) ->
    if not factory
      observable = (if creator then creator else kb.Factory.createDefault)(obj, {path: path, store: this, creator: creator})
    else
      creator or= factory.creatorForPath(obj, path)
      return ko.observable(obj) unless creator
      return obj if creator.models_only  # do not create an observable

      # check for an existing one of the correct type
      if obj and not (obj instanceof Backbone.Collection) # don't share collection observables
        for test, index in @objects
          continue unless (observable = @observables[index])
          
          # already released, release our references
          if observable.__kb_destroyed
            @observables[index] = null
            @objects[index] = null

          else if (test is obj) and (observable.__kb.creator is creator)
            return observable

      # create
      observable = factory.createForPath(obj, path, this, creator)
      observable or= ko.observable(null) # default to null

    # check if already registered if needed
    unless (ko.isObservable(observable) or observable.__kb_is_co)
      (_.indexOf(@observables, observable) >= 0) or @registerObservable(obj, observable, {creator: creator}) # not registered yet, register now
    return observable