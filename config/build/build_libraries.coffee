LIBRARIES = require './libraries'
Async = require 'async'
Queue = require 'queue-async'

buildLibrary = require './build_library'
buildComponent = require './build_component'

module.exports = (callback) ->
  queue = new Queue()
  queue.defer (callback) -> Async.each LIBRARIES, buildLibrary, callback
  queue.defer (callback) -> buildComponent(callback)
  queue.await callback
