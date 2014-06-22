# ensure the client symbols are resolved
if window? and require.shim
  require.shim([
    {symbol: '_', path: 'lodash', alias: 'underscore', optional: true}, {symbol: '_', path: 'underscore'}
    {symbol: 'ko', path: 'knockout'}
    {symbol: 'kb', path: 'knockback'}
  ])

module.exports = require './validation'
require './validators'
