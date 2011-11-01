class LocaleManager
  constructor: (locale_identifier, @id_to_string_map_by_culture) ->
    @setLocale(locale_identifier)

  get: (string_id) ->
    culture_map = @id_to_string_map_by_culture[@locale_identifier]
    return '' if not culture_map
    return if culture_map.hasOwnProperty(string_id) then culture_map[string_id] else ''

  getLocale: -> return @locale_identifier
  setLocale: (locale_identifier) ->
    @locale_identifier = locale_identifier
    Globalize.culture = Globalize.findClosestCulture(locale_identifier)
    @trigger('change', this)
    culture_map = @id_to_string_map_by_culture[@locale_identifier]
    return if not culture_map
    @trigger("change:#{key}", value) for key, value of culture_map

#######################################
# Mix in Backbone.Events so callers can subscribe
#######################################
LocaleManager.prototype extends Backbone.Events
