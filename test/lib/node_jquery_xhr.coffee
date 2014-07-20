require 'node-jquery-xhr'
global.document = global.window.document
module.exports = require('backbone').$ = global.$
