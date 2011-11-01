class LocalizedString
  constructor: (@string_id) ->
    throw new Error("missing Knockback.locale_manager") if not Knockback.locale_manager
    @string = Knockback.locale_manager.get(@string_id)
