require 'jquery-xhr'
global.document = global.window.document; delete global.window
module.exports = require('backbone').$ = global.$
