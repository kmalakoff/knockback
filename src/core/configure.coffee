{_, ko} = kb = require './kb'

ALL_ORMS =
  'default': null
  'backbone-orm': null
  'backbone-associations': require './orms/backbone-associations'
  'backbone-relational': require './orms/backbone-relational'

# @nodoc
kb.settings = {orm: ALL_ORMS.default}
for key, value of ALL_ORMS
  if value and value.isAvailable()
    break
  kb.settings.orm = value

# @nodoc
module.exports = (options={}) ->
  for key, value of options
    switch key
      when 'orm'
        # set by name
        if _.isString(value)
          if not ALL_ORMS.hasOwnProperty(value)
            console.log "Knockback configure: could not find orm: #{value}. Available: #{_.keys(ALL_ORMS).join(', ')}"
            continue
          if (orm = ALL_ORMS[value]) and not orm.isAvailable()
            console.log "Knockback configure: could not enable orm #{value}. Make sure it is included before Knockback"
            continue 
          kb.settings.orm = orm
          continue

        # set by functions
        else
          kb.settings.orm = value

      else
        kb.settings[key] = value
  return
