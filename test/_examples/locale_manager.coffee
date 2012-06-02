class _kbe.LocaleManager
  constructor: (locale_identifier, @translations_by_locale) ->
    @setLocale(locale_identifier) if locale_identifier

  get: (string_id, parameters) ->
    culture_map = @translations_by_locale[@locale_identifier] if @locale_identifier
    return '' if not culture_map
    string = if culture_map.hasOwnProperty(string_id) then culture_map[string_id] else ''
    return string if arguments == 1
    string = string.replace("{#{index}}", arg) for arg, index in Array.prototype.slice.call(arguments, 1)
    return string

  getLocale: -> return @locale_identifier
  setLocale: (locale_identifier) ->
    @locale_identifier = locale_identifier
    Globalize.culture = Globalize.findClosestCulture(locale_identifier)
    @trigger('change', this)
    culture_map = @translations_by_locale[@locale_identifier]
    return if not culture_map
    @trigger("change:#{key}", value) for key, value of culture_map
  getLocales: ->
    locales = []
    locales.push(string_id) for string_id, value of @translations_by_locale
    return locales

#######################################
# Mix in Backbone.Events so callers can subscribe
#######################################
_kbe.LocaleManager.prototype extends Backbone.Events
