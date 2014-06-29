module.exports =
  entry: './test/knockback/core.tests.coffee'
  output:
    path: '.'
    filename: '_temp/webpack-core.tests.js'

  module:
    loaders: [{test: /\.coffee$/, loader: 'coffee'}]

  resolve:
    root: '.'
    moduleDirectories: ['node_modules']
