var LocalizedStringLocalizer = kb.LocalizedObservable.extend({
  constructor: function(value, options, view_model) {
    kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
    return kb.utils.wrappedObservable(this);
  },
  read: function(string_id) {
    return string_id ? kb.locale_manager.get(string_id) : '';
  }
});