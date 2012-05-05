###
  knockback_store.js
  (c) 2012 Kevin Malakoff.
  Knockback.Store is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class Knockback.Store
  constructor: ->
    @keys = []
    @values = []

  destroy: ->
    @keys = null

    # first break cycles in the collections since relations are the typical source of recursion
    for value in @values
      continue unless kb.utils.observableInstanceOf(value, kb.CollectionObservable)
      value.release() while (value.refCount() > 0)

    # then release the view models
    for value in @values
      continue unless (value instanceof kb.ViewModel)
      value.release() while (value.refCount() > 0)
    @values = null

  add: (key, value) ->
    index = _.indexOf(@keys, key)
    if (index >= 0)
      @values[index] = value
    else
      @keys.push(key)
      @values.push(value)
    return value

  resolve: (key, create_fn, args) ->
    # use an existing
    index = _.indexOf(@keys, key)
    if (index >= 0)
      # value is in the store (not still being resolved)
      if @values[index]
        # reference is out-of-date, clear it out
        if (typeof(@values[index].refCount) == 'function') and (@values[index].refCount() <= 0)
          @values[index] = null
        else
          return if (typeof(@values[index].retain) == 'function') then @values[index].retain() else @values[index]

    # stub out a new value
    else
      index = @keys.length
      @keys.push(key)
      @values.push(undefined)

    # create the value
    value = create_fn.apply(null, Array.prototype.slice.call(arguments, 2))

    # update the stored value
    if @keys[index] != key
      @add(key, value)
    else if not @values[index]
      @values[index] = value

    return value

  addResolverToOptions: (options, key) ->
    return _.extend(options, {__kb_store: this, __kb_store_key: key})

  @resolveFromOptions: (options, value) ->
    return unless options.__kb_store and options.__kb_store_key
    options.__kb_store.add(options.__kb_store_key, value)