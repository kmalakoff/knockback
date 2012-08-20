###
  knockback_observable.js
  (c) 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# @m is @model

class kb.Observable
  constructor: (model, options, @vm={}) -> # vm is view_model
    kb.throwMissing(this, 'options') unless options

    # extract options
    (options = _.defaults(_.clone(options), options.options); delete options.options) if options.options
    @key = if _.isString(options) or ko.isObservable(options) then options else options.key
    kb.throwMissing(this, 'key') unless @key
    @args = options.args
    @read = options.read
    @write = options.write

    # set up basics
    @vo = ko.observable(null) # create a value observable for the first dependency
    observable = kb.utils.wrappedObservable(@, ko.dependentObservable(
      read: =>
        # create dependencies if needed
        args = [ko.utils.unwrapObservable(@key)] 
        if @args
          if _.isArray(@args) then (args.push(ko.utils.unwrapObservable(arg)) for arg in @args) else args.push(ko.utils.unwrapObservable(@args))

        # read and update
        if @m
          new_value = if @read then @read.apply(@vm, args) else @m.get.apply(@m, args)
          @update(new_value)

        # get the observable
        return ko.utils.unwrapObservable(@vo())

      write: (new_value) =>
        # set on model
        set_info = {}; set_info[ko.utils.unwrapObservable(@key)] = new_value
        args = if @write then [new_value] else [set_info]
        if @args
          if _.isArray(@args) then (args.push(ko.utils.unwrapObservable(arg)) for arg in @args) else args.push(ko.utils.unwrapObservable(@args))

        # write
        if @m
          if @write then @write.apply(@vm, args) else @m.set.apply(@m, args)

        # update the observable
        @update(new_value)

      owner: @vm
    ))
    observable.__kb_is_o = true # mark as a kb.Observable
    kb.utils.wrappedStore(observable, options.store)
    kb.utils.wrappedPath(observable, kb.utils.pathJoin(options.path, @key))
    if options.factories and ((typeof(options.factories) == 'function') or options.factories.create)
      factory = kb.utils.wrappedFactory(observable, new kb.Factory(options.factory))
      factory.addPathMapping(kb.utils.wrappedPath(observable), options.factories)
    else
      kb.Factory.useOptionsOrCreate(options, observable, kb.utils.wrappedPath(observable))

    # publish public interface on the observable and return instead of this
    observable.valueType = _.bind(@valueType, @)
    observable.destroy = _.bind(@destroy, @)

    # use external model observable or create
    kb.ModelWatcher.useOptionsOrCreate(options, model, @, {model: _.bind(@model, @), update: _.bind(@update, @), key: @key})

    # wrap ourselves with a localizer
    if options.localizer
      observable = new options.localizer(observable)

    # wrap ourselves with a default value
    if options.hasOwnProperty('default')
      observable = kb.defaultWrapper(observable, options.default)

    return observable

  destroy: ->
    kb.release(@value); @value = null
    kb.utils.wrappedDestroy(@)

  model: (new_model) ->
    # get or no change
    return @m if (arguments.length == 0) or (@m is new_model)
    @update() if (@m = new_model)

  update: (new_value) ->
    observable = kb.utils.wrappedObservable(@)
    value = @vo()
    new_value = @m.get(ko.utils.unwrapObservable(@key)) if @m and not arguments.length
    new_value = null unless new_value # ensure null instead of undefined
    new_type = kb.utils.valueType(new_value)

    # create or change in type
    if _.isUndefined(@value_type) or (@value_type isnt new_type and new_type isnt kb.TYPE_UNKNOWN)
      @_updateValueObservable(new_value) # create new

    else if @value_type == kb.TYPE_MODEL
      # use the get/set methods
      if typeof(value.model) is 'function'
        value.model(new_value) if value.model() isnt new_value # different so update

      # different so create a new one (no way to update)
      else if kb.utils.wrappedObject(value) isnt new_value
        @_updateValueObservable(new_value) # create new

    else if @value_type == kb.TYPE_COLLECTION
      value.collection(new_value) if value.collection() isnt new_value # different so update

    else # a simple observable
      value(new_value) if value() isnt new_value # different so update

  valueType: ->
    new_value = if @m then @m.get(@key) else null
    @_updateValueObservable(new_value) unless @value_type # create so we can check the type
    return @value_type

  ####################################################
  # Internal
  ####################################################
  _updateValueObservable: (new_value) ->
    observable = kb.utils.wrappedObservable(@)
    store = kb.utils.wrappedStore(observable)
    factory = kb.utils.wrappedFactory(observable)
    path = kb.utils.wrappedPath(observable)
    creator = factory.creatorForPath(new_value, path)

    # infer Backbone.Relational types
    if not creator and @m and Backbone.RelationalModel and (@m instanceof Backbone.RelationalModel)
      key = ko.utils.unwrapObservable(@key)
      relation = _.find(@m.getRelations(), (test) -> return test.key is key)
      (creator = if relation.collectionKey then kb.CollectionObservable else kb.ViewModel) if relation

    # create and store
    if store
      value = store.findOrCreateObservable(new_value, path, factory, creator)
    else if creator
      value = factory.createForPath(new_value, path, store, creator)
    else
      value = ko.observable(new_value)

    # cache the type
    if not ko.isObservable(value) # a view model, recognize view_models as non-observable
      @value_type = kb.TYPE_MODEL
      if typeof(value.model) isnt 'function' # manually cache the model to check for changes later
        kb.utils.wrappedObject(value, new_value)
    else if value.__kb_is_co
      @value_type = kb.TYPE_COLLECTION
    else
      @value_type = kb.TYPE_SIMPLE

    # set the value
    previous_value = @value; @value = value
    (if store then store.releaseObservable(previous_value) else kb.release(previous_value)) if previous_value # release previous
    @vo(value)

kb.observable = (model, key, options) -> new kb.Observable(model, key, options)