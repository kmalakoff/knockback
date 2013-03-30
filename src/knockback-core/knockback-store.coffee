###
  knockback_store.js
  (c) 2012 Kevin Malakoff.
  Knockback.Store is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# Used to share and manage the persistence of ViewModels and observables. ks.Store can be used to break relationship cycles between models, to reduce memory usage, and to share view models between kb.CollectionObservables (for example, when using Knockout.js selectedOptions).
#
# @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
#   var co = kb.collectionObservable(new Backbone.Collection());
#   var co_selected_options = kb.collectionObservable(new Backbone.Collection(), {
#     store: kb.utils.wrappedStore(co)
#   });
class kb.Store
  # Used to either register yourself with the existing store or to create a new store.
  #
  # @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
  # @param [Instance] obj the instance that will own or register with the store
  # @param [ko.observable] observable the observable that will own the store
  # @example
  #   kb.Store.useOptionsOrCreate(model, this, options);
  @useOptionsOrCreate: (options, obj, observable) ->
    if options.store
      options.store.register(obj, observable, options)
      return kb.utils.wrappedStore(observable, options.store)
    else
      kb.utils.wrappedStoreIsOwned(observable, true)
      return kb.utils.wrappedStore(observable, new kb.Store())

  # Used to create a new kb.Store.
  constructor: ->
    @observable_records = []
    @replaced_observables = []

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: -> @clear()

  # Manually clear the store.
  clear: ->
    kb.release(record.observable) for record in @observable_records.splice(0, @observable_records.length)
    kb.release(@replaced_observables)
    return

  # Used to register a new view model with the store.
  #
  # @param [Model] obj the Model
  # @param [ko.observable] observable the observable to share for the Model
  # @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
  # @option options [Constructor|Function] creator the constructor or function used to create the observable. It is used to match observables in the store.
  # @option options [String] path the path to the value (used to create related observables from the factory).
  # @option options [kb.Store] store a store used to cache and share view models.
  # @option options [kb.Factory] factory a factory used to create view models.
  #
  # @example register an observable with th store
  #   store.registerObservable(obj, observable, {creator: creator});
  register: (obj, observable, options) ->
    return unless observable # nothing to register

    # only store view models not basic ko.observables nor kb.CollectionObservables
    return if ko.isObservable(observable) or observable.__kb_is_co

    # prepare the observable
    kb.utils.wrappedObject(observable, obj)
    obj or (observable.__kb_null = true) # register as shared null

    # register the observable
    creator = if options.creator then options.creator else (if (options.path and options.factory) then options.factory.creatorForPath(obj, options.path) else null)
    creator = observable.constructor unless creator # default is to use the constructor
    @observable_records.push({obj: obj, observable: observable, creator: creator})
    observable

  # @private
  findIndex: (obj, creator) ->
    if not obj or (obj instanceof kb.Model)
      for index, record of @observable_records
        continue unless record.observable

        # already released, release our references
        if record.observable.__kb_released
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

  # @private
  find: (obj, creator) -> return if (index = @findIndex(obj, creator)) < 0 then null else @observable_records[index].observable

  # @private
  isRegistered: (observable) ->
    for record in @observable_records
      return true if record.observable is observable
    return false

  # Used to find an existing observable in the store or create a new one if it doesn't exist.
  #
  # @param [Model|Collection|Data] obj the object to create the observable for. Only Models are cached in the store.
  # @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
  # @option options [Constructor|Function] creator the constructor or function used to create the observable. It is used to match observables in the store.
  # @option options [String] path the path to the value (used to create related observables from the factory).
  # @option options [kb.Store] store a store used to cache and share view models.
  # @option options [kb.Factory] factory a factory used to create view models.
  #
  # @example register an observable with th store
  #   observable = store.findOrCreateObservable(value, {path: kb.utils.wrappedPath(observable), factory: kb.utils.wrappedFactory(observable)})
  findOrCreate: (obj, options) ->
    options.store = this
    options.creator or (options.creator = kb.utils.inferCreator(obj, options.factory, options.path))
    options.creator = kv.ViewModel if not options.creator and (obj instanceof kb.Model)
    creator = options.creator

    # no creator, create default and don't store
    if not creator
      return kb.utils.createFromDefaultCreator(obj, options)
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
    unless ko.isObservable(observable)
      @isRegistered(observable) or @register(obj, observable, options) # not registered yet, register now

    return observable

  # @private
  findOrReplace: (obj, creator, observable) ->
    obj or _throwUnexpected(@, 'obj missing')
    if (index = @findIndex(obj, creator)) < 0
      return @register(obj, observable, {creator: creator})
    else
      record = @observable_records[index]
      (kb.utils.wrappedObject(record.observable) is obj) or _throwUnexpected(@, 'different object') # same object
      if (record.observable isnt observable) # a change
        (record.observable.constructor is observable.constructor) or _throwUnexpected(@, 'replacing different type')

        # put the previous observable on the destroy list (but don't release until the store is released)
        @replaced_observables.push(record.observable)
        record.observable = observable

      return observable