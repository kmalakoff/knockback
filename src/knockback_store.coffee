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
    throw new Error("Knockback.Store: no value created") unless value

    # update the stored value
    @values[index] = value if not @values[index]

    return value