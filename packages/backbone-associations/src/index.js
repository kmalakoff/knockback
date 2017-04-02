/*
  knockback.js 2.0.0-alpha.1
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

import _ from 'underscore';
import Backbone from 'backbone';

import kb from '@knockback/core';

// @nodoc
module.exports = class BackboneAssociations {
  static keys(model) {
    if (!Backbone.AssociatedModel || !(model instanceof Backbone.AssociatedModel)) return null;
    return _.map(model.relations, x => x.key);
  }

  static relationType(model, key) {
    if (!Backbone.AssociatedModel || !(model instanceof Backbone.AssociatedModel)) return null;
    const relation = _.find(model.relations, x => x.key === key);
    if (!relation) return null;
    return (relation.type === 'Many') ? kb.TYPE_COLLECTION : kb.TYPE_MODEL;
  }
}
