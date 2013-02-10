kb = if not @kb and (typeof(require) isnt 'undefined') then require('knockback') else @kb
_ = kb._
Model = kb.Model
Collection = kb.Collection
ko = kb.ko

# module
@Knockback = @kb = kb; module.exports = kb if (typeof(exports) isnt 'undefined')

_unwrapObservable = ko.utils.unwrapObservable