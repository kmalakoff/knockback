/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let BackboneAssociations;
let kb;
const { _, Backbone } = (kb = require('../kb'));

let AssociatedModel = null; // lazy check

// @nodoc
module.exports = BackboneAssociations = class BackboneAssociations {
  static isAvailable() {
    return !!(AssociatedModel = Backbone != null ? Backbone.AssociatedModel : undefined);
  } // or require?('backbone-associations')?.AssociatedModel # webpack optionals

  static keys(model) {
    if (!(model instanceof AssociatedModel)) {
      return null;
    }
    return _.map(model.relations, (test) => test.key);
  }

  static relationType(model, key) {
    let relation;
    if (!(model instanceof AssociatedModel)) {
      return null;
    }
    if (!(relation = _.find(model.relations, (test) => test.key === key))) {
      return null;
    }
    if (relation.type === 'Many') {
      return kb.TYPE_COLLECTION;
    }
    return kb.TYPE_MODEL;
  }

  static useFunction() {
    return false;
  }
};
