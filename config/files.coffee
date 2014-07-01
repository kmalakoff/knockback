fs = require 'fs'
path = require 'path'
_ = require 'underscore'

PLUGIN_ENTRIES =
  defaults: './src/defaults/default-observable.coffee'
  formatting: './src/formatting/formatted-observable.coffee'
  localization: './src/localization/localized-observable.coffee'
  triggering: './src/triggering/triggered-observable.coffee'
  validation: './src/validation/validation.coffee'

module.exports =
  libraries: _.flatten(_.map(_.filter(fs.readdirSync('./config/library'), (file) -> path.extname(file) is '.coffee' and file.indexOf('webpack.config.coffee') >= 0), (file) -> [file.replace('webpack.config.coffee', 'js'), file.replace('webpack.config.coffee', 'min.js')]))

  src_core: _.map(_.filter(fs.readdirSync('./src/core'), (file) -> path.extname(file) is '.coffee' and file isnt 'index.coffee'), (file) -> "./src/core/#{file}")
  src_plugin: _.values(PLUGIN_ENTRIES)

  tests_core: _.map(_.filter(fs.readdirSync('./test/knockback'), (file) -> path.extname(file) is '.coffee' and file.indexOf('core.tests.coffee') >= 0), (file) -> "./test/knockback/#{file}")
  tests_plugin: _.map(_.filter(fs.readdirSync('./test/knockback'), (file) -> path.extname(file) is '.coffee' and file.indexOf('plugin.tests.coffee') >= 0), (file) -> "./test/knockback/#{file}")

  tests_webpack: _.map(_.filter(fs.readdirSync('./config/test_bundles'), (file) -> path.extname(file) is '.coffee' and file.indexOf('.tests.webpack.config.coffee') >= 0), (file) -> "_temp/webpack/#{file.replace('.tests.webpack.config.coffee', '.tests.js')}")
