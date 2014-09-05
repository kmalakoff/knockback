{_, ko} = kb = require './kb'

# @nodoc
module.exports = class TypedValue
  constructor: (@create_options) ->
    @_vo = ko.observable(null) # create a value observable for the first dependency

  destroy: ->
    @__kb_released = true
    if previous_value = @__kb_value
      @__kb_value = null
      if @create_options.store and kb.utils.wrappedCreator(previous_value) then @create_options.store.release(previous_value) else kb.release(previous_value)
    @create_options = null

  value: -> ko.utils.unwrapObservable(@_vo())
  rawValue: -> return @__kb_value

  valueType: (model, key) ->
    new_value = kb.getValue(model, key)
    @value_type or @_updateValueObservable(new_value) # create so we can check the type
    return @value_type

  update: (new_value) ->
    return if @__kb_released # destroyed, nothing to do

    # determine the new type
    (new_value isnt undefined) or (new_value = null) # ensure null instead of undefined
    new_type = kb.utils.valueType(new_value)

    (@__kb_value = @value_type = undefined) if @__kb_value?.__kb_released
    value = @__kb_value

    switch @value_type
      when kb.TYPE_COLLECTION
        return value(new_value) if @value_type is kb.TYPE_COLLECTION and new_type is kb.TYPE_ARRAY
        if new_type is kb.TYPE_COLLECTION or _.isNull(new_value)
          # use the provided CollectionObservable
          if new_value and new_value instanceof kb.CollectionObservable
            @_updateValueObservable(kb.utils.wrappedObject(new_value), new_value)
          else
            value.collection(new_value) if kb.peek(value.collection) isnt new_value # collection observables are allocated once
          return

      when kb.TYPE_MODEL
        if new_type is kb.TYPE_MODEL or _.isNull(new_value)
          # use the provided ViewModel
          if new_value and not kb.isModel(new_value)
            @_updateValueObservable(kb.utils.wrappedObject(new_value), new_value)
          else
            @_updateValueObservable(new_value) if kb.utils.wrappedObject(value) isnt kb.utils.resolveModel(new_value)
          return

    if @value_type is new_type and not _.isUndefined(@value_type)
      value(new_value) if kb.peek(value) isnt new_value
    else
      @_updateValueObservable(new_value) if kb.peek(value) isnt new_value

  _updateValueObservable: (new_value, new_observable) ->
    create_options = @create_options
    creator = kb.utils.inferCreator(new_value, create_options.factory, create_options.path)

    # retain previous type
    if (new_value is null) and not creator
      if @value_type is kb.TYPE_MODEL
        creator = kb.ViewModel
      else if @value_type is kb.TYPE_COLLECTION
        creator = kb.CollectionObservable
    create_options.creator = creator

    value_type = kb.TYPE_UNKNOWN
    [previous_value, @__kb_value] = [@__kb_value, undefined]

    if new_observable
      value = new_observable
      create_options.store.retain(new_observable, new_value, creator) if create_options.store

    # found a creator
    else if creator
      # have the store, use it to create
      if create_options.store
        value = create_options.store.retainOrCreate(new_value, create_options)

      # create manually
      else
        if creator.models_only
          value = new_value
          value_type = kb.TYPE_SIMPLE
        else if creator.create
          value = creator.create(new_value, create_options)
        else
          value = new creator(new_value, create_options)

    # create and cache the type
    else
      if _.isArray(new_value)
        value_type = kb.TYPE_ARRAY
        value = ko.observableArray(new_value)
      else
        value_type = kb.TYPE_SIMPLE
        value = ko.observable(new_value)

    # determine the type
    if (@value_type = value_type) is kb.TYPE_UNKNOWN
      if not ko.isObservable(value) # a view model, recognize view_models as non-observable
        @value_type = kb.TYPE_MODEL
        kb.utils.wrappedObject(value, kb.utils.resolveModel(new_value))
      else if value.__kb_is_co
        @value_type = kb.TYPE_COLLECTION
        kb.utils.wrappedObject(value, new_value)
      else if not @value_type
        @value_type = kb.TYPE_SIMPLE

    # release previous
    if previous_value
      if @create_options.store then @create_options.store.release(previous_value) else kb.release(previous_value)

    # store the value
    @__kb_value = value
    @_vo(value)

  _inferType: (value) ->
