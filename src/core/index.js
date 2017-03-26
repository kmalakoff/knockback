/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

const kb = require('./kb');

module.exports = kb;

kb.configure = require('./configure');

require('./monkey-patches');
kb.utils = require('./utils');
kb.Statistics = require('./statistics');
kb.Store = require('./store');
kb.Factory = require('./factory');
kb.EventWatcher = require('./event-watcher');

kb.CollectionObservable = require('./collection-observable');
kb.Observable = require('./observable');
kb.ViewModel = require('./view-model');
require('./inject');

// re-expose modules
kb.modules = { underscore: kb._, backbone: kb.Parse || kb.Backbone, knockout: kb.ko };
