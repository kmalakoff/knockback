kb = if not @kb and (typeof(require) isnt 'undefined') then require('knockback') else @kb
_ = kb._
Backbone = kb.Backbone
ko = kb.ko

# module
@Knockback = @kb = kb; module.exports = kb if (typeof(exports) isnt 'undefined')