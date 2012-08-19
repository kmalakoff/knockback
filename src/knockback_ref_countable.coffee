###
  knockback_ref_countable.js
  (c) 2012 Kevin Malakoff.
  Knockback.RefCountable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

####################################################
# API
#   * __destroy() - override for custom cleanup when all references are released. Note: this function is __destroy instead of _destroy due to an incompatibility with a Knockout convention (https://github.com/kmalakoff/knockback/pull/17)
####################################################

class kb.RefCountable
  @extend = Backbone.Model.extend # from Backbone non-Coffeescript inheritance (use "kb.RefCountable_RCBase.extend({})" in Javascript instead of "class MyClass extends kb.RefCountable")

  constructor: ->
    @__kb_ref_count = 1

  __destroy: -> # NOOP

  # reference counting
  retain: ->
    throw "RefCountable: ref count is corrupt: #{@__kb_ref_count}" if (@__kb_ref_count <= 0)
    @__kb_ref_count++
    @

  release: (all) ->
    throw "RefCountable: ref count is corrupt: #{@__kb_ref_count}" if (@__kb_ref_count <= 0)
    if all then @__kb_ref_count = 0 else @__kb_ref_count--
    @__destroy() unless @__kb_ref_count
    @

  refCount: -> return @__kb_ref_count