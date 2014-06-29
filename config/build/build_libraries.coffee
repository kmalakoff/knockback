Queue = require 'queue-async'

buildWebpack = require '../webpack/build'

module.exports = (callback) ->
  queue = new Queue(1)
  queue.defer (callback) -> buildWebpack(require('../webpack/knockback.webpack.config'), callback)
  queue.defer (callback) -> buildWebpack(require('../webpack/knockback-core.webpack.config'), callback)
  queue.defer (callback) -> buildWebpack(require('../webpack/knockback-full-stack.webpack.config'), callback)
  queue.await callback
