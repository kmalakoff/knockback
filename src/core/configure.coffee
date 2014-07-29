{_, ko} = kb = require './kb'

ALL_ORMS =
  default: null
  'backbone-orm': null
  'backbone-associations': require './orms/backbone-associations'
  'backbone-relational': require './orms/backbone-relational'
  supermodel: require './orms/supermodel'

# set up defaults
kb.orm = ALL_ORMS.default
(kb.orm = value; break) for key, value of ALL_ORMS when value and value.isAvailable()

module.exports = (options={}) ->
  for key, value of options
    switch key
      when 'orm'
        # set by name
        if _.isString(value)
          (console.log "Knockback configure: could not find orm: #{value}. Available: #{_.keys(ALL_ORMS).join(', ')}"; continue) unless ALL_ORMS.hasOwnProperty(value)
          (console.log "Knockback configure: could not enable orm #{value}. Make sure it is included before Knockback"; continue) if (orm = ALL_ORMS[value]) and not orm.isAvailable()
          kb.orm = orm
          continue

        # set by functions
        else
          kb.orm = value

      else
        kb[key] = value
  return
