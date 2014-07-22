path = require 'path'
_ = require 'underscore'

module.exports = _.extend  _.clone(require '../../webpack/base-config.coffee'), {
  entry: _.flatten([require('../../files').tests_core, require('../../files').tests_plugin])
}

module.exports.resolve.alias =
  knockback: path.resolve('./knockback.js')
