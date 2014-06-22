# ensure the client symbols are resolved
if window? and require.shim
  require.shim([
    {symbol: '_', path: 'lodash', alias: 'underscore', optional: true}, {symbol: '_', path: 'underscore'}
    {symbol: 'Backbone', path: 'backbone'}
    {symbol: 'ko', path: 'knockout'}
  ])

module.exports = kb = require('./kb')

# required components
require(component) for component in ['./utils', './event-watcher', './store', './factory', './observable', './view-model', './collection-observable', './orm', './inject']

# optional components
for component in ['./default-observable', './formatted-observable', './localized-observable', './statistics', './triggered-observable', './validation']
    try require(component) catch err then {}

# re-expose modules
kb.modules = {}
kb.modules[component] = require(component) for component in ['underscore', 'backbone', 'knockout']
