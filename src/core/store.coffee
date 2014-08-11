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
      options.store.register(obj, observable, options.creator)
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
    for creator_id, records of observable_records
      kb.release(observable) for cid, observable of records when not observable.__kb_released

    [replaced_observables, @replaced_observables] = [@replaced_observables, []]
    kb.release(observable) for observable in replaced_observables when not observable.__kb_released
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
  # @example register an observable with the store
  #   store.registerObservable(obj, observable, creator);
  register: (obj, observable, creator) ->
    return unless @canRegister(observable)
    creator or= observable.constructor # default is to use the constructor

    # prepare the observable
    kb.utils.wrappedObject(observable, obj)
    obj or (observable.__kb_null = true) # register as shared null

    @replaced_observables.push(current_observable) if current_observable = @find(obj, creator)
    (@observable_records[@creatorId(creator)] or= {})[@cid(obj)] = observable
    return observable

  find: (obj, creator) ->
    if (observable = (@observable_records[@creatorId(creator)] or= {})[@cid(obj)])?.__kb_released
      delete @observable_records[@creatorId(creator)][@cid(obj)]
      return null
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
  #   observable = store.findOrCreate(value, {path: kb.utils.wrappedPath(observable), factory: kb.utils.wrappedFactory(observable)})
  findOrCreate: (obj, options) ->
    return kb.utils.createFromDefaultCreator(obj, options) unless creator = @creator(obj, options)
    return obj if creator.models_only
    return observable if observable = @find(obj, creator)

    observable = kb.ignore =>
      options = _.defaults({store: @, creator: creator}, options) # set our own creator so we can register ourselves above
      observable = if creator.create then creator.create(obj, options) else new creator(obj, options)
      return observable or ko.observable(null) # default to null

    @register(obj, observable, creator)
    return observable

  # @nodoc
  findOrReplace: (obj, creator, observable) ->
    obj or kb._throwUnexpected(@, 'obj missing')

    if current_observable = @find(obj, creator)
      return if current_observable is observable # no change
      (current_observable.constructor is observable.constructor) or kb._throwUnexpected(@, 'replacing different type')

    @register(obj, observable, creator)
    return observable

  # @nodoc
  canRegister: (observable) ->
    # only register view models not basic ko.observables nor kb.CollectionObservables
    return observable and not ko.isObservable(observable) and not observable.__kb_is_co

  # @nodoc
  cid: (obj) -> cid = if obj then obj.cid or= _.uniqueId('c') else 'null'

  # @nodoc
  creatorId: (creator) ->
    create = creator.create or creator
    create.__kb_cids or= []
    return item.cid for item in create.__kb_cids when item.create is create
    create.__kb_cids.push(item = {create: create, cid: _.uniqueId('kb')}); return item.cid

  # @nodoc
  creator: (obj, options) ->
    return options.creator if options.creator
    return creator if creator = kb.utils.inferCreator(obj, options.factory, options.path)
    return kb.ViewModel if (obj instanceof kb.Model)
    return
