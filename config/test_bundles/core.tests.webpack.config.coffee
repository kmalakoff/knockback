path = require 'path'
_ = require 'underscore'

module.exports = _.extend  _.clone(require '../webpack-base.config.coffee'), {
  entry: './test/knockback/core.tests.coffee'
  output:
    path: '.'
    filename: '_temp/bundle-core.tests.js'
}

module.exports.resolve.alias =
  knockback: path.resolve('./knockback.js')
