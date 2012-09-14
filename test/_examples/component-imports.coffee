module_name = 'knockback-localization'
module_name = 'knockback' if (require.toUrl(module_name).split('./..').length is 1)

kb = if not @kb and (typeof(require) isnt 'undefined') then require(module_name) else @kb
_ = kb._
Backbone = kb.Backbone
ko = kb.ko

# module
@Knockback = @kb = kb; module.exports = kb if (typeof(exports) isnt 'undefined')