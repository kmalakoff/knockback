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

class Knockback.RefCountable
  @extend = Backbone.Model.extend # from Backbone non-Coffeescript inheritance (use "Knockback.RefCountable_RCBase.extend({})" in Javascript instead of "class MyClass extends Knockback.RefCountable")

  constructor: ->
    @__kb or= {}
    @__kb.rc = {}
    @__kb.rc.ref_count = 1

  __destroy: -> # NOOP

  # reference counting
  retain: ->
    throw new Error("RefCountable: ref_count is corrupt: " + @__kb.rc.ref_count) if (@__kb.rc.ref_count <= 0)
    @__kb.rc.ref_count++
    @

  release: ->
    throw new Error("RefCountable: ref_count is corrupt: " + @__kb.rc.ref_count) if (@__kb.rc.ref_count <= 0)
    @__kb.rc.ref_count--
    @__destroy() unless @__kb.rc.ref_count
    @

  refCount: -> return @__kb.rc.ref_count
