const kb = require('./kb');

const { _ } = kb;

const ALL_ORMS = {
  default: null,
  'backbone-orm': null,
  'backbone-associations': require('./orms/backbone-associations'),
  'backbone-relational': require('./orms/backbone-relational'),
};

// @nodoc
kb.settings = { orm: ALL_ORMS.default };
for (const key in ALL_ORMS) {
  if (Object.prototype.hasOwnProperty.call(ALL_ORMS, key)) {
    const value = ALL_ORMS[key];
    if (value && value.isAvailable()) {
      kb.settings.orm = value;
      break;
    }
  }
}

// @nodoc
module.exports = function (options = {}) {
  _.each(options, (value, key) => {
    switch (key) {
      case 'orm':
        // set by name
        if (_.isString(value)) {
          if (!Object.prototype.hasOwnProperty.call(ALL_ORMS, value)) {
            (typeof console === 'undefined') || console.log(`Knockback configure: could not find orm: ${value}. Available: ${_.keys(ALL_ORMS).join(', ')}`);
            return;
          }

          const orm = ALL_ORMS[value];
          if (orm && !orm.isAvailable()) {
            (typeof console === 'undefined') || console.log(`Knockback configure: could not enable orm ${value}. Make sure it is included before Knockback`);
            return;
          }
          kb.settings.orm = orm;
        } else kb.settings.orm = value;
        break;

      default: kb.settings[key] = value; break;
    }
  });
};
