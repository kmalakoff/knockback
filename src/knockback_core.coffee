###
  knockback.js 0.16.0
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.js is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
  Dependencies: Knockout.js, Backbone.js, and Underscore.js.
    Optional dependency: Backbone.ModelRef.js.
###

# import Underscore (or Lo-Dash with precedence), Backbone, and Knockout
if (typeof(require) != 'undefined') then (try _ = require('lodash') catch e then _ = require('underscore')) else _ = @_
_ = _._ if _ and (_.hasOwnProperty('_')) # LEGACY
Backbone = if not @Backbone and (typeof(require) != 'undefined') then require('backbone') else @Backbone
ko = if not @ko and (typeof(require) != 'undefined') then require('knockout') else @ko

# export or create Knockback namespace and kb alias
Knockback = kb = @Knockback = @kb = if (typeof(exports) != 'undefined') then exports else {}
kb.VERSION = '0.16.0'

# Locale Manager - if you are using localization, set this property.
# It must have Backbone.Events mixed in and implement a get method like Backbone.Model, eg. get: (attribute_name) -> return somthing
kb.locale_manager = undefined

# stats
kb.stats = {collection_observables: 0, view_models: 0}
kb.stats_on = false