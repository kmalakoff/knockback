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
        @values[index].retain?()  # retain on a kb.CollectionObservable will not return the wrapped observable
        return @values[index]

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