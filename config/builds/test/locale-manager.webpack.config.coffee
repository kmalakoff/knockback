_ = require 'underscore'

module.exports = _.extend  _.clone(require '../../webpack/base-config.coffee'), {
  entry: ['./test/lib/locale_manager']
  output:
    path: './test/lib'
    filename: 'locale_manager.js'
    library: 'LocaleManager'

  externals: [
    {jquery: {optional: true, root: 'jQuery', amd: 'jquery', commonjs: 'jquery', commonjs2: 'jquery'}}
    {underscore: {root: '_', amd: 'underscore', commonjs: 'underscore', commonjs2: 'underscore'}}
    {backbone: {root: 'Backbone', amd: 'backbone', commonjs: 'backbone', commonjs2: 'backbone'}}
    {knockout: {root: 'ko', amd: 'knockout', commonjs: 'knockout', commonjs2: 'knockout'}}
    {knockback: {root: 'kb', amd: 'knockback', commonjs: 'knockback', commonjs2: 'knockback'}}
  ]
}
