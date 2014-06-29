_ = require 'underscore'

PLUGINS = require './plugins'

pluginToBuildOptions = (plugin) -> {paths: ["src/#{plugin}/**/*.coffee"], modules: {type: 'local-shim', file_name: "knockback-#{plugin}.js", umd: {symbol: "knockback-#{plugin}", dependencies: ['knockback']}}, destination: './lib/'}

module.exports = LIBRARIES = (pluginToBuildOptions(plugin) for plugin in PLUGINS)
LIBRARIES.push pluginToBuildOptions('statistics')

# core and full variants
MODULE_ADD_PATHS = _.flatten((["src/#{plugin}/**/*.coffee", "!src/#{plugin}/index.coffee"] for plugin in PLUGINS))
LIBRARIES.push {paths: ['src/core/**/*.coffee'], modules: {type: 'local-shim', file_name: 'knockback-core.js', umd: {symbol: 'kb', dependencies: ['underscore', 'backbone', 'knockout']}}, destination: './', stack_file_name: 'knockback-core-stack.js'}
LIBRARIES.push {paths: ['src/core/**/*.coffee'].concat(MODULE_ADD_PATHS), modules: {type: 'local-shim', file_name: 'knockback.js', umd: {symbol: 'kb', dependencies: ['underscore', 'backbone', 'knockout']}}, destination: './', stack_file_name: 'knockback-full-stack.js'}
