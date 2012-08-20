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
    (@__kb_ref_count > 0) or throwUnexpected(this, 'ref count is corrupt')
    @__kb_ref_count++
    @

  releaseReferences: ->
    # used to free all references so an object can be released

  release: ->
    (@__kb_ref_count > 0) or throwUnexpected(this, 'ref count is corrupt')
    @__kb_ref_count--
    @__destroy() unless @__kb_ref_count
    @

  refCount: -> return @__kb_ref_count