/*
  knockback.js 1.2.2
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/

let BackboneRelational,
  kb;
const { _, Backbone } = (kb = require('../kb'));

let RelationalModel = null; // lazy check

// @nodoc
module.exports = BackboneRelational = class BackboneRelational {
  static isAvailable() { return !!(RelationalModel = Backbone != null ? Backbone.RelationalModel : undefined); } // or require?('backbone-relational')?.RelationalModel # webpack optionals

  static relationType(model, key) {
    let relation;
    if (!(model instanceof RelationalModel)) { return null; }
    if (!(relation = _.find(model.getRelations(), test => test.key === key))) { return null; }
    return (relation.collectionType || _.isArray(relation.keyContents)) ? kb.TYPE_COLLECTION : kb.TYPE_MODEL;
  }

  static bind(model, key, update, path) {
    let event,
      type;
    if (!(type = this.relationType(model, key))) { return null; }
    const rel_fn = function (model) {
      !kb.statistics || kb.statistics.addModelEvent({ name: 'update (relational)', model, key, path });
      return update();
    };

    // VERSIONING: pre Backbone-Relational 0.8.0
    const events = kb.Backbone.Relation.prototype.sanitizeOptions ? ['update', 'add', 'remove'] : ['change', 'add', 'remove'];
    if (type === kb.TYPE_COLLECTION) {
      for (event of events) { model.bind(`${event}:${key}`, rel_fn); }
    } else {
      model.bind(`${events[0]}:${key}`, rel_fn);
    }

    return function () {
      if (type === kb.TYPE_COLLECTION) {
        for (event of events) { model.unbind(`${event}:${key}`, rel_fn); }
      } else {
        model.unbind(`${events[0]}:${key}`, rel_fn);
      }
    };
  }

  static useFunction() { return false; }
};
