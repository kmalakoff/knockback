###
  knockback.js 0.20.0
  Copyright (c)  2011-2014 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
###

{_, ko} = kb = require './kb'

COUNTER = 0

# Used to share and manage the persistence of ViewModels and observables. ks.Store can be used to break relationship cycles between models, to reduce memory usage, and to share view models between kb.CollectionObservables (for example, when using Knockout.js selectedOptions).
#
# @example How to create a ko.CollectionObservable using the ko.collectionObservable factory.
#   var co = kb.collectionObservable(new Backbone.Collection());
#   var co_selected_options = kb.collectionObservable(new Backbone.Collection(), {
#     store: kb.utils.wrappedStore(co)
#   });
module.exports = class kb.Store
  @instances = []

  # Used to either register yourself with the existing store or to create a new store.
  #
  # @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
  # @param [Instance] obj the instance that will own or register with the store
  # @param [ko.observable] observable the observable that will own the store
  # @example
  #   kb.Store.useOptionsOrCreate(model, this, options);
  @useOptionsOrCreate: (options, obj, observable) ->
    kb.utils.wrappedStoreIsOwned(observable, true) unless options.store
    store = kb.utils.wrappedStore(observable, options.store or new kb.Store())
    store.retain(observable, obj, options.creator)
    return store

  # Used to create a new kb.Store.
  constructor: ->
    @observable_records = {}
    @replaced_observables = []
    kb.Store.instances.push(@)

  # Required clean up function to break cycles, release view models, etc.
  # Can be called directly, via kb.release(object) or as a consequence of ko.releaseNode(element).
  destroy: ->
    @__kb_released = true
    @clear()
    kb.Store.instances.splice(index, 1) if (index = _.indexOf(kb.Store.instances, @)) >= 0

  # Manually clear the store
  clear: ->
    [observable_records, @observable_records] = [@observable_records, {}]
    for creator_id, records of observable_records
      @release(observable, true) for cid, observable of records

    [replaced_observables, @replaced_observables] = [@replaced_observables, []]
    @release(observable, true) for observable in replaced_observables when not observable.__kb_released
    return

  # Manually compact the store by searching for released view models
  compact: ->
    for creator_id, records of @observable_records
      delete records[cid] for cid, observable of records when observable.__kb_released
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
  # @example retain an observable with the store
  #   store.retain(observable, obj, creator);
  retain: (observable, obj, creator) ->
    return unless @canRegister(observable)
    creator or= observable.constructor # default is to use the constructor

    if current_observable = @find(obj, creator)
      (@getOrCreateStoreReferences(observable).ref_count++; return observable) if current_observable is observable # already in this store
      @retire(current_observable)

    @add(observable, obj, creator)
    @getOrCreateStoreReferences(observable).ref_count++
    return observable

  # @nodoc
  find: (obj, creator) ->
    return null unless records = @observable_records[@creatorId(creator)]
    (delete records[@cid(obj)]; return null) if (observable = records[@cid(obj)])?.__kb_released
    return observable

  # Used to find an existing observable in the store or create a new one if it doesn't exist.
  #
  # @param [Model|Collection|Data] obj the object to create the observable for. Only Models are cached in the store.
  # @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
  # @option options [Constructor|Function] creator the constructor or function used to create the observable. It is used to match observables in the store.
  # @option options [String] path the path to the value (used to create related observables from the factory).
  # @option options [kb.Store] store a store used to cache and share view models.
  # @option options [kb.Factory] factory a factory used to create view models.
  #
  # @example register an observable with the store
  #   observable = store.retainOrCreate(value, {path: kb.utils.wrappedPath(observable), factory: kb.utils.wrappedFactory(observable)})
  retainOrCreate: (obj, options) ->
    return kb.utils.createFromDefaultCreator(obj, options) unless creator = @creator(obj, options)
    return obj if creator.models_only
    return observable if observable = @find(obj, creator)

    observable = kb.ignore =>
      options = _.defaults({store: @, creator: creator}, options) # set our own creator so we can register ourselves above
      observable = if creator.create then creator.create(obj, options) else new creator(obj, options)
      return observable or ko.observable(null) # default to null

    @retain(observable, obj, creator)
    return observable

  # @nodoc
  canReuse: (observable) -> @refCount(observable) is 1

  # @nodoc
  reuse: (observable, obj) ->
    return if (current_obj = kb.utils.wrappedObject(observable)) is obj
    throw new Error "Trying to change a shared view model. Reference count: #{@refCount(observable)}" unless @refCount(observable) is 1

    creator = kb.utils.wrappedCreator(observable) or observable.constructor # default is to use the constructor
    @retire(current_observable) if not _.isUndefined(current_obj) and current_observable = @find(current_obj, creator)

    @retain(observable, obj, creator)
    return

  # @nodoc
  release: (observable, force) ->
    # maybe be externally added
    if store_references = @storeReferences(observable)
      return if not force and --store_references.ref_count > 0 # do not release yet
      @clearStoreReferences(observable)

    @remove(observable)

    return if observable.__kb_released
    kb.release(observable)

  refCount: (observable) ->
    (console?.log "Observable already released"; return 0) if observable.__kb_released
    return 1 unless store_references = @storeReferences(observable)
    return store_references.ref_count

  # @nodoc
  canRegister: (observable) -> return observable and not ko.isObservable(observable) and not observable.__kb_is_co # only register view models not basic ko.observables nor kb.CollectionObservables

  # @nodoc
  cid: (obj) -> cid = if obj then obj.cid or= _.uniqueId('c') else 'null'

  # @nodoc
  creatorId: (creator) ->
    create = creator.create or creator
    create.__kb_cids or= []
    return item.cid for item in create.__kb_cids when item.create is create
    create.__kb_cids.push(item = {create: create, cid: _.uniqueId('kb')}); return item.cid

  # @nodoc
  storeReferences: (observable) ->
    return unless stores_references = kb.utils.get(observable, 'stores_references')
    return _.find(stores_references, (store_references) => store_references.store is @)

  # @nodoc
  getOrCreateStoreReferences: (observable) ->
    stores_references = kb.utils.orSet(observable, 'stores_references', [])
    unless store_references = _.find(stores_references, (store_references) => store_references.store is @)
      stores_references.push(store_references = {store: @, ref_count: 0, release: => @release(observable)})
    return store_references

  # @nodoc
  clearStoreReferences: (observable) ->
    if stores_references = kb.utils.get(observable, 'stores_references')
      (observable.__kb.stores_references.splice(index, 1); break) for index, store_references of observable.__kb.stores_references when store_references.store is @
    return

  # @nodoc
  retire: (observable) -> @clearStoreReferences(observable); @replaced_observables.push(observable); @remove(observable)

  # @nodoc
  add: (observable, obj, creator) ->
    creator or= observable.constructor # default is to use the constructor
    kb.utils.wrappedObject(observable, obj); kb.utils.wrappedCreator(observable, creator)
    (@observable_records[@creatorId(creator)] or= {})[@cid(obj)] = observable

  # @nodoc
  remove: (observable) ->
    creator = kb.utils.wrappedCreator(observable) or observable.constructor # default is to use the constructor
    if current_observable = @find(obj = kb.utils.wrappedObject(observable), creator) # already released
      delete @observable_records[@creatorId(creator)][@cid(obj)] if current_observable is observable # not already replaced
    kb.utils.wrappedObject(observable, null); kb.utils.wrappedCreator(observable, null)

  # @nodoc
  creator: (obj, options) ->
    return options.creator if options.creator
    return creator if creator = kb.utils.inferCreator(obj, options.factory, options.path)
    return kb.ViewModel if (obj instanceof kb.Model)
    return
