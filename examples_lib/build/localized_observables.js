var LocalizedObservable_LocalizedString, LocalizedObservable_LongDate, LocalizedObservable_ShortDate;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
LocalizedObservable_LocalizedString = (function() {
  __extends(LocalizedObservable_LocalizedString, kb.LocalizedObservable);
  function LocalizedObservable_LocalizedString(value, options, view_model) {
    if (options == null) {
      options = {};
    }
    return LocalizedObservable_LocalizedString.__super__.constructor.call(this, value, _.extend(options, {
      read: __bind(function() {
        var localized_string;
        localized_string = this.getObservedValue();
        if (!localized_string) {
          return '';
        }
        if (localized_string.string_id) {
          return Knockback.locale_manager.get(localized_string.string_id);
        } else {
          return '';
        }
      }, this)
    }), view_model);
  }
  return LocalizedObservable_LocalizedString;
})();
LocalizedObservable_LongDate = (function() {
  __extends(LocalizedObservable_LongDate, kb.LocalizedObservable);
  function LocalizedObservable_LongDate(value, options, view_model) {
    if (options == null) {
      options = {};
    }
    return LocalizedObservable_LongDate.__super__.constructor.call(this, value, _.extend(options, {
      read_write: true,
      read: __bind(function() {
        var date;
        date = this.getObservedValue();
        if (!date) {
          return '';
        }
        return Globalize.format(date, 'dd MMMM yyyy', Knockback.locale_manager.getLocale());
      }, this),
      write: __bind(function(localized_string) {
        var date, new_value;
        date = this.getObservedValue();
        if (!date) {
          return '';
        }
        new_value = Globalize.parseDate(localized_string, 'dd MMMM yyyy', Knockback.locale_manager.getLocale());
        if (!(new_value && _.isDate(new_value))) {
          return this.observable.forceRefresh();
        }
        return date.setTime(new_value.valueOf());
      }, this)
    }), view_model);
  }
  return LocalizedObservable_LongDate;
})();
LocalizedObservable_ShortDate = (function() {
  __extends(LocalizedObservable_ShortDate, kb.LocalizedObservable);
  function LocalizedObservable_ShortDate(value, options, view_model) {
    if (options == null) {
      options = {};
    }
    return LocalizedObservable_ShortDate.__super__.constructor.call(this, value, _.extend(options, {
      read_write: true,
      read: __bind(function() {
        var date;
        date = this.getObservedValue();
        if (!date) {
          return '';
        }
        return Globalize.format(date, Globalize.cultures[Knockback.locale_manager.getLocale()].calendars.standard.patterns.d, Knockback.locale_manager.getLocale());
      }, this),
      write: __bind(function(localized_string) {
        var date, new_value;
        date = this.getObservedValue();
        if (!date) {
          return '';
        }
        new_value = Globalize.parseDate(localized_string, Globalize.cultures[Knockback.locale_manager.getLocale()].calendars.standard.patterns.d, Knockback.locale_manager.getLocale());
        if (!(new_value && _.isDate(new_value))) {
          return this.observable.forceRefresh();
        }
        return date.setTime(new_value.valueOf());
      }, this)
    }), view_model);
  }
  return LocalizedObservable_ShortDate;
})();