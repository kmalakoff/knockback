path = require 'path'
_ = require 'underscore'

module.exports = _.extend  _.clone(require '../../webpack/base-config.coffee'), {
  entry: _.flatten([require('../../files').tests_core, require('../../files').tests_plugin])
  output:
    path: '.'
    filename: '_temp/webpack/knockback-lodash.tests.js'
}

module.exports.resolve.alias =
  underscore: path.resolve('./vendor/optional/lodash-2.4.1.js')
  knockback: path.resolve('./knockback.js')
