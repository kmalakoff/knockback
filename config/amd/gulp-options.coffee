module.exports =
  karma: true,
  shims:
    underscore: {exports: '_'}
    backbone: {exports: 'Backbone', deps: ['underscore']}
    knockback: {deps: ['backbone', 'knockout']}
    'globalize.culture.en-GB': {deps: ['globalize']}
    'globalize.culture.fr-FR': {deps: ['globalize']}
  post_load: 'window._ = window.Backbone = window.ko = window.kb = null;'
  aliases: {'knockback-core': 'knockback', 'lodash': 'underscore', 'knockout-latest.debug': 'knockout'}
