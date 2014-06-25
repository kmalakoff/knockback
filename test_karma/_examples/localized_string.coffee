try kb = require 'knockback' catch err then kb = require './kb'

class kb.LocalizedString
  constructor: (@string_id) ->
    throw 'missing kb.locale_manager' if not kb.locale_manager
    @string = kb.locale_manager.get(@string_id)
