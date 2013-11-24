class RecordViewModel extends kb.ViewModel
  constructor: (model, options={}) ->
    common_requires = ['_selected', '_for_delete', 'active', 'name', 'type', '_change_type', 'zone', 'value']
    _.extend(options, {requires: common_requires})
    super(model, options)

class Record extends Backbone.Model
class RecordCollection extends Backbone.Collection
  model: Record

records = kb.collectionObservable(new RecordCollection([new Record({id: 1}), new Record({id: 2})]), {view_model: RecordViewModel})
_.last(records()).destroy()
