###
  knockback.js 0.18.6
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

{_, ko} = kb = require './kb'

# Used to share and manage the persistence of ViewModels and observables. ks.Store can be used to break relationship cycles between models, to reduce memory usage, and to share view models between kb.CollectionObservables (for example, when using Knockout.js selectedOptions).
#
# @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
#   var co = kb.collectionObservable(new Backbone.Collection());
#   var co_selected_options = kb.collectionObservable(new Backbone.Collection(), {
#     store: kb.utils.wrappedStore(co)
#   });
module.exports = class kb.Store
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
    @observable_records = {}
    @replaced_observables = []

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: -> @clear()

  # Manually clear the store
  clear: ->
    [observable_records, @observable_records] = [@observable_records, {}]
    for creator, records of observable_records
      kb.release(record.observable) for record in records

    [replaced_observables, @replaced_observables] = [@replaced_observables, []]
    kb.release(replaced_observables)
    return

  # Manually compact the store by searching for released view models
  compact: ->
    # TODO: optimize
    for creator, records of @observable_records
      removals = []
      removals.push(record) for record in records when record.observable?.__kb_released
      @observable_records[creator] = _.difference(records, removals) if removals.length
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
  # @example register an observable with the store
  #   store.registerObservable(obj, observable, {creator: creator});
  register: (obj, observable, options) ->
    return unless observable # nothing to register
    return if ko.isObservable(observable) or observable.__kb_is_co # only store view models not basic ko.observables nor kb.CollectionObservables

    # prepare the observable
    kb.utils.wrappedObject(observable, obj)
    obj or (observable.__kb_null = true) # register as shared null

    # register the observable
    creator = if options.creator then options.creator else (if (options.path and options.factory) then options.factory.creatorForPath(obj, options.path) else null)
    creator or= observable.constructor # default is to use the constructor
    creator = creator.create if creator.create

    # console.log 'CID', obj?.cid, !!@observable_records[creator]
    # console.log key for key of @observable_records

    records = @observable_records[creator] or= []
    record = {obj: obj, observable: observable}

    if (index = @findIndex(obj, creator)) < 0 then records.push(record) else records[index] = record
    return observable

  # @private
  findIndex: (obj, creator) ->
    creator = creator.create if creator.create

    # removals = []
    if not obj or (obj instanceof kb.Model)
      return -1 unless (records = @observable_records[creator])?.length
      for index, record of records
        continue unless record.observable

        # already released, release our references
        # (removals.push(record); continue) if record.observable.__kb_released

        # first pass doesn't match (both not null or both not same object)
        continue if (not obj and not record.observable.__kb_null) or (obj and (record.observable.__kb_null or (record.obj isnt obj)))

        # creator matches
        return index # if ((record.creator is creator) or (record.creator.create and (record.creator.create is creator.create)))
          # if removals.length
          #   @observable_records = _.difference(@observable_records, removals)
          #   return _.indexOf(@observable_records, record)
          # else

    # @observable_records = _.difference(@observable_records, removals) if removals.length
    return -1

  # @private
  find: (obj, creator) ->
    creator = creator.create if creator.create
    return if (index = @findIndex(obj, creator)) < 0 then null else @observable_records[creator][index].observable

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
    options.creator = kb.ViewModel if not options.creator and (obj instanceof kb.Model)
    creator = options.creator

    # no creator, create default and don't store
    return kb.utils.createFromDefaultCreator(obj, options) unless creator
    return obj if creator.models_only
    return observable if creator and observable = @find(obj, creator)

    # create
    observable = kb.ignore =>
      observable = if creator.create then creator.create(obj, options) else new creator(obj, options)
      return observable or ko.observable(null) # default to null

    @register(obj, observable, options)
    return observable

  # @private
  findOrReplace: (obj, creator, observable) ->
    obj or kb._throwUnexpected(@, 'obj missing')

    # TODO: make more efficient by finding once
    if (index = @findIndex(obj, creator)) < 0
      return @register(obj, observable, {creator: creator})
    else
      creator = creator.create if creator.create
      record = @observable_records[creator][index]
      (kb.utils.wrappedObject(record.observable) is obj) or kb._throwUnexpected(@, 'different object') # same object
      if (record.observable isnt observable) # a change
        (record.observable.constructor is observable.constructor) or kb._throwUnexpected(@, 'replacing different type')

        # put the previous observable on the destroy list (but don't release until the store is released)
        @replaced_observables.push(record.observable)
        record.observable = observable

      return observable
