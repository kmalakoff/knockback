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
    @observables = []

  destroy: ->
    for record in @observables
      kb.release(record.observable)
    @observables = null

  registerObservable: (obj, observable, options) ->
    return unless observable # nothing to register

    # only store view models not basic ko.observables nor kb.CollectionObservables
    return if ko.isObservable(observable) or observable.__kb_is_co

    # prepare the observable
    kb.utils.wrappedObject(observable, obj)
    observable.__kb_null = true unless obj

    # register the observable
    creator = if options.creator then options.creator else (if (options.path and options.factory) then options.factory.creatorForPath(obj, options.path) else null)
    creator or throwUnexpected(this, 'missing creator')
    @observables.push({obj: obj, observable: observable, creator: creator})

  findObservable: (obj, creator) ->
    if not obj or (obj instanceof Backbone.Model)
      for record in @observables
        continue unless record.observable

        # already released, release our references
        if record.observable.__kb_destroyed
          record.obj = null
          record.observable = null

        # an object observable
        else if obj 
          return record.observable if not record.observable.__kb_null and (record.obj is obj) and (record.creator is creator)

        # a null observable            
        else 
          return record.observable if record.observable.__kb_null and (record.creator is creator)
 
    return null

  observableIsRegistered: (observable) ->
    for record in @observables
      return true if record.observable is observable
    return false

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
    observable = @findObservable(obj, creator) if creator
    return observable if observable

    # create
    if creator.create
      observable = creator.create(obj, options)
    else
      observable = new creator(obj, options)
    observable or= ko.observable(null) # default to null

    # we only store view_models, not observables
    if not ko.isObservable(observable)
      @observableIsRegistered(observable) or @registerObservable(obj, observable, options) # not registered yet, register now
    return observable