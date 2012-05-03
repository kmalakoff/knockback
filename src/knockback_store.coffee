###
  knockback_store.js
  (c) 2011 Kevin Malakoff.
  Knockback.Store is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class Knockback.Store
  constructor: ->
    @keys = []
    @values = []

  find: (key) ->
    index = _.indexOf(@keys, key)
    return if (index >= 0) then @values[index] else undefined

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
      return @values[index] if @values[index]

    # stub out a new value
    else
      index = @keys.length
      @keys.push(key)
      @values.push(undefined)

    # create the value
    value = create_fn.apply(null, Array.prototype.slice.call(arguments, 2))
    throw new Error("Knockback.Store: no value created") if not value

    # update the stored value
    @values[index] = value if not @values[index]

    return value

# class StoreEntry
#   constructor: (@key) ->
#     @unresolved_ref_count = 0
#     @value = null
#
#   addRef: ->
#     if @value
#       @value.retain() if (@value instanceof kb.RefCountable)
#     else
#       @unresolved_ref_count++
#
#     return @value
#
#   setValue: (value) ->
#     throw new Error("Knockback.Store: entry value is being set multiple times") if @value
#     @value = value
#     if (@value instanceof kb.RefCountable)
#       while @unresolved_ref_count > 0
#         @unresolved_ref_count--
#         @value.retain()
#     else
#       @unresolved_ref_count = 0
#     return @value
# class StorePromise
#   constructor: (@entry) ->
#     return _.bind(@resolve, @)
#
#   resolve: ->
#     throw new Error("Knockback.Store: store resolve not yet resolved") unless @entry.value
#     if not @value_resolved and (@value instanceof kb.RefCountable)
#       @entry.value.resolve()
#       @value_resolved = true
#     return @entry.value
#
# class StoreEntry
#   constructor: (@key) ->
#     @unresolved_ref_count = 0
#     @value = null
#
# class Knockback.Store
#   constructor: ->
#     @entries = []
#
#   destroy: ->
#     @entries = null
#
#   find: (key) ->
#     entry = _.find(@entries, ((test) -> return (test.key==key)))
#     return if entry then entry.value else null
#
#   add: (key, value) ->
#     entry = new StoreEntry(key)
#     @entries.push(entry)
#     return entry
#
#   resolve: (key, create_fn, args) ->
#     index = @indexOf(key)
#     entry = if (index >= 0) then @entries[index] else null
#
#     # first time encountered so create
#     if not entry
#       entry = new StoreEntry(key)
#       @entries.push(entry)
#       entry.value = create_fn.apply(null, Array.prototype.slice.call(arguments, 2))
#
#     return new StorePromise(entry)
#
#   remove: (key) ->
#     index = @indexOf(key)
#     throw new Error("Knockback.Store: key #{key} not found for remove") unless (index >= 0)
#     @entries.splice(index, 1)
#
#   indexOf: (key) ->
#     index = 0
#     for entry in @entries
#       return index if (entry.key == key)
#       index++
#     return -1