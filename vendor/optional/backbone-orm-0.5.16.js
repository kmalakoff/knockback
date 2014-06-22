
/*
  backbone-orm.js 0.5.16
  Copyright (c) 2013 Vidigami - https://github.com/vidigami/backbone-orm
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Dependencies: Backbone.js, Underscore.js, and Moment.js.
 */
var e;

if ((typeof window !== "undefined" && window !== null) && require.shim) {
  require.shim([
    {
      symbol: '_',
      path: 'lodash',
      alias: 'underscore',
      optional: true
    }, {
      symbol: '_',
      path: 'underscore'
    }, {
      symbol: 'Backbone',
      path: 'backbone'
    }, {
      symbol: 'moment',
      path: 'moment'
    }, {
      symbol: 'stream',
      path: 'stream',
      optional: true
    }
  ]);
}

module.exports = {
  sync: require('./memory/sync'),
  Utils: require('./utils'),
  JSONUtils: require('./json_utils'),
  Queue: require('./queue'),
  DatabaseURL: require('./database_url'),
  modules: {
    url: require('url'),
    querystring: require('querystring'),
    'lru-cache': require('lru-cache'),
    underscore: require('underscore'),
    backbone: require('backbone'),
    moment: require('moment'),
    inflection: require('inflection')
  },
  Cursor: require('./cursor'),
  Schema: require('./schema'),
  ConnectionPool: require('./connection_pool'),
  CacheSingletons: require('./cache/singletons')
};

try {
  module.exports.modules.stream = require('stream');
} catch (_error) {
  e = _error;
}
