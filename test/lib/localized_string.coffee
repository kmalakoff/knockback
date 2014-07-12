kb = window?.kb; try kb or= require?('knockback') catch; try kb or= require?('../../knockback')

module.exports = class kb.LocalizedString
  constructor: (@string_id) ->
    throw 'missing kb.locale_manager' if not kb.locale_manager
    @string = kb.locale_manager.get(@string_id)
