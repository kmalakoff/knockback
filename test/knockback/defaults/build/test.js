var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

describe('knockback-defaults.js', function() {
  var Backbone, kb, ko, locale_manager, _;
  ko = window.ko || (typeof require === "function" ? require('knockout') : void 0);
  kb = window.kb || (typeof require === "function" ? require('knockback') : void 0);
  _ = kb._;
  Backbone = kb.Backbone;
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
  locale_manager = new kb.LocaleManager('en', {
    'en': {
      loading: "Loading dude"
    },
    'en-GB': {
      loading: "Loading sir"
    },
    'fr-FR': {
      loading: "Chargement"
    }
  });
  if (kb.Backbone) {
    it('1. Standard use case: just enough to get the picture', function(done) {
      var ContactViewModel, collection, current_date, model, model_ref, view_model;
      kb.statistics = new kb.Statistics();
      kb.locale_manager = locale_manager;
      ContactViewModel = function(model) {
        this.loading_message = new kb.LocalizedStringLocalizer(new kb.LocalizedString('loading'));
        this._auto = kb.viewModel(model, {
          keys: {
            name: {
              key: 'name',
              "default": this.loading_message
            },
            number: {
              key: 'number',
              "default": this.loading_message
            },
            date: {
              key: 'date',
              "default": this.loading_message,
              localizer: kb.ShortDateLocalizer
            }
          }
        }, this);
        return this;
      };
      collection = new kb.ContactsCollection();
      model_ref = new Backbone.ModelRef(collection, 'b4');
      view_model = new ContactViewModel(model_ref);
      kb.locale_manager.setLocale('en');
      assert.equal(view_model.name(), 'Loading dude', "Is that what we want to convey?");
      kb.locale_manager.setLocale('en-GB');
      assert.equal(view_model.name(), 'Loading sir', "Maybe too formal");
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.name(), 'Chargement', "Localize from day one. Good!");
      collection.add(collection.parse({
        id: 'b4',
        name: 'John',
        number: '555-555-5558',
        date: new Date(1940, 10, 9)
      }));
      model = collection.get('b4');
      assert.equal(view_model.name(), 'John', "It is a name");
      assert.equal(view_model.number(), '555-555-5558', "Not so interesting number");
      kb.locale_manager.setLocale('en-GB');
      assert.equal(view_model.date(), '09/11/1940', "John's birthdate in Great Britain format");
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.date(), '09/11/1940', "John's birthdate in France format");
      assert.equal(model.get('name'), 'John', "Name not changed");
      assert.equal(view_model.name(), 'John', "Name not changed");
      view_model.number('9222-222-222');
      assert.equal(model.get('number'), '9222-222-222', "Number was changed");
      assert.equal(view_model.number(), '9222-222-222', "Number was changed");
      kb.locale_manager.setLocale('en-GB');
      view_model.date('10/12/1963');
      current_date = model.get('date');
      assert.equal(current_date.getFullYear(), 1963, "year is good");
      assert.equal(current_date.getMonth(), 11, "month is good");
      assert.equal(current_date.getDate(), 10, "day is good");
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
      assert.equal(view_model.date(), '09/11/1940', "John's birthdate in France format");
      view_model.date('10/11/1940');
      current_date = model.get('date');
      assert.equal(current_date.getFullYear(), 1940, "year is good");
      assert.equal(current_date.getMonth(), 10, "month is good");
      assert.equal(current_date.getDate(), 10, "day is good");
      collection.reset();
      assert.equal(view_model.name(), 'Chargement', "Resets to default");
      view_model._auto.setToDefault();
      kb.locale_manager.setLocale('en');
      assert.equal(view_model.name(), 'Loading dude', "Is that what we want to convey?");
      kb.locale_manager.setLocale('en-GB');
      assert.equal(view_model.name(), 'Loading sir', "Maybe too formal");
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.name(), 'Chargement', "Localize from day one. Good!");
      kb.release(view_model);
      assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
      kb.statistics = null;
      return done();
    });
    it('2. Standard use case with kb.ViewModels', function(done) {
      var ContactViewModel, collection, current_date, model, model_ref, view_model;
      kb.statistics = new kb.Statistics();
      kb.locale_manager = locale_manager;
      ContactViewModel = (function(_super) {
        __extends(ContactViewModel, _super);

        function ContactViewModel(model) {
          ContactViewModel.__super__.constructor.call(this, model, {
            internals: ['name', 'number', 'date']
          });
          this.loading_message = new kb.LocalizedStringLocalizer(new kb.LocalizedString('loading'));
          this.name = kb.defaultObservable(this._name, this.loading_message);
          this.number = kb.defaultObservable(this._number, this.loading_message);
          this.date = kb.defaultObservable(new kb.LongDateLocalizer(this._date), this.loading_message);
        }

        return ContactViewModel;

      })(kb.ViewModel);
      collection = new kb.ContactsCollection();
      model_ref = new Backbone.ModelRef(collection, 'b4');
      view_model = new ContactViewModel(model_ref);
      kb.locale_manager.setLocale('en');
      assert.equal(view_model.name(), 'Loading dude', "Is that what we want to convey?");
      kb.locale_manager.setLocale('en-GB');
      assert.equal(view_model.name(), 'Loading sir', "Maybe too formal");
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.name(), 'Chargement', "Localize from day one. Good!");
      collection.add(collection.parse({
        id: 'b4',
        name: 'John',
        number: '555-555-5558',
        date: new Date(1940, 10, 9)
      }));
      model = collection.get('b4');
      assert.equal(view_model.name(), 'John', "It is a name");
      assert.equal(view_model.number(), '555-555-5558', "Not so interesting number");
      kb.locale_manager.setLocale('en-GB');
      assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
      view_model.number('9222-222-222');
      assert.equal(model.get('number'), '9222-222-222', "Number was changed");
      assert.equal(view_model.number(), '9222-222-222', "Number was changed");
      kb.locale_manager.setLocale('en-GB');
      view_model.date('10 December 1963');
      current_date = model.get('date');
      assert.equal(current_date.getFullYear(), 1963, "year is good");
      assert.equal(current_date.getMonth(), 11, "month is good");
      assert.equal(current_date.getDate(), 10, "day is good");
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
      collection.reset();
      assert.equal(view_model.name(), 'Chargement', "Resets to default");
      kb.utils.setToDefault(view_model);
      kb.locale_manager.setLocale('en');
      assert.equal(view_model.name(), 'Loading dude', "Is that what we want to convey?");
      kb.locale_manager.setLocale('en-GB');
      assert.equal(view_model.name(), 'Loading sir', "Maybe too formal");
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.name(), 'Chargement', "Localize from day one. Good!");
      kb.release(view_model);
      assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
      kb.statistics = null;
      return done();
    });
  }
  return it('3. internals test (Coffeescript inheritance)', function(done) {
    var ContactViewModel, birthdate, current_date, model, view_model;
    kb.statistics = new kb.Statistics();
    kb.locale_manager = locale_manager;
    ContactViewModel = (function(_super) {
      __extends(ContactViewModel, _super);

      function ContactViewModel(model) {
        ContactViewModel.__super__.constructor.call(this, model, {
          internals: ['email', 'date']
        });
        this.email = kb.defaultObservable(this._email, 'your.name@yourplace.com');
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
});
