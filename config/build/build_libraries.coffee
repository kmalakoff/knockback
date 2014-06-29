LIBRARIES = require './libraries'
Async = require 'async'

buildLibrary = require './build_library'

module.exports = (callback) -> Async.each LIBRARIES, buildLibrary, callback
