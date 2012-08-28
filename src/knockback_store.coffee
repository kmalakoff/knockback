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
      options.store.register(obj, observable, options)
      return kb.utils.wrappedStore(observable, options.store)
    else
      kb.utils.wrappedStoreIsOwned(observable, true)
      return kb.utils.wrappedStore(observable, new kb.Store())

  constructor: ->
    @observable_records = []
    @replaced_observables = []

  destroy: ->
    for record in @observable_records
      kb.release(record.observable)
    for observable in @replaced_observables
      kb.release(observable)
    @observable_records = null
    @replaced_observables = null

  register: (obj, observable, options) ->
    return unless observable # nothing to register

    # only store view models not basic ko.observables nor kb.CollectionObservables
    return if ko.isObservable(observable) or observable.__kb_is_co

    # prepare the observable
    kb.utils.wrappedObject(observable, obj)
    observable.__kb_null = true unless obj

    # register the observable
    creator = if options.creator then options.creator else (if (options.path and options.factory) then options.factory.creatorForPath(obj, options.path) else null)
    creator = observable.constructor unless creator # default is to use the constructor
    @observable_records.push({obj: obj, observable: observable, creator: creator})
    observable

  findIndex: (obj, creator) ->
    if not obj or (obj instanceof Backbone.Model)
      for index, record of @observable_records
        continue unless record.observable

        # already released, release our references
        if record.observable.__kb_destroyed
          record.obj = null
          record.observable = null
          continue

        # first pass doesn't match (both not null or both not same object)
        if (not obj and not record.observable.__kb_null) or (obj and (record.observable.__kb_null or (record.obj isnt obj)))
          continue

        # creator matches
        else if ((record.creator is creator) or (record.creator.create and (record.creator.create is creator.create)))
          return index

    return -1

  find: (obj, creator) -> return if (index = @findIndex(obj, creator)) < 0 then null else @observable_records[index].observable

  isRegistered: (observable) ->
    for record in @observable_records
      return true if record.observable is observable
    return false

  findOrCreate: (obj, options) ->
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
    observable = @find(obj, creator) if creator
    return observable if observable

    # create
    if creator.create
      observable = creator.create(obj, options)
    else
      observable = new creator(obj, options)
    observable or= ko.observable(null) # default to null

    # we only store view_models, not observables
    if not ko.isObservable(observable)
      @isRegistered(observable) or @register(obj, observable, options) # not registered yet, register now
    return observable

  findOrReplace: (obj, creator, observable) ->
    obj or raiseUnexpected('obj missing')
    if (index = @findIndex(obj, creator)) < 0
      return @register(obj, observable, {creator: creator})
    else
      record = @observable_records[index]
      (kb.utils.wrappedObject(record.observable) is obj) or throwUnexpected(this, 'different object') # same object
      if (record.observable isnt observable) # a change
        (record.observable.constructor is observable.constructor) or throwUnexpected(this, 'replacing different type')

        # put the previous observable on the destroy list (but don't release until the store is released)
        @replaced_observables.push(record.observable)
        record.observable = observable

      return observable