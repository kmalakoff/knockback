fs = require 'fs'
path = require 'path'
_ = require 'underscore'

ROOT = './test/knockback'
FILES = _.map(_.filter(fs.readdirSync(ROOT), (file) -> path.extname(file) is '.coffee'), (file) -> "#{ROOT}/#{file}")

module.exports = _.extend  _.clone(require '../../webpack-base.config.coffee'), {
  entry: FILES
  output:
    path: '.'
    filename: '_temp/webpack/knockback.tests.js'
}

module.exports.resolve.alias =
  knockback: path.resolve('./knockback-core.js')
  'knockback-examples-localization': path.resolve('./_temp/knockback-examples-localization.js')
