path = require 'path'
_ = require 'underscore'

module.exports = _.extend  _.clone(require '../webpack/base-config.coffee'), {
  entry: require('../files').tests_core
  output:
    path: '.'
    filename: '_temp/webpack/knockback-core.tests.js'
}

module.exports.resolve.alias =
  knockback: path.resolve('./knockback-core.js')
