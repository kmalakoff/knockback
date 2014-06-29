module.exports =
  entry: ['./test/lib/localized_string', './test/lib/localized_observables', './test/lib/locale_manager']
  output:
    path: './_temp'
    filename: 'knockback-examples-localization.js'
    library: 'kbel'
    libraryTarget: 'umd'

  module:
    loaders: [{test: /\.coffee$/, loader: 'coffee'}]

  resolve:
    extensions: ['', '.coffee', '.js']

  externals: [
    {jquery: 'jQuery'}
    {underscore: {root: '_', amd: 'underscore', commonjs: 'underscore', commonjs2: 'underscore'}}
    {backbone: {root: 'Backbone', amd: 'backbone', commonjs: 'backbone', commonjs2: 'backbone'}}
    {knockout: {root: 'ko', amd: 'knockout', commonjs: 'knockout', commonjs2: 'knockout'}}
    {knockback: {root: 'kb', amd: 'knockback', commonjs: 'knockback', commonjs2: 'knockback'}}
  ]
