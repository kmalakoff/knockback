/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class RecordViewModel extends kb.ViewModel {
  constructor(model, options) {
    if (options == null) {
      options = {};
    }
    const common_requires = ['_selected', '_for_delete', 'active', 'name', 'type', '_change_type', 'zone', 'value'];
    _.extend(options, { requires: common_requires });
    super(model, options);
  }
}

class Record extends Backbone.Model {}
class RecordCollection extends Backbone.Collection {
  static initClass() {
    RecordCollection.prototype.model = Record;
  }
}
RecordCollection.initClass();

const records = kb.collectionObservable(new RecordCollection([new Record({ id: 1 }), new Record({ id: 2 })]), { view_model: RecordViewModel });
_.last(records()).destroy();

kb.release(records);
