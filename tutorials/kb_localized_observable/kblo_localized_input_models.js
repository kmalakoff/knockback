var LongDateLocalizer = kb.LocalizedObservable.extend({
  constructor: function(value, options, view_model) {
    kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
    return kb.utils.wrappedObservable(this);
  },
  read: function(value) {
    return Globalize.format(value, 'dd MMMM yyyy', kb.locale_manager.getLocale());
  },
  write: function(localized_string, value) {
    // reset if invalid
    var new_value = Globalize.parseDate(localized_string, 'dd MMMM yyyy', kb.locale_manager.getLocale());
    if (!(new_value && _.isDate(new_value))) {
      return kb.utils.wrappedObservable(this).resetToCurrent();
    }
    return value.setTime(new_value.valueOf());
  }
});