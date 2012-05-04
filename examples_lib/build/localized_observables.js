var LocalizedStringLocalizer, LongDateLocalizer, ShortDateLocalizer;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
LocalizedStringLocalizer = (function() {
  __extends(LocalizedStringLocalizer, kb.LocalizedObservable);
  function LocalizedStringLocalizer(value, options, view_model) {
    LocalizedStringLocalizer.__super__.constructor.apply(this, arguments);
    return kb.utils.wrappedObservable(this);
  }
  LocalizedStringLocalizer.prototype.read = function(value) {
    if (value.string_id) {
      return kb.locale_manager.get(value.string_id);
    } else {
      return '';
    }
  };
  return LocalizedStringLocalizer;
})();
LongDateLocalizer = (function() {
  __extends(LongDateLocalizer, kb.LocalizedObservable);
  function LongDateLocalizer(value, options, view_model) {
    LongDateLocalizer.__super__.constructor.apply(this, arguments);
    return kb.utils.wrappedObservable(this);
  }
  LongDateLocalizer.prototype.read = function(value) {
    return Globalize.format(value, 'dd MMMM yyyy', kb.locale_manager.getLocale());
  };
  LongDateLocalizer.prototype.write = function(localized_string, value) {
    var new_value, observable;
    observable = kb.utils.wrappedObservable(this);
    new_value = Globalize.parseDate(localized_string, 'dd MMMM yyyy', kb.locale_manager.getLocale());
    if (!(new_value && _.isDate(new_value))) {
      return observable.resetToCurrent();
    }
    return value.setTime(new_value.valueOf());
  };
  return LongDateLocalizer;
})();
ShortDateLocalizer = kb.LocalizedObservable.extend({
  constructor: function(value, options, view_model) {
    kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
    return kb.utils.wrappedObservable(this);
  },
  read: function(value) {
    return Globalize.format(value, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());
  },
  write: function(localized_string, value) {
    var new_value, observable;
    observable = kb.utils.wrappedObservable(this);
    new_value = Globalize.parseDate(localized_string, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());
    if (!(new_value && _.isDate(new_value))) {
      return observable.resetToCurrent();
    }
    return value.setTime(new_value.valueOf());
  }
});