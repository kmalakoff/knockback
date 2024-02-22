kb = window?.kb; try kb or= require?('knockback') catch; try kb or= require?('../../../knockback')

exports =
  LocaleManager: require('./lib/locale_manager')

(if window? then window else if global? then global).__test__parameters = exports; module?.exports = exports
