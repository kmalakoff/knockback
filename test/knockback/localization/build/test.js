var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

describe('knockback-localized-observable.js', function() {
  var LocalizedStringLocalizer, LongDateLocalizer, kb, ko, locale_manager, _;
  ko = window.ko || (typeof require === "function" ? require('knockout') : void 0);
  kb = window.kb || (typeof require === "function" ? require('knockback') : void 0);
  _ = kb._;
  if (typeof require === "function") {
    require('knockback-examples-localization');
  }
  it('TEST DEPENDENCY MISSING', function(done) {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!kb.Model, 'kb.Model');
    assert.ok(!!kb.Collection, 'kb.Collection');
    assert.ok(!!kb, 'kb');
    return done();
  });
  locale_manager = new kb.LocaleManager('en', {
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
  kb.Contact = kb.Parse ? kb.Model.extend('Contact', {
    defaults: {
      name: '',
      number: 0,
      date: new Date()
    }
  }) : kb.Model.extend({
    defaults: {
      name: '',
      number: 0,
      date: new Date()
    }
  });
  kb.ContactsCollection = kb.Collection.extend({
    model: kb.Contact
  });
  LocalizedStringLocalizer = (function(_super) {
    __extends(LocalizedStringLocalizer, _super);

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

  })(kb.LocalizedObservable);
  it('Localized greeting', function(done) {
    var ContactViewModelGreeting, model, view_model;
    kb.statistics = new kb.Statistics();
    kb.locale_manager = locale_manager;
    ContactViewModelGreeting = function(model) {
      this.hello = kb.observable(model, {
        key: 'hello_greeting',
        localizer: kb.LocalizedStringLocalizer
      });
      this.goodbye = kb.observable(model, {
        key: 'goodbye_greeting',
        localizer: kb.LocalizedStringLocalizer
      });
      return this;
    };
    model = new kb.Contact({
      hello_greeting: new kb.LocalizedString('formal_hello'),
      goodbye_greeting: new kb.LocalizedString('formal_goodbye')
    });
    view_model = new ContactViewModelGreeting(model);
    kb.locale_manager.setLocale('en');
    assert.equal(view_model.hello(), 'Hello', "en: Hello");
    assert.equal(view_model.goodbye(), 'Goodbye', "en: Goobye");
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.hello(), 'Good day sir', "en-GB: Hello");
    assert.equal(view_model.goodbye(), 'Goodbye darling', "en-GB: Goobye");
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.hello(), 'Bonjour', "fr-FR: Hello");
    assert.equal(view_model.goodbye(), 'Au revoir', "fr-FR: Goobye");
    model.set({
      hello_greeting: new kb.LocalizedString('informal_hello'),
      goodbye_greeting: new kb.LocalizedString('informal_goodbye')
    });
    kb.locale_manager.setLocale('en');
    assert.equal(view_model.hello(), 'Hi', "en: Hello");
    assert.equal(view_model.goodbye(), 'Bye', "en: Goobye");
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.hello(), "Let's get a pint", "en-GB: Hello");
    assert.equal(view_model.goodbye(), 'Toodles', "en-GB: Goobye");
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.hello(), 'Bonjour', "fr-FR: Hello");
    assert.equal(view_model.goodbye(), 'Au revoir', "fr-FR: Goobye");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  LongDateLocalizer = (function(_super) {
    __extends(LongDateLocalizer, _super);

    function LongDateLocalizer(value, options, view_model) {
      LongDateLocalizer.__super__.constructor.apply(this, arguments);
      return kb.utils.wrappedObservable(this);
    }

    LongDateLocalizer.prototype.read = function(value) {
      return Globalize.format(value, 'dd MMMM yyyy', kb.locale_manager.getLocale());
    };

    LongDateLocalizer.prototype.write = function(localized_string, value, observable) {
      var new_value;
      new_value = Globalize.parseDate(localized_string, 'dd MMMM yyyy', kb.locale_manager.getLocale());
      if (!(new_value && _.isDate(new_value))) {
        return observable.setToDefault();
      }
      return value.setTime(new_value.valueOf());
    };

    return LongDateLocalizer;

  })(kb.LocalizedObservable);
  it('Date and time with jquery.globalize', function(done) {
    var ContactViewModelDate, birthdate, current_date, model, view_model;
    kb.statistics = new kb.Statistics();
    ContactViewModelDate = function(model) {
      this.date = kb.observable(model, {
        key: 'date',
        localizer: kb.LongDateLocalizer
      }, this);
      return this;
    };
    birthdate = new Date(1940, 10, 9);
    model = new kb.Contact({
      name: 'John',
      date: new Date(birthdate.valueOf())
    });
    view_model = new ContactViewModelDate(model);
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    view_model.date('10 December 1963');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1963, "year is good");
    assert.equal(current_date.getMonth(), 11, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    model.set({
      date: new Date(birthdate.valueOf())
    });
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, "year is good");
    assert.equal(current_date.getMonth(), 10, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('Localization with a changing key', function(done) {
    var ContactViewModelGreeting, greeting_key, locale_manager_greeting, model, view_model;
    kb.statistics = new kb.Statistics();
    greeting_key = ko.observable('formal_hello');
    locale_manager_greeting = kb.observable(kb.locale_manager, {
      key: greeting_key
    });
    kb.locale_manager.setLocale('en');
    assert.equal(locale_manager_greeting(), 'Hello', "en: Hello");
    kb.locale_manager.setLocale('en-GB');
    assert.equal(locale_manager_greeting(), 'Good day sir', "en-GB: Hello");
    greeting_key('formal_goodbye');
    assert.equal(locale_manager_greeting(), 'Goodbye darling', "en-GB: Goodbye");
    kb.locale_manager.setLocale('en');
    assert.equal(locale_manager_greeting(), 'Goodbye', "en: Goodbye");
    ContactViewModelGreeting = function(model) {
      this.greeting_key = ko.observable('hello_greeting');
      this.greeting = kb.observable(model, {
        key: this.greeting_key,
        localizer: kb.LocalizedStringLocalizer
      });
    };
    model = new kb.Contact({
      hello_greeting: new kb.LocalizedString('formal_hello'),
      goodbye_greeting: new kb.LocalizedString('formal_goodbye')
    });
    view_model = new ContactViewModelGreeting(model);
    assert.equal(view_model.greeting(), 'Hello', "en: Hello");
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.greeting(), 'Good day sir', "en-GB: Hello");
    view_model.greeting_key('goodbye_greeting');
    assert.equal(view_model.greeting(), 'Goodbye darling', "en-GB: Goodbye");
    kb.locale_manager.setLocale('en');
    assert.equal(view_model.greeting(), 'Goodbye', "en: Goodbye");
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('2. internals test (Coffeescript inheritance)', function(done) {
    var ContactViewModel, birthdate, current_date, model, view_model;
    kb.statistics = new kb.Statistics();
    kb.locale_manager = locale_manager;
    ContactViewModel = (function(_super) {
      __extends(ContactViewModel, _super);

      function ContactViewModel(model) {
        ContactViewModel.__super__.constructor.call(this, model, {
          internals: ['email', 'date']
        });
        this.email = (function(_this) {
          return function(value) {
            if (arguments.length) {
              return _this._email(value);
            } else {
              if (!_this._email()) {
                return 'your.name@yourplace.com';
              } else {
                return _this._email();
              }
            }
          };
        })(this);
        this.date = new kb.LongDateLocalizer(this._date);
      }

      return ContactViewModel;

    })(kb.ViewModel);
    birthdate = new Date(1940, 10, 9);
    model = new kb.Contact({
      name: 'John',
      date: new Date(birthdate.valueOf())
    });
    view_model = new ContactViewModel(model);
    assert.equal(view_model._email(), void 0, "no email");
    assert.equal(view_model.email(), 'your.name@yourplace.com', "default message");
    view_model._email('j@imagine.com');
    assert.equal(view_model.email(), 'j@imagine.com', "received email");
    view_model.email('john@imagine.com');
    assert.equal(view_model.email(), 'john@imagine.com', "received email");
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    view_model.date('10 December 1963');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1963, "year is good");
    assert.equal(current_date.getMonth(), 11, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    assert.equal(view_model._date().getFullYear(), 1963, "year is good");
    assert.equal(view_model._date().getMonth(), 11, "month is good");
    assert.equal(view_model._date().getDate(), 10, "day is good");
    model.set({
      date: new Date(birthdate.valueOf())
    });
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, "year is good");
    assert.equal(current_date.getMonth(), 10, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    assert.equal(view_model._date().getFullYear(), 1940, "year is good");
    assert.equal(view_model._date().getMonth(), 10, "month is good");
    assert.equal(view_model._date().getDate(), 10, "day is good");
    view_model.date(new Date(birthdate.valueOf()));
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '10 novembre 1940', "One past John's birthdate in France format");
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, "year is good");
    assert.equal(current_date.getMonth(), 10, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    assert.equal(view_model._date().getFullYear(), 1940, "year is good");
    assert.equal(view_model._date().getMonth(), 10, "month is good");
    assert.equal(view_model._date().getDate(), 10, "day is good");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('3. internals test (Javascript inheritance)', function(done) {
    var ContactViewModel, birthdate, current_date, model, view_model;
    kb.statistics = new kb.Statistics();
    kb.locale_manager = locale_manager;
    ContactViewModel = kb.ViewModel.extend({
      constructor: function(model) {
        kb.ViewModel.prototype.constructor.call(this, model, {
          internals: ['email', 'date']
        });
        this.email = (function(_this) {
          return function(value) {
            if (arguments.length) {
              return _this._email(value);
            } else {
              if (!_this._email()) {
                return 'your.name@yourplace.com';
              } else {
                return _this._email();
              }
            }
          };
        })(this);
        this.date = new kb.LongDateLocalizer(this._date);
      }
    });
    birthdate = new Date(1940, 10, 9);
    model = new kb.Contact({
      name: 'John',
      date: new Date(birthdate.valueOf())
    });
    view_model = new ContactViewModel(model);
    assert.equal(view_model._email(), void 0, "no email");
    assert.equal(view_model.email(), 'your.name@yourplace.com', "default message");
    view_model._email('j@imagine.com');
    assert.equal(view_model._email(), 'j@imagine.com', "received email");
    assert.equal(view_model.email(), 'j@imagine.com', "received email");
    view_model.email('john@imagine.com');
    assert.equal(view_model._email(), 'john@imagine.com', "received email");
    assert.equal(view_model.email(), 'john@imagine.com', "received email");
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    view_model.date('10 December 1963');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1963, "year is good");
    assert.equal(current_date.getMonth(), 11, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    assert.equal(view_model._date().getFullYear(), 1963, "year is good");
    assert.equal(view_model._date().getMonth(), 11, "month is good");
    assert.equal(view_model._date().getDate(), 10, "day is good");
    model.set({
      date: new Date(birthdate.valueOf())
    });
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, "year is good");
    assert.equal(current_date.getMonth(), 10, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    assert.equal(view_model._date().getFullYear(), 1940, "year is good");
    assert.equal(view_model._date().getMonth(), 10, "month is good");
    assert.equal(view_model._date().getDate(), 10, "day is good");
    view_model.date(new Date(birthdate.valueOf()));
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '10 novembre 1940', "One past John's birthdate in France format");
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, "year is good");
    assert.equal(current_date.getMonth(), 10, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    assert.equal(view_model._date().getFullYear(), 1940, "year is good");
    assert.equal(view_model._date().getMonth(), 10, "month is good");
    assert.equal(view_model._date().getDate(), 10, "day is good");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('7. Using kb.localizedObservable', function(done) {
    var ContactViewModelDate, birthdate, current_date, model, view_model;
    kb.statistics = new kb.Statistics();
    kb.locale_manager = locale_manager;
    ContactViewModelDate = (function(_super) {
      __extends(ContactViewModelDate, _super);

      function ContactViewModelDate(model) {
        ContactViewModelDate.__super__.constructor.call(this, model, {
          internals: ['date']
        });
        this.date = new kb.LongDateLocalizer(this._date);
      }

      return ContactViewModelDate;

    })(kb.ViewModel);
    birthdate = new Date(1940, 10, 9);
    model = new kb.Contact({
      name: 'John',
      date: new Date(birthdate.valueOf())
    });
    view_model = new ContactViewModelDate(model);
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    view_model.date('10 December 1963');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1963, "year is good");
    assert.equal(current_date.getMonth(), 11, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    assert.equal(view_model._date().getFullYear(), 1963, "year is good");
    assert.equal(view_model._date().getMonth(), 11, "month is good");
    assert.equal(view_model._date().getDate(), 10, "day is good");
    model.set({
      date: new Date(birthdate.valueOf())
    });
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, "year is good");
    assert.equal(current_date.getMonth(), 10, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    assert.equal(view_model._date().getFullYear(), 1940, "year is good");
    assert.equal(view_model._date().getMonth(), 10, "month is good");
    assert.equal(view_model._date().getDate(), 10, "day is good");
    view_model.date(new Date(birthdate.valueOf()));
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '10 novembre 1940', "John's birthdate in France format");
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, "year is good");
    assert.equal(current_date.getMonth(), 10, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    assert.equal(view_model._date().getFullYear(), 1940, "year is good");
    assert.equal(view_model._date().getMonth(), 10, "month is good");
    assert.equal(view_model._date().getDate(), 10, "day is good");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('7. Using kb.localizedObservable', function(done) {
    var ContactViewModelDate, birthdate, current_date, model, view_model;
    kb.statistics = new kb.Statistics();
    kb.locale_manager = locale_manager;
    ContactViewModelDate = (function(_super) {
      __extends(ContactViewModelDate, _super);

      function ContactViewModelDate(model) {
        ContactViewModelDate.__super__.constructor.call(this, model, {
          internals: ['date']
        });
        this.date = new kb.LongDateLocalizer(this._date);
      }

      return ContactViewModelDate;

    })(kb.ViewModel);
    birthdate = new Date(1940, 10, 9);
    model = new kb.Contact({
      name: 'John',
      date: new Date(birthdate.valueOf())
    });
    view_model = new ContactViewModelDate(model);
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    view_model.date('10 December 1963');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1963, "year is good");
    assert.equal(current_date.getMonth(), 11, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    assert.equal(view_model._date().getFullYear(), 1963, "year is good");
    assert.equal(view_model._date().getMonth(), 11, "month is good");
    assert.equal(view_model._date().getDate(), 10, "day is good");
    model.set({
      date: new Date(birthdate.valueOf())
    });
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, "year is good");
    assert.equal(current_date.getMonth(), 10, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    assert.equal(view_model._date().getFullYear(), 1940, "year is good");
    assert.equal(view_model._date().getMonth(), 10, "month is good");
    assert.equal(view_model._date().getDate(), 10, "day is good");
    view_model.date(new Date(birthdate.valueOf()));
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '10 novembre 1940', "John's birthdate in France format");
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, "year is good");
    assert.equal(current_date.getMonth(), 10, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    assert.equal(view_model._date().getFullYear(), 1940, "year is good");
    assert.equal(view_model._date().getMonth(), 10, "month is good");
    assert.equal(view_model._date().getDate(), 10, "day is good");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('10. Nested custom view models', function(done) {
    var ContactViewModelDate, george, george_birthdate, john, john_birthdate, major_duo, minor_duo, nested_model, nested_view_model, paul, paul_birthdate, ringo, ringo_birthdate, validateContactViewModel, validateGenericViewModel, validateModel;
    kb.statistics = new kb.Statistics();
    kb.locale_manager = locale_manager;
    ContactViewModelDate = (function(_super) {
      __extends(ContactViewModelDate, _super);

      function ContactViewModelDate(model, options) {
        ContactViewModelDate.__super__.constructor.call(this, model, _.extend({
          internals: ['date']
        }, options));
        this.date = new kb.LongDateLocalizer(this._date);
      }

      return ContactViewModelDate;

    })(kb.ViewModel);
    john_birthdate = new Date(1940, 10, 9);
    john = new kb.Contact({
      name: 'John',
      date: new Date(john_birthdate.valueOf())
    });
    paul_birthdate = new Date(1942, 6, 18);
    paul = new kb.Contact({
      name: 'Paul',
      date: new Date(paul_birthdate.valueOf())
    });
    george_birthdate = new Date(1943, 2, 25);
    george = new kb.Contact({
      name: 'George',
      date: new Date(george_birthdate.valueOf())
    });
    ringo_birthdate = new Date(1940, 7, 7);
    ringo = new kb.Contact({
      name: 'Ringo',
      date: new Date(ringo_birthdate.valueOf())
    });
    major_duo = new kb.Collection([john, paul]);
    minor_duo = new kb.Collection([george, ringo]);
    nested_model = new kb.Model({
      john: john,
      paul: paul,
      george: george,
      ringo: ringo,
      major_duo1: major_duo,
      major_duo2: major_duo,
      major_duo3: major_duo,
      minor_duo1: minor_duo,
      minor_duo2: minor_duo,
      minor_duo3: minor_duo
    });
    nested_view_model = kb.viewModel(nested_model, {
      factories: {
        john: ContactViewModelDate,
        george: {
          create: function(model, options) {
            return new ContactViewModelDate(model, options);
          }
        },
        'major_duo1.models': ContactViewModelDate,
        'major_duo2.models': {
          create: function(model, options) {
            return new ContactViewModelDate(model, options);
          }
        },
        'major_duo3.models': {
          models_only: true
        },
        'minor_duo1.models': kb.ViewModel,
        'minor_duo2.models': {
          create: function(model, options) {
            return new kb.ViewModel(model, options);
          }
        }
      }
    });
    validateContactViewModel = function(view_model, name, birthdate) {
      var current_date, formatted_date, model;
      model = kb.utils.wrappedModel(view_model);
      assert.equal(view_model.name(), name, "" + name + ": Name matches");
      kb.locale_manager.setLocale('en-GB');
      formatted_date = new kb.LongDateLocalizer(birthdate);
      assert.equal(view_model.date(), formatted_date(), "" + name + ": Birthdate in Great Britain format");
      view_model.date('10 December 1963');
      current_date = model.get('date');
      assert.equal(current_date.getFullYear(), 1963, "" + name + ": year is good");
      assert.equal(current_date.getMonth(), 11, "" + name + ": month is good");
      assert.equal(current_date.getDate(), 10, "" + name + ": day is good");
      assert.equal(view_model._date().getFullYear(), 1963, "" + name + ": year is good");
      assert.equal(view_model._date().getMonth(), 11, "" + name + ": month is good");
      assert.equal(view_model._date().getDate(), 10, "" + name + ": day is good");
      model.set({
        date: new Date(birthdate.valueOf())
      });
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.date(), formatted_date(), "" + name + ": Birthdate in France format");
      view_model.date('10 novembre 1940');
      current_date = model.get('date');
      assert.equal(current_date.getFullYear(), 1940, "" + name + ": year is good");
      assert.equal(current_date.getMonth(), 10, "" + name + ": month is good");
      assert.equal(current_date.getDate(), 10, "" + name + ": day is good");
      assert.equal(view_model._date().getFullYear(), 1940, "" + name + ": year is good");
      assert.equal(view_model._date().getMonth(), 10, "" + name + ": month is good");
      assert.equal(view_model._date().getDate(), 10, "" + name + ": day is good");
      return model.set({
        date: new Date(birthdate.valueOf())
      });
    };
    validateGenericViewModel = function(view_model, name, birthdate) {
      assert.equal(view_model.name(), name, "" + name + ": Name matches");
      return assert.equal(view_model.date().valueOf(), birthdate.valueOf(), "" + name + ": Birthdate matches");
    };
    validateModel = function(model, name, birthdate) {
      assert.equal(model.get('name'), name, "" + name + ": Name matches");
      return assert.equal(model.get('date').valueOf(), birthdate.valueOf(), "" + name + ": Birthdate matches");
    };
    validateContactViewModel(nested_view_model.john(), 'John', john_birthdate);
    validateGenericViewModel(nested_view_model.paul(), 'Paul', paul_birthdate);
    validateContactViewModel(nested_view_model.george(), 'George', george_birthdate);
    validateGenericViewModel(nested_view_model.ringo(), 'Ringo', ringo_birthdate);
    validateContactViewModel(nested_view_model.major_duo1()[0], 'John', john_birthdate);
    validateContactViewModel(nested_view_model.major_duo1()[1], 'Paul', paul_birthdate);
    validateContactViewModel(nested_view_model.major_duo2()[0], 'John', john_birthdate);
    validateContactViewModel(nested_view_model.major_duo2()[1], 'Paul', paul_birthdate);
    validateModel(nested_view_model.major_duo3()[0], 'John', john_birthdate);
    validateModel(nested_view_model.major_duo3()[1], 'Paul', paul_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo1()[0], 'George', george_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo1()[1], 'Ringo', ringo_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo2()[0], 'George', george_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo2()[1], 'Ringo', ringo_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo3()[0], 'George', george_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo3()[1], 'Ringo', ringo_birthdate);
    kb.release(nested_view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('12. Prior kb.Observables functionality', function(done) {
    var ContactViewModel, current_date, model, view_model;
    kb.statistics = new kb.Statistics();
    kb.locale_manager = locale_manager;
    ContactViewModel = function(model) {
      this.dynamic_observables = kb.viewModel(model, {
        keys: {
          name: {
            key: 'name'
          },
          number: 'number',
          date: {
            key: 'date',
            localizer: kb.LongDateLocalizer
          },
          name2: {
            key: 'name'
          }
        }
      }, this);
    };
    model = new kb.Contact({
      name: 'John',
      number: '555-555-5558',
      date: new Date(1940, 10, 9)
    });
    view_model = new ContactViewModel(model);
    assert.equal(view_model.name(), 'John', "It is a name");
    assert.equal(view_model.name2(), 'John', "It is a name");
    assert.equal(view_model.number(), '555-555-5558', "Not so interesting number");
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    assert.equal(model.get('name'), 'John', "Name not changed");
    assert.equal(view_model.name(), 'John', "Name not changed");
    assert.equal(view_model.name2(), 'John', "Name not changed");
    view_model.number('9222-222-222');
    assert.equal(model.get('number'), '9222-222-222', "Number was changed");
    assert.equal(view_model.number(), '9222-222-222', "Number was changed");
    kb.locale_manager.setLocale('en-GB');
    view_model.date('10 December 1963');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1963, "year is good");
    assert.equal(current_date.getMonth(), 11, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    assert.equal(model.get('name'), 'John', "Name not changed");
    assert.equal(view_model.name(), 'John', "Name not changed");
    assert.equal(view_model.name2(), 'John', "Name not changed");
    model.set({
      name: 'Yoko',
      number: '818-818-8181'
    });
    assert.equal(view_model.name(), 'Yoko', "Name changed");
    assert.equal(view_model.number(), '818-818-8181', "Number was changed");
    model.set({
      date: new Date(1940, 10, 9)
    });
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, "year is good");
    assert.equal(current_date.getMonth(), 10, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  return it('13. Bulk mode (array of keys)', function(done) {
    var model, view_model;
    kb.statistics = new kb.Statistics();
    kb.locale_manager = locale_manager;
    model = new kb.Contact({
      name: 'John',
      number: '555-555-5558'
    });
    view_model = kb.viewModel(model, ['name', 'number']);
    assert.equal(view_model.name(), 'John', "It is a name");
    assert.equal(view_model.number(), '555-555-5558', "Not so interesting number");
    kb.locale_manager.setLocale('en-GB');
    kb.locale_manager.setLocale('fr-FR');
    view_model.name('Paul');
    assert.equal(model.get('name'), 'Paul', "Name changed");
    assert.equal(view_model.name(), 'Paul', "Name changed");
    view_model.number('9222-222-222');
    assert.equal(model.get('number'), '9222-222-222', "Number was changed");
    assert.equal(view_model.number(), '9222-222-222', "Number was changed");
    kb.locale_manager.setLocale('en-GB');
    model.set({
      name: 'Yoko',
      number: '818-818-8181'
    });
    assert.equal(view_model.name(), 'Yoko', "Name changed");
    assert.equal(view_model.number(), '818-818-8181', "Number was changed");
    kb.locale_manager.setLocale('fr-FR');
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
});
