kb = if not @kb and (typeof(require) isnt 'undefined') then require('knockback') else @kb
_ = kb._
Backbone = kb.Backbone
ko = kb.ko