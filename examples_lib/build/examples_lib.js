var Contact, ContactsCollection, NameSortedContactsCollection;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Contact = (function() {
  __extends(Contact, Backbone.Model);
  function Contact() {
    Contact.__super__.constructor.apply(this, arguments);
  }
  Contact.prototype.defaults = {
    name: '',
    number: 0,
    date: new Date()
  };
  return Contact;
})();
ContactsCollection = (function() {
  __extends(ContactsCollection, Backbone.Collection);
  function ContactsCollection() {
    ContactsCollection.__super__.constructor.apply(this, arguments);
  }
  ContactsCollection.prototype.model = Contact;
  return ContactsCollection;
})();
NameSortedContactsCollection = (function() {
  __extends(NameSortedContactsCollection, Backbone.Collection);
  function NameSortedContactsCollection() {
    NameSortedContactsCollection.__super__.constructor.apply(this, arguments);
  }
  NameSortedContactsCollection.prototype.model = Contact;
  NameSortedContactsCollection.prototype.comparator = function(model) {
    return model.get('name');
  };
  return NameSortedContactsCollection;
})();
var LocaleManager;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
LocaleManager = (function() {
  function LocaleManager(locale_identifier, translations_by_locale) {
    this.translations_by_locale = translations_by_locale;
    if (locale_identifier) {
      this.setLocale(locale_identifier);
    }
  }
  LocaleManager.prototype.get = function(string_id, parameters) {
    var arg, culture_map, index, string, _len, _ref;
    if (this.locale_identifier) {
      culture_map = this.translations_by_locale[this.locale_identifier];
    }
    if (!culture_map) {
      return '';
    }
    string = culture_map.hasOwnProperty(string_id) ? culture_map[string_id] : '';
    if (arguments === 1) {
      return string;
    }
    _ref = Array.prototype.slice.call(arguments, 1);
    for (index = 0, _len = _ref.length; index < _len; index++) {
      arg = _ref[index];
      string = string.replace("{" + index + "}", arg);
    }
    return string;
  };
  LocaleManager.prototype.getLocale = function() {
    return this.locale_identifier;
  };
  LocaleManager.prototype.setLocale = function(locale_identifier) {
    var culture_map, key, value, _results;
    this.locale_identifier = locale_identifier;
    Globalize.culture = Globalize.findClosestCulture(locale_identifier);
    this.trigger('change', this);
    culture_map = this.translations_by_locale[this.locale_identifier];
    if (!culture_map) {
      return;
    }
    _results = [];
    for (key in culture_map) {
      value = culture_map[key];
      _results.push(this.trigger("change:" + key, value));
    }
    return _results;
  };
  LocaleManager.prototype.getLocales = function() {
    var locales, string_id, value, _ref;
    locales = [];
    _ref = this.translations_by_locale;
    for (string_id in _ref) {
      value = _ref[string_id];
      locales.push(string_id);
    }
    return locales;
  };
  return LocaleManager;
})();
__extends(LocaleManager.prototype, Backbone.Events);
var LocalizedString;
LocalizedString = (function() {
  function LocalizedString(string_id) {
    this.string_id = string_id;
    if (!kb.locale_manager) {
      throw new Error("missing Knockback.locale_manager");
    }
    this.string = kb.locale_manager.get(this.string_id);
  }
  return LocalizedString;
})();
var LocalizedStringLocalizer, LongDateLocalizer, ShortDateLocalizer;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
ShortDateLocalizer = (function() {
  __extends(ShortDateLocalizer, kb.LocalizedObservable);
  function ShortDateLocalizer(value, options, view_model) {
    if (options == null) {
      options = {};
    }
    ShortDateLocalizer.__super__.constructor.call(this, value, _.extend(options, {
      read: function(value) {
        return Globalize.format(value, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());
      },
      write: __bind(function(localized_string, value) {
        var new_value, observable;
        observable = kb.utils.wrappedObservable(this);
        new_value = Globalize.parseDate(localized_string, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());
        if (!(new_value && _.isDate(new_value))) {
          return observable.resetToCurrent();
        }
        return value.setTime(new_value.valueOf());
      }, this)
    }), view_model);
    return kb.utils.wrappedObservable(this);
  }
  return ShortDateLocalizer;
})();