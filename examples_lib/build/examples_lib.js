var Contact, ContactsCollection, SortedContactsCollection;
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
SortedContactsCollection = (function() {
  __extends(SortedContactsCollection, Backbone.Collection);
  function SortedContactsCollection() {
    SortedContactsCollection.__super__.constructor.apply(this, arguments);
  }
  SortedContactsCollection.prototype.model = Contact;
  SortedContactsCollection.prototype.comparator = function(model) {
    return model.get('name');
  };
  return SortedContactsCollection;
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
  function LocaleManager(locale_identifier, id_to_string_map_by_culture) {
    this.id_to_string_map_by_culture = id_to_string_map_by_culture;
    this.setLocale(locale_identifier);
  }
  LocaleManager.prototype.get = function(string_id) {
    var culture_map;
    culture_map = this.id_to_string_map_by_culture[this.locale_identifier];
    if (!culture_map) {
      return '';
    }
    if (culture_map.hasOwnProperty(string_id)) {
      return culture_map[string_id];
    } else {
      return '';
    }
  };
  LocaleManager.prototype.getLocale = function() {
    return this.locale_identifier;
  };
  LocaleManager.prototype.setLocale = function(locale_identifier) {
    var culture_map, key, value, _results;
    this.locale_identifier = locale_identifier;
    Globalize.culture = Globalize.findClosestCulture(locale_identifier);
    this.trigger('change', this);
    culture_map = this.id_to_string_map_by_culture[this.locale_identifier];
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
  return LocaleManager;
})();
__extends(LocaleManager.prototype, Backbone.Events);
var LocalizedString;
LocalizedString = (function() {
  function LocalizedString(string_id) {
    this.string_id = string_id;
    if (!Knockback.locale_manager) {
      throw new Error("missing Knockback.locale_manager");
    }
    this.string = Knockback.locale_manager.get(this.string_id);
  }
  return LocalizedString;
})();
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