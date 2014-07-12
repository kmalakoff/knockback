kb = window?.kb; try kb or= require?('knockback')
require './localized_observables'
require './localized_string'

Globalize = require './globalize/globalize'
require './globalize/globalize.culture.en-GB.js'; require './globalize/globalize.culture.fr-FR.js'

module.exports = class kb.LocaleManager
  @prototype extends kb.Events # Mix in kb.Events so callers can subscribe

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
    @trigger('change', this)
    @trigger("change:#{key}", value) for key, value of (@translations_by_locale[@locale_identifier] or {})
    return
  getLocales: ->
    locales = []
    locales.push(string_id) for string_id, value of @translations_by_locale
    return locales
