class LocalizedObservable_LocalizedString extends kb.LocalizedObservable
  constructor: (value, options={}, view_model) ->
    return super(value, _.extend(options, {
      read: =>
        localized_string = @getObservedValue(); return '' if not localized_string
        return if (localized_string.string_id) then Knockback.locale_manager.get(localized_string.string_id) else ''
    }), view_model)

# NOTE: dependency on globalize
class LocalizedObservable_LongDate extends kb.LocalizedObservable
  constructor: (value, options={}, view_model) ->
    return super(value, _.extend(options, {
      read: =>
        date = @getObservedValue(); return '' if not date
        return Globalize.format(date, 'dd MMMM yyyy', Knockback.locale_manager.getLocale())
      write: (localized_string) =>
        date = @getObservedValue(); return '' if not date
        new_value = Globalize.parseDate(localized_string, 'dd MMMM yyyy', Knockback.locale_manager.getLocale())
        return @observable.forceRefresh() if not (new_value and _.isDate(new_value)) # reset if invalid
        date.setTime(new_value.valueOf())
    }), view_model)

# NOTE: dependency on globalize
class LocalizedObservable_ShortDate extends kb.LocalizedObservable
  constructor: (value, options={}, view_model) ->
    return super(value, _.extend(options, {
      read: =>
        date = @getObservedValue(); return '' if not date
        return Globalize.format(date, Globalize.cultures[Knockback.locale_manager.getLocale()].calendars.standard.patterns.d, Knockback.locale_manager.getLocale())
      write: (localized_string) =>
        date = @getObservedValue(); return '' if not date
        new_value = Globalize.parseDate(localized_string, Globalize.cultures[Knockback.locale_manager.getLocale()].calendars.standard.patterns.d, Knockback.locale_manager.getLocale())
        return @observable.forceRefresh() if not (new_value and _.isDate(new_value)) # reset if invalid
        date.setTime(new_value.valueOf())
    }), view_model)
