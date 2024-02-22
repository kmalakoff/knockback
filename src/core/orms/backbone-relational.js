/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
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

let BackboneRelational;
let kb;
const { _, Backbone } = (kb = require('../kb'));

let RelationalModel = null; // lazy check

// @nodoc
module.exports = BackboneRelational = class BackboneRelational {
  static isAvailable() {
    return !!(RelationalModel = Backbone != null ? Backbone.RelationalModel : undefined);
  } // or require?('backbone-relational')?.RelationalModel # webpack optionals

  static relationType(model, key) {
    let relation;
    if (!(model instanceof RelationalModel)) {
      return null;
    }
    if (!(relation = _.find(model.getRelations(), (test) => test.key === key))) {
      return null;
    }
    if (relation.collectionType || _.isArray(relation.keyContents)) {
      return kb.TYPE_COLLECTION;
    }
    return kb.TYPE_MODEL;
  }

  static bind(model, key, update, path) {
    let event;
    let type;
    if (!(type = BackboneRelational.relationType(model, key))) {
      return null;
    }
    const rel_fn = function (model) {
      !kb.statistics || kb.statistics.addModelEvent({ name: 'update (relational)', model, key, path });
      return update();
    };

    // VERSIONING: pre Backbone-Relational 0.8.0
    const events = kb.Backbone.Relation.prototype.sanitizeOptions ? ['update', 'add', 'remove'] : ['change', 'add', 'remove'];
    if (type === kb.TYPE_COLLECTION) {
      for (event of Array.from(events)) {
        model.bind(`${event}:${key}`, rel_fn);
      }
    } else {
      model.bind(`${events[0]}:${key}`, rel_fn);
    }

    return function () {
      if (type === kb.TYPE_COLLECTION) {
        for (event of Array.from(events)) {
          model.unbind(`${event}:${key}`, rel_fn);
        }
      } else {
        model.unbind(`${events[0]}:${key}`, rel_fn);
      }
    };
  }

  static useFunction() {
    return false;
  }
};
