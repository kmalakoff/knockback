/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

const kb = require('../kb');

const { _, Backbone } = kb;

let AssociatedModel = null; // lazy bind so this file can be loaded before relational library

// @nodoc
module.exports = class BackboneAssociations {
  static isAvailable() { return !!(AssociatedModel = Backbone ? Backbone.AssociatedModel : null); }

  static keys(model) {
    if (!(model instanceof AssociatedModel)) return null;
    return _.map(model.relations, test => test.key);
  }

  static relationType(model, key) {
    if (!(model instanceof AssociatedModel)) return null;
    const relation = _.find(model.relations, test => test.key === key);
    if (!relation) return null;
    return (relation.type === 'Many') ? kb.TYPE_COLLECTION : kb.TYPE_MODEL;
  }

  static useFunction() { return false; }
};
