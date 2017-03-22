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

let RelationalModel = null; // lazy bind so this file can be loaded before relational library

// @nodoc
module.exports = class BackboneRelational {
  static isAvailable() { return !!(RelationalModel = Backbone ? Backbone.RelationalModel : null); }

  static relationType(model, key) {
    if (!(model instanceof RelationalModel)) return null;
    const relation = _.find(model.getRelations(), test => test.key === key);
    if (!relation) return null;
    return (relation.collectionType || _.isArray(relation.keyContents)) ? kb.TYPE_COLLECTION : kb.TYPE_MODEL;
  }

  static bind(model, key, update, path) {
    const type = this.relationType(model, key);
    if (!type) return null;

    const relFn = function (m) {
      if (kb.statistics) kb.statistics.addModelEvent({ name: 'update (relational)', model: m, key, path });
      return update();
    };

    // VERSIONING: pre Backbone-Relational 0.8.0
    const events = kb.Backbone.Relation.prototype.sanitizeOptions ? ['update', 'add', 'remove'] : ['change', 'add', 'remove'];
    if (type === kb.TYPE_COLLECTION) _.each(events, event => model.bind(`${event}:${key}`, relFn));
    else model.bind(`${events[0]}:${key}`, relFn);

    return () => {
      if (type === kb.TYPE_COLLECTION) _.each(events, event => model.unbind(`${event}:${key}`, relFn));
      else model.unbind(`${events[0]}:${key}`, relFn);
    };
  }

  static useFunction() { return false; }
};
