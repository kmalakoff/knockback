module.exports =
  karma: true,
  shims:
    underscore: {exports: '_'}
    backbone: {exports: 'Backbone', deps: ['underscore']}
    knockback: {deps: ['backbone', 'knockout']}
    'globalize.culture.en-GB': {deps: ['globalize']}
    'globalize.culture.fr-FR': {deps: ['globalize']}
  post_load: 'this._ = this.Backbone = this.ko = this.kb = null;' # clear window references so amd version is used
  aliases: {'knockback-core': 'knockback', 'lodash': 'underscore', 'knockout-latest.debug': 'knockout'}
