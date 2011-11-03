class LocalizedString
  constructor: (@string_id) ->
    throw new Error("missing Knockback.locale_manager") if not kb.locale_manager
    @string = kb.locale_manager.get(@string_id)
