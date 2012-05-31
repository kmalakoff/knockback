###
  knockback_store.js
  (c) 2012 Kevin Malakoff.
  Knockback.Store is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.Store
  constructor: ->
    @keys = []
    @values = []

  destroy: ->
    @keys = null

    # first break cycles in the collections since relations are the typical source of recursion
    for index, value of @values
      continue unless kb.utils.observableInstanceOf(value, kb.CollectionObservable)

      @values[index] = null # releasing
      value.release() while (value.refCount() > 0)

    # then release the view models
    for index, value of @values
      continue unless value

      @values[index] = null # releasing
      if (value instanceof kb.RefCountable)
        value.release() while (value.refCount() > 0)
      else
        kb.utils.release(value)
    @values = null

  registerValue: (key, value) ->
    value.retain() if (value instanceof kb.RefCountable)
    index = _.indexOf(@keys, key)
    if (index >= 0)
      @values[index] = value
    else
      @keys.push(key)
      @values.push(value)
    return value

  resolveValue: (key, create_fn, args) ->
    # use an existing
    index = _.indexOf(@keys, key)
    if (index >= 0)
      # value is in the store (not still being resolved)
      if @values[index]
        # reference is out-of-date, clear it out
        if (@values[index] instanceof kb.RefCountable) and (@values[index].refCount() <= 0)
          @values[index] = null
        else
          return if (@values[index] instanceof kb.RefCountable) then @values[index].retain() else @values[index]

    # stub out a new value
    else
      index = @keys.length
      @keys.push(key)
      @values.push(undefined)

    # create the value
    value = create_fn.apply(null, Array.prototype.slice.call(arguments, 2))

    # update the stored value
    if @keys[index] != key
      @registerValue(key, value)
    else if not @values[index]
      value.retain() if (value instanceof kb.RefCountable)
      @values[index] = value

    return value

  releaseValue: (value) ->
    return unless (value instanceof kb.RefCountable)
    value.release()
    return if (value.refCount() > 0)
    index = _.indexOf(@values, value)
    return unless index >= 0
    @values[index] = 0

  addResolverToOptions: (options, key) ->
    return _.extend(options, {store: this, store_key: key})

  @resolveFromOptions: (options, value) ->
    return unless options.store and options.store_key
    options.store.registerValue(options.store_key, value)