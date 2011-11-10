class LocalizedStringLocalizer extends kb.LocalizedObservable
  constructor: (value, options, view_model) ->
    super; return kb.wrappedObservable(this)
  read: (value) ->
    return if (value.string_id) then kb.locale_manager.get(value.string_id) else ''

# NOTE: dependency on globalize
class LongDateLocalizer extends kb.LocalizedObservable
  constructor: (value, options, view_model) ->
    super; return kb.wrappedObservable(this)
  read: (value) ->
    return Globalize.format(value, 'dd MMMM yyyy', kb.locale_manager.getLocale())
  write: (localized_string, value, observable) ->
    new_value = Globalize.parseDate(localized_string, 'dd MMMM yyyy', kb.locale_manager.getLocale())
    return observable.resetToCurrent() if not (new_value and _.isDate(new_value)) # reset if invalid
    value.setTime(new_value.valueOf())

# NOTE: dependency on globalize - notice the alternative formulation
class ShortDateLocalizer extends kb.LocalizedObservable
  constructor: (value, options={}, view_model) ->
    super(value, _.extend(options, {
      read: (value) ->
        return Globalize.format(date, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale())
      write: (localized_string, value, observable) =>
        new_value = Globalize.parseDate(localized_string, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale())
        return observable.resetToCurrent() if not (new_value and _.isDate(new_value)) # reset if invalid
        date.setTime(new_value.valueOf())
    }), view_model)
    return kb.wrappedObservable(this)
