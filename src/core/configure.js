import _ from 'underscore';
import BackboneAssociations from './orms/backbone-associations';
import BackboneRelational from './orms/backbone-relational';

const ALL_ORMS = {
  default: null,
  'backbone-orm': null,
  'backbone-associations': BackboneAssociations,
  'backbone-relational': BackboneRelational,
};

// @nodoc
export const settings = { orm: ALL_ORMS.default };
for (const key in ALL_ORMS) {
  if (Object.prototype.hasOwnProperty.call(ALL_ORMS, key)) {
    const value = ALL_ORMS[key];
    if (value && value.isAvailable()) {
      settings.orm = value;
      break;
    }
  }
}

// @nodoc
export const configure = (options = {}) => {
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
          settings.orm = orm;
        } else settings.orm = value;
        break;

      default: settings[key] = value; break;
    }
  });
};
