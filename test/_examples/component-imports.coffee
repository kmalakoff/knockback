if not @kb then (try kb = require('knockback-localization') catch e then kb = require('knockback')) else (kb = @kb)
_ = kb._
Model = kb.Model
Collection = kb.Collection
ko = kb.ko

# module
@Knockback = @kb = kb; module.exports = kb if (typeof(exports) isnt 'undefined')