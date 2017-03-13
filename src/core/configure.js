let kb,
  value;
const { _, ko } = (kb = require('./kb'));

const ALL_ORMS = {
  default: null,
  'backbone-orm': null,
  'backbone-associations': require('./orms/backbone-associations'),
  'backbone-relational': require('./orms/backbone-relational'),
};

// @nodoc
kb.settings = { orm: ALL_ORMS.default };
for (var key in ALL_ORMS) {
  value = ALL_ORMS[key];
  if (value && value.isAvailable()) {
    kb.settings.orm = value;
    break;
  }
}

// @nodoc
module.exports = function (options) {
  if (options == null) { options = {}; }
  for (key in options) {
    var orm;
    value = options[key];
    switch (key) {
      case 'orm':
        // set by name
        if (_.isString(value)) {
          if (!ALL_ORMS.hasOwnProperty(value)) {
            console.log(`Knockback configure: could not find orm: ${value}. Available: ${_.keys(ALL_ORMS).join(', ')}`);
            continue;
          }
          if ((orm = ALL_ORMS[value]) && !orm.isAvailable()) {
            console.log(`Knockback configure: could not enable orm ${value}. Make sure it is included before Knockback`);
            continue;
          }
          kb.settings.orm = orm;
          continue;

        // set by functions
        } else {
          kb.settings.orm = value;
        }
        break;

      default:
        kb.settings[key] = value;
    }
  }
};
