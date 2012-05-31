class kb._.LocalizedStringLocalizer extends kb.LocalizedObservable
  constructor: (value, options, view_model) ->
    super
    return kb.utils.wrappedObservable(@)
  read: (value) ->
    return if (value.string_id) then kb.locale_manager.get(value.string_id) else ''

# NOTE: dependency on globalize
class kb._.LongDateLocalizer extends kb.LocalizedObservable
  constructor: (value, options, view_model) ->
    super
    return kb.utils.wrappedObservable(@)
  read: (value) ->
    return Globalize.format(value, 'dd MMMM yyyy', kb.locale_manager.getLocale())
  write: (localized_string, value) ->
    new_value = Globalize.parseDate(localized_string, 'dd MMMM yyyy', kb.locale_manager.getLocale())
    return kb.utils.wrappedObservable(this).resetToCurrent() if not (new_value and _.isDate(new_value)) # reset if invalid
    value.setTime(new_value.valueOf())

# NOTE: dependency on globalize - notice the alternative formulation with extend
kb._.ShortDateLocalizer = kb.LocalizedObservable.extend({
  constructor: (value, options, view_model) ->
    kb.LocalizedObservable.prototype.constructor.apply(this, arguments)
    return kb.utils.wrappedObservable(@)
  read: (value) ->
    return Globalize.format(value, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale())
  write: (localized_string, value) ->
    new_value = Globalize.parseDate(localized_string, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale())
    return kb.utils.wrappedObservable(this).resetToCurrent() if not (new_value and _.isDate(new_value)) # reset if invalid
    value.setTime(new_value.valueOf())
})
