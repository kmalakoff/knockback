###
  knockback_observable.js
  (c) 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# @m is @model

class kb.Observable
  constructor: (model, options, @vm) -> # vm is view_model
    options or throwMissing(this, 'options')
    @vm or = {}

    # copy create options
    if _.isString(options) or ko.isObservable(options)
      c_options = @c_options = {key: options}
    else
      c_options = @c_options = _.clone(options)
      (_.defaults(c_options, c_options.options); delete c_options.options) if c_options.options

    # extract options
    @key = c_options.key; delete c_options.key; @key or throwMissing(this, 'key')    
    not c_options.args or (@args = c_options.args; delete c_options.args)
    not c_options.read or (@read = c_options.read; delete c_options.read)
    not c_options.write or (@write = c_options.write; delete c_options.write)
    model_watcher = c_options.model_watcher
    delete c_options.model_watcher

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
    c_options.store = kb.utils.wrappedStore(observable, c_options.store)
    c_options.path = kb.utils.pathJoin(c_options.path, @key)
    if c_options.factories and ((typeof(c_options.factories) == 'function') or c_options.factories.create)
      c_options.factory = kb.utils.wrappedFactory(observable, new kb.Factory(c_options.factory))
      c_options.factory.addPathMapping(c_options.path, c_options.factories)
    else
      c_options.factory = kb.Factory.useOptionsOrCreate(c_options, observable, c_options.path)
    delete c_options.factories

    # publish public interface on the observable and return instead of this
    observable.value = _.bind(@value, @)
    observable.valueType = _.bind(@valueType, @)
    observable.destroy = _.bind(@destroy, @)

    # use external model observable or create
    kb.ModelWatcher.useOptionsOrCreate({model_watcher: model_watcher}, model, @, {model: _.bind(@model, @), update: _.bind(@update, @), key: @key, path: c_options.path})
    @__kb_value or @update() # wasn't loaded so create

    # wrap ourselves with a localizer
    if c_options.localizer
      observable = new c_options.localizer(observable)
      delete c_options.localizer

    # wrap ourselves with a default value
    if c_options.hasOwnProperty('default')
      observable = kb.defaultWrapper(observable, c_options.default)
      delete c_options.default

    return observable

  destroy: ->
    @__kb_destroyed = true
    kb.release(@__kb_value); @__kb_value = null
    @vm = null
    @c_options = null
    kb.utils.wrappedDestroy(@)

  value: -> 
    return @__kb_value

  valueType: ->
    new_value = if @m then @m.get(@key) else null
    @value_type or @_updateValueObservable(new_value) # create so we can check the type
    return @value_type

  setToDefault: ->
    @__kb_value?.setToDefault?()
    @

  model: (new_model) ->
    # get or no change
    return @m if (arguments.length == 0) or (@m is new_model)
    @m = new_model
    @__kb_destroyed or @update() # update if we aren't being destroyed

  update: (new_value) ->
    # determine the new type
    new_value = @m.get(ko.utils.unwrapObservable(@key)) if @m and not arguments.length
    new_value or= null # ensure null instead of undefined
    new_type = kb.utils.valueType(new_value)

    # SHARED NULL MODEL - update reference
    if not @__kb_value or (@__kb_value.__kb_destroyed or (@__kb_value.__kb_null and new_value))
      @__kb_value = null
      @value_type = undefined
    value = @__kb_value

    # create or change in type
    if _.isUndefined(@value_type) or (@value_type isnt new_type and new_type isnt KB_TYPE_UNKNOWN)

      # set the collection array
      if (@value_type is KB_TYPE_COLLECTION) and (new_type == KB_TYPE_ARRAY)
        value(new_value)

      else
        @_updateValueObservable(new_value) # create new

    else if @value_type == KB_TYPE_MODEL
      # use the get/set methods
      if typeof(value.model) is 'function'
        value.model(new_value) if value.model() isnt new_value # different so update

      # different so create a new one (no way to update)
      else if kb.utils.wrappedObject(value) isnt new_value
        @_updateValueObservable(new_value) # create new

    else if @value_type == KB_TYPE_COLLECTION
      value.collection(new_value) if value.collection() isnt new_value # different so update

    else # a simple observable
      value(new_value) if value() isnt new_value # different so update

  ####################################################
  # Internal
  ####################################################
  _updateValueObservable: (new_value) ->
    c_options = @c_options
    c_options.creator = kb.utils.inferCreator(new_value, c_options.factory, c_options.path, @m, @key)
    @value_type = KB_TYPE_UNKNOWN
    creator = c_options.creator

    # release the previous value
    previous_value = @__kb_value; @__kb_value = null
    kb.release(previous_value) if previous_value # release previous

    # found a creator
    if creator
      # have the store, use it to create
      if c_options.store
        value = c_options.store.findOrCreateObservable(new_value, c_options)

      # create manually
      else 
        if creator.models_only
          value = new_value
          @value_type = KB_TYPE_SIMPLE
        else if creator.create
          value = creator.create(new_value, c_options)
        else
          value = new creator(new_value, c_options)

    # create and cache the type
    else
      @value_type = KB_TYPE_SIMPLE
      if _.isArray(new_value)
        value = ko.observableArray(new_value)
      else
        value = ko.observable(new_value)

    # determine the type
    if @value_type is KB_TYPE_UNKNOWN   
      if not ko.isObservable(value) # a view model, recognize view_models as non-observable
        @value_type = KB_TYPE_MODEL
        if typeof(value.model) isnt 'function' # manually cache the model to check for changes later
          kb.utils.wrappedObject(value, new_value)
      else if value.__kb_is_co
        @value_type = KB_TYPE_COLLECTION
      else
        @value_type = KB_TYPE_SIMPLE

    # store the value
    @__kb_value = value
    @vo(value)

kb.observable = (model, options, view_model) -> new kb.Observable(model, options, view_model)