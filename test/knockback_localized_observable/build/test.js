var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
$(document).ready(function() {
  var LocalizedStringLocalizer, LongDateLocalizer;
  module("knockback_localized_observable.js");
  test("TEST DEPENDENCY MISSING", function() {
    ko.utils;
    _.VERSION;
    return Backbone.VERSION;
  });
  Knockback.locale_manager = new LocaleManager('en', {
    'en': {
      formal_hello: 'Hello',
      formal_goodbye: 'Goodbye',
      informal_hello: 'Hi',
      informal_goodbye: 'Bye'
    },
    'en-GB': {
      formal_hello: 'Good day sir',
      formal_goodbye: 'Goodbye darling',
      informal_hello: "Let's get a pint",
      informal_goodbye: 'Toodles'
    },
    'fr-FR': {
      informal_hello: 'Bonjour',
      informal_goodbye: 'Au revoir',
      formal_hello: 'Bonjour',
      formal_goodbye: 'Au revoir'
    }
  });
  LocalizedStringLocalizer = (function() {
    __extends(LocalizedStringLocalizer, kb.LocalizedObservable);
    function LocalizedStringLocalizer(value, options, view_model) {
      LocalizedStringLocalizer.__super__.constructor.apply(this, arguments);
      return kb.observable(this);
    }
    LocalizedStringLocalizer.prototype.read = function(value) {
      if (value.string_id) {
        return Knockback.locale_manager.get(value.string_id);
      } else {
        return '';
      }
    };
    return LocalizedStringLocalizer;
  })();
  test("Localized greeting", function() {
    var ContactViewModelGreeting, model, view_model;
    ContactViewModelGreeting = (function() {
      function ContactViewModelGreeting(model) {
        this.hello = new kb.ModelAttributeObservable(model, {
          keypath: 'hello_greeting',
          localizer: __bind(function(value) {
            return new LocalizedStringLocalizer(value);
          }, this)
        });
        this.goodbye = new kb.ModelAttributeObservable(model, {
          keypath: 'goodbye_greeting',
          localizer: __bind(function(value) {
            return new LocalizedStringLocalizer(value);
          }, this)
        });
      }
      ContactViewModelGreeting.prototype.destroy = function() {
        this.hello.destroy();
        return this.goodbye.destroy();
      };
      return ContactViewModelGreeting;
    })();
    model = new Contact({
      hello_greeting: new LocalizedString('formal_hello'),
      goodbye_greeting: new LocalizedString('formal_goodbye')
    });
    view_model = new ContactViewModelGreeting(model);
    Knockback.locale_manager.setLocale('en');
    equal(view_model.hello(), 'Hello', "en: Hello");
    equal(view_model.goodbye(), 'Goodbye', "en: Goobye");
    Knockback.locale_manager.setLocale('en-GB');
    equal(view_model.hello(), 'Good day sir', "en-GB: Hello");
    equal(view_model.goodbye(), 'Goodbye darling', "en-GB: Goobye");
    Knockback.locale_manager.setLocale('fr-FR');
    equal(view_model.hello(), 'Bonjour', "fr-FR: Hello");
    equal(view_model.goodbye(), 'Au revoir', "fr-FR: Goobye");
    model.set({
      hello_greeting: new LocalizedString('informal_hello'),
      goodbye_greeting: new LocalizedString('informal_goodbye')
    });
    Knockback.locale_manager.setLocale('en');
    equal(view_model.hello(), 'Hi', "en: Hello");
    equal(view_model.goodbye(), 'Bye', "en: Goobye");
    Knockback.locale_manager.setLocale('en-GB');
    equal(view_model.hello(), "Let's get a pint", "en-GB: Hello");
    equal(view_model.goodbye(), 'Toodles', "en-GB: Goobye");
    Knockback.locale_manager.setLocale('fr-FR');
    equal(view_model.hello(), 'Bonjour', "fr-FR: Hello");
    return equal(view_model.goodbye(), 'Au revoir', "fr-FR: Goobye");
  });
  LongDateLocalizer = (function() {
    __extends(LongDateLocalizer, kb.LocalizedObservable);
    function LongDateLocalizer(value, options, view_model) {
      LongDateLocalizer.__super__.constructor.apply(this, arguments);
      return kb.observable(this);
    }
    LongDateLocalizer.prototype.read = function(value) {
      return Globalize.format(value, 'dd MMMM yyyy', Knockback.locale_manager.getLocale());
    };
    LongDateLocalizer.prototype.write = function(localized_string, value, observable) {
      var new_value;
      new_value = Globalize.parseDate(localized_string, 'dd MMMM yyyy', Knockback.locale_manager.getLocale());
      if (!(new_value && _.isDate(new_value))) {
        return observable.forceRefresh();
      }
      return value.setTime(new_value.valueOf());
    };
    return LongDateLocalizer;
  })();
  test("Date and time with jquery.globalize", function() {
    var ContactViewModelDate, birthdate, current_date, model, view_model;
    ContactViewModelDate = (function() {
      function ContactViewModelDate(model) {
        this.date = new kb.ModelAttributeObservable(model, {
          keypath: 'date',
          write: true,
          localizer: __bind(function(value) {
            return new LongDateLocalizer(value);
          }, this)
        }, this);
      }
      ContactViewModelDate.prototype.destroy = function() {
        return this.date.destroy();
      };
      return ContactViewModelDate;
    })();
    birthdate = new Date(1940, 10, 9);
    model = new Contact({
      name: 'John',
      date: new Date(birthdate.valueOf())
    });
    view_model = new ContactViewModelDate(model);
    Knockback.locale_manager.setLocale('en-GB');
    equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    view_model.date('10 December 1963');
    current_date = model.get('date');
    equal(current_date.getFullYear(), 1963, "year is good");
    equal(current_date.getMonth(), 11, "month is good");
    equal(current_date.getDate(), 10, "day is good");
    model.set({
      date: new Date(birthdate.valueOf())
    });
    Knockback.locale_manager.setLocale('fr-FR');
    equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    equal(current_date.getFullYear(), 1940, "year is good");
    equal(current_date.getMonth(), 10, "month is good");
    return equal(current_date.getDate(), 10, "day is good");
  });
  return test("Error cases", function() {});
});