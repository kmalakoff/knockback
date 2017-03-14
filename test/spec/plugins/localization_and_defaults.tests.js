var assert = assert || (typeof require === 'function' ? require('chai').assert : undefined);
var root = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined') ? global : this;

let kb = typeof window !== 'undefined' && window !== null ? window.kb : undefined; try { if (!kb) { kb = typeof require === 'function' ? require('knockback') : undefined; } } catch (error) {} try { if (!kb) { kb = typeof require === 'function' ? require('../../../knockback') : undefined; } } catch (error1) {}
const { _, ko } = kb;
if (kb.Backbone) { kb.Backbone.ModelRef || (typeof require === 'function' ? require('backbone-modelref') : undefined); }

let Globalize = root.Globalize;
if (!Globalize) {
  Globalize = typeof require === 'function' ? require('../../lib/globalize') : undefined;
  if (typeof require === 'function') {
    require('../../lib/globalize.culture.en-GB.js');
  } if (typeof require === 'function') {
    require('../../lib/globalize.culture.fr-FR.js');
  }
}

// ##############################
class LocaleManager {
  static initClass() {
    Object.assign(this.prototype, kb.Events);
  }

  constructor(locale_identifier, translations_by_locale) {
    this.translations_by_locale = translations_by_locale;
    if (locale_identifier) { this.setLocale(locale_identifier); }
  }

  get(string_id, parameters) {
    let culture_map;
    if (this.locale_identifier) { culture_map = this.translations_by_locale[this.locale_identifier]; }
    if (!culture_map) { return ''; }
    let string = culture_map.hasOwnProperty(string_id) ? culture_map[string_id] : '';
    if (arguments === 1) { return string; }
    const iterable = Array.prototype.slice.call(arguments, 1);
    for (let index = 0; index < iterable.length; index++) { const arg = iterable[index]; string = string.replace(`{${index}}`, arg); }
    return string;
  }

  getLocale() { return this.locale_identifier; }

  setLocale(locale_identifier) {
    this.locale_identifier = locale_identifier;
    this.trigger('change', this);
    const object = this.translations_by_locale[this.locale_identifier] || {};
    for (const key in object) { const value = object[key]; this.trigger(`change:${key}`, value); }
  }

  getLocales() {
    const locales = [];
    for (const string_id in this.translations_by_locale) { const value = this.translations_by_locale[string_id]; locales.push(string_id); }
    return locales;
  }
}
LocaleManager.initClass();

class LocalizedString {
  constructor(string_id) {
    this.string_id = string_id;
    if (!kb.locale_manager) { throw 'missing kb.locale_manager'; }
    this.string = kb.locale_manager.get(this.string_id);
  }
}

const Contact = kb.Parse ? kb.Model.extend('Contact', { defaults: { name: '', number: 0, date: new Date() } }) : kb.Model.extend({ defaults: { name: '', number: 0, date: new Date() } });
const Contacts = kb.Collection.extend({ model: Contact });

class LocalizedStringLocalizer extends kb.LocalizedObservable {
  constructor(value, options, view_model) {
    super(...arguments);
    return kb.utils.wrappedObservable(this);
  }
  read(value) {
    return (value.string_id) ? kb.locale_manager.get(value.string_id) : '';
  }
}

kb.LocalizedStringLocalizer = class LocalizedStringLocalizer extends kb.LocalizedObservable {
  read(value) {
    return (value.string_id) ? kb.locale_manager.get(value.string_id) : '';
  }
};

// NOTE: dependency on globalize
kb.LongDateLocalizer = class LongDateLocalizer extends kb.LocalizedObservable {
  constructor(value, options, view_model) {
    return super(...arguments); // return the observable instead of this
  }
  read(value) {
    return Globalize.format(value, 'dd MMMM yyyy', kb.locale_manager.getLocale());
  }
  write(localized_string, value) {
    const new_value = Globalize.parseDate(localized_string, 'dd MMMM yyyy', kb.locale_manager.getLocale());
    if (!(new_value && _.isDate(new_value))) { return kb.utils.wrappedObservable(this).resetToCurrent(); } // reset if invalid
    return value.setTime(new_value.valueOf());
  }
};

// // NOTE: dependency on globalize - notice the alternative formulation with extend
// kb.ShortDateLocalizer = kb.LocalizedObservable.extend({
// NOTE: dependency on globalize - notice the alternative formulation with extend
kb.ShortDateLocalizer = class ShortDateLocalizer extends kb.LocalizedObservable {
  constructor(value, options, view_model) {
    // kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
    // return kb.utils.wrappedObservable(this);
    return super(...arguments); // return the observable instead of this
  } // return the observable instead of this

  read(value) {
    return Globalize.format(value, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());
  }

  write(localized_string, value) {
    const new_value = Globalize.parseDate(localized_string, Globalize.cultures[kb.locale_manager.getLocale()].calendars.standard.patterns.d, kb.locale_manager.getLocale());
    if (!(new_value && _.isDate(new_value))) { return kb.utils.wrappedObservable(this).resetToCurrent(); } // reset if invalid
    return value.setTime(new_value.valueOf());
  }
};
// ##############################

describe('localized-observable @quick @localization', () => {
  it('TEST DEPENDENCY MISSING', (done) => {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!kb.Model, 'kb.Model');
    assert.ok(!!kb.Collection, 'kb.Collection');
    assert.ok(!!kb, 'kb');
    assert.ok(!!Globalize, 'Globalize');
    return done();
  });

  const locale_manager = new LocaleManager('en', {
    en: {
      formal_hello: 'Hello',
      formal_goodbye: 'Goodbye',
      informal_hello: 'Hi',
      informal_goodbye: 'Bye',
    },
    'en-GB': {
      formal_hello: 'Good day sir',
      formal_goodbye: 'Goodbye darling',
      informal_hello: "Let's get a pint",
      informal_goodbye: 'Toodles',
    },
    'fr-FR': {
      informal_hello: 'Bonjour',
      informal_goodbye: 'Au revoir',
      formal_hello: 'Bonjour',
      formal_goodbye: 'Au revoir',
    },
  });

  it('Localized greeting', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats
    kb.locale_manager = locale_manager;

    const ContactViewModelGreeting = function (model) {
      this.hello = kb.observable(model, { key: 'hello_greeting', localizer: kb.LocalizedStringLocalizer });
      this.goodbye = kb.observable(model, { key: 'goodbye_greeting', localizer: kb.LocalizedStringLocalizer });
      return this;
    };

    const model = new Contact({ hello_greeting: new LocalizedString('formal_hello'), goodbye_greeting: new LocalizedString('formal_goodbye') });
    const view_model = new ContactViewModelGreeting(model);

    kb.locale_manager.setLocale('en');
    assert.equal(view_model.hello(), 'Hello', 'en: Hello');
    assert.equal(view_model.goodbye(), 'Goodbye', 'en: Goobye');

    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.hello(), 'Good day sir', 'en-GB: Hello');
    assert.equal(view_model.goodbye(), 'Goodbye darling', 'en-GB: Goobye');

    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.hello(), 'Bonjour', 'fr-FR: Hello');
    assert.equal(view_model.goodbye(), 'Au revoir', 'fr-FR: Goobye');

    model.set({ hello_greeting: new LocalizedString('informal_hello'), goodbye_greeting: new LocalizedString('informal_goodbye') });
    kb.locale_manager.setLocale('en');
    assert.equal(view_model.hello(), 'Hi', 'en: Hello');
    assert.equal(view_model.goodbye(), 'Bye', 'en: Goobye');

    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.hello(), "Let's get a pint", 'en-GB: Hello');
    assert.equal(view_model.goodbye(), 'Toodles', 'en-GB: Goobye');

    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.hello(), 'Bonjour', 'fr-FR: Hello');
    assert.equal(view_model.goodbye(), 'Au revoir', 'fr-FR: Goobye');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  // NOTE: dependency on globalize and knockback-defaults
  class LongDateLocalizer extends kb.LocalizedObservable {
    constructor(value, options, view_model) {
      super(...arguments);
      return kb.utils.wrappedObservable(this);
    }
    read(value) {
      return Globalize.format(value, 'dd MMMM yyyy', kb.locale_manager.getLocale());
    }
    write(localized_string, value, observable) {
      const new_value = Globalize.parseDate(localized_string, 'dd MMMM yyyy', kb.locale_manager.getLocale());
      if (!(new_value && _.isDate(new_value))) { return observable.setToDefault(); } // reset if invalid
      return value.setTime(new_value.valueOf());
    }
  }

  it('Date and time with jquery.globalize', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const ContactViewModelDate = function (model) {
      this.date = kb.observable(model, { key: 'date', localizer: kb.LongDateLocalizer }, this);
      return this;
    };

    const birthdate = new Date(1940, 10, 9);
    const model = new Contact({ name: 'John', date: new Date(birthdate.valueOf()) });
    const view_model = new ContactViewModelDate(model);

    // set from the view model
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    view_model.date('10 December 1963');
    let current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1963, 'year is good');
    assert.equal(current_date.getMonth(), 11, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');

    // set from the model
    model.set({ date: new Date(birthdate.valueOf()) });
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, 'year is good');
    assert.equal(current_date.getMonth(), 10, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  it('Localization with a changing key', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats

    // directly with the locale manager
    const greeting_key = ko.observable('formal_hello');
    const locale_manager_greeting = kb.observable(kb.locale_manager, { key: greeting_key });

    kb.locale_manager.setLocale('en');
    assert.equal(locale_manager_greeting(), 'Hello', 'en: Hello');
    kb.locale_manager.setLocale('en-GB');
    assert.equal(locale_manager_greeting(), 'Good day sir', 'en-GB: Hello');

    greeting_key('formal_goodbye');
    assert.equal(locale_manager_greeting(), 'Goodbye darling', 'en-GB: Goodbye');
    kb.locale_manager.setLocale('en');
    assert.equal(locale_manager_greeting(), 'Goodbye', 'en: Goodbye');

    const ContactViewModelGreeting = function (model) {
      this.greeting_key = ko.observable('hello_greeting');
      this.greeting = kb.observable(model, { key: this.greeting_key, localizer: kb.LocalizedStringLocalizer });
    };

    const model = new Contact({ hello_greeting: new LocalizedString('formal_hello'), goodbye_greeting: new LocalizedString('formal_goodbye') });
    const view_model = new ContactViewModelGreeting(model);

    assert.equal(view_model.greeting(), 'Hello', 'en: Hello');
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.greeting(), 'Good day sir', 'en-GB: Hello');

    view_model.greeting_key('goodbye_greeting');
    assert.equal(view_model.greeting(), 'Goodbye darling', 'en-GB: Goodbye');
    kb.locale_manager.setLocale('en');
    assert.equal(view_model.greeting(), 'Goodbye', 'en: Goodbye');

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  it('2. internals test (Coffeescript inheritance)', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats
    kb.locale_manager = locale_manager;

    class ContactViewModel extends kb.ViewModel {
      constructor(model) {
        super(model, { internals: ['email', 'date'] });
        this.email = function (value) {
          if (arguments.length) {
            return this._email(value);
          }
          return !this._email() ? 'your.name@yourplace.com' : this._email();
        }.bind(this);
        this.date = new kb.LongDateLocalizer(this._date);
      }
    }

    const birthdate = new Date(1940, 10, 9);
    const model = new Contact({ name: 'John', date: new Date(birthdate.valueOf()) });
    const view_model = new ContactViewModel(model);

    // check email
    assert.equal(view_model._email(), undefined, 'no email');
    assert.equal(view_model.email(), 'your.name@yourplace.com', 'default message');

    view_model._email('j@imagine.com');
    assert.equal(view_model.email(), 'j@imagine.com', 'received email');

    view_model.email('john@imagine.com');
    assert.equal(view_model.email(), 'john@imagine.com', 'received email');

    // set from the view model
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    view_model.date('10 December 1963');
    let current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1963, 'year is good');
    assert.equal(current_date.getMonth(), 11, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');
    assert.equal(view_model._date().getFullYear(), 1963, 'year is good');
    assert.equal(view_model._date().getMonth(), 11, 'month is good');
    assert.equal(view_model._date().getDate(), 10, 'day is good');

    // set from the model
    model.set({ date: new Date(birthdate.valueOf()) });
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, 'year is good');
    assert.equal(current_date.getMonth(), 10, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');
    assert.equal(view_model._date().getFullYear(), 1940, 'year is good');
    assert.equal(view_model._date().getMonth(), 10, 'month is good');
    assert.equal(view_model._date().getDate(), 10, 'day is good');

    // set from the automatically-generated date observable
    view_model.date(new Date(birthdate.valueOf()));
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '10 novembre 1940', "One past John's birthdate in France format");
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, 'year is good');
    assert.equal(current_date.getMonth(), 10, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');
    assert.equal(view_model._date().getFullYear(), 1940, 'year is good');
    assert.equal(view_model._date().getMonth(), 10, 'month is good');
    assert.equal(view_model._date().getDate(), 10, 'day is good');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  it.skip('3. internals test (Javascript inheritance)', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats
    kb.locale_manager = locale_manager;

    const ContactViewModel = kb.ViewModel.extend({
      constructor(model) {
        kb.ViewModel.prototype.constructor.call(this, model, { internals: ['email', 'date'] });
        this.email = function (value) {
          if (arguments.length) {
            return this._email(value);
          }
          return !this._email() ? 'your.name@yourplace.com' : this._email();
        }.bind(this);
        this.date = new kb.LongDateLocalizer(this._date);
      },
    });

    const birthdate = new Date(1940, 10, 9);
    const model = new Contact({ name: 'John', date: new Date(birthdate.valueOf()) });
    const view_model = new ContactViewModel(model);

    // check email
    assert.equal(view_model._email(), undefined, 'no email');
    assert.equal(view_model.email(), 'your.name@yourplace.com', 'default message');

    view_model._email('j@imagine.com');
    assert.equal(view_model._email(), 'j@imagine.com', 'received email');
    assert.equal(view_model.email(), 'j@imagine.com', 'received email');

    view_model.email('john@imagine.com');
    assert.equal(view_model._email(), 'john@imagine.com', 'received email');
    assert.equal(view_model.email(), 'john@imagine.com', 'received email');

    // set from the view model
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    view_model.date('10 December 1963');
    let current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1963, 'year is good');
    assert.equal(current_date.getMonth(), 11, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');
    assert.equal(view_model._date().getFullYear(), 1963, 'year is good');
    assert.equal(view_model._date().getMonth(), 11, 'month is good');
    assert.equal(view_model._date().getDate(), 10, 'day is good');

    // set from the model
    model.set({ date: new Date(birthdate.valueOf()) });
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, 'year is good');
    assert.equal(current_date.getMonth(), 10, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');
    assert.equal(view_model._date().getFullYear(), 1940, 'year is good');
    assert.equal(view_model._date().getMonth(), 10, 'month is good');
    assert.equal(view_model._date().getDate(), 10, 'day is good');

    // set from the automatically-generated date observable
    view_model.date(new Date(birthdate.valueOf()));
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '10 novembre 1940', "One past John's birthdate in France format");
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, 'year is good');
    assert.equal(current_date.getMonth(), 10, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');
    assert.equal(view_model._date().getFullYear(), 1940, 'year is good');
    assert.equal(view_model._date().getMonth(), 10, 'month is good');
    assert.equal(view_model._date().getDate(), 10, 'day is good');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  it('7. Using kb.localizedObservable', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats
    kb.locale_manager = locale_manager;

    class ContactViewModelDate extends kb.ViewModel {
      constructor(model) {
        super(model, { internals: ['date'] });
        this.date = new kb.LongDateLocalizer(this._date);
      }
    }

    const birthdate = new Date(1940, 10, 9);
    const model = new Contact({ name: 'John', date: new Date(birthdate.valueOf()) });
    const view_model = new ContactViewModelDate(model);

    // set from the view model
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    view_model.date('10 December 1963');
    let current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1963, 'year is good');
    assert.equal(current_date.getMonth(), 11, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');
    assert.equal(view_model._date().getFullYear(), 1963, 'year is good');
    assert.equal(view_model._date().getMonth(), 11, 'month is good');
    assert.equal(view_model._date().getDate(), 10, 'day is good');

    // set from the model
    model.set({ date: new Date(birthdate.valueOf()) });
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, 'year is good');
    assert.equal(current_date.getMonth(), 10, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');
    assert.equal(view_model._date().getFullYear(), 1940, 'year is good');
    assert.equal(view_model._date().getMonth(), 10, 'month is good');
    assert.equal(view_model._date().getDate(), 10, 'day is good');

    // set from the automatically-generated date observable
    view_model.date(new Date(birthdate.valueOf()));
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '10 novembre 1940', "John's birthdate in France format");
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, 'year is good');
    assert.equal(current_date.getMonth(), 10, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');
    assert.equal(view_model._date().getFullYear(), 1940, 'year is good');
    assert.equal(view_model._date().getMonth(), 10, 'month is good');
    assert.equal(view_model._date().getDate(), 10, 'day is good');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  it('7. Using kb.localizedObservable', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats
    kb.locale_manager = locale_manager;

    class ContactViewModelDate extends kb.ViewModel {
      constructor(model) {
        super(model, { internals: ['date'] });
        this.date = new kb.LongDateLocalizer(this._date);
      }
    }

    const birthdate = new Date(1940, 10, 9);
    const model = new Contact({ name: 'John', date: new Date(birthdate.valueOf()) });
    const view_model = new ContactViewModelDate(model);

    // set from the view model
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    view_model.date('10 December 1963');
    let current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1963, 'year is good');
    assert.equal(current_date.getMonth(), 11, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');
    assert.equal(view_model._date().getFullYear(), 1963, 'year is good');
    assert.equal(view_model._date().getMonth(), 11, 'month is good');
    assert.equal(view_model._date().getDate(), 10, 'day is good');

    // set from the model
    model.set({ date: new Date(birthdate.valueOf()) });
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, 'year is good');
    assert.equal(current_date.getMonth(), 10, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');
    assert.equal(view_model._date().getFullYear(), 1940, 'year is good');
    assert.equal(view_model._date().getMonth(), 10, 'month is good');
    assert.equal(view_model._date().getDate(), 10, 'day is good');

    // set from the automatically-generated date observable
    view_model.date(new Date(birthdate.valueOf()));
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '10 novembre 1940', "John's birthdate in France format");
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, 'year is good');
    assert.equal(current_date.getMonth(), 10, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');
    assert.equal(view_model._date().getFullYear(), 1940, 'year is good');
    assert.equal(view_model._date().getMonth(), 10, 'month is good');
    assert.equal(view_model._date().getDate(), 10, 'day is good');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  it('10. Nested custom view models', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats
    kb.locale_manager = locale_manager;

    class ContactViewModelDate extends kb.ViewModel {
      constructor(model, options) {
        super(model, _.extend({ internals: ['date'] }, options));
        this.date = new kb.LongDateLocalizer(this._date);
      }
    }

    const john_birthdate = new Date(1940, 10, 9);
    const john = new Contact({ name: 'John', date: new Date(john_birthdate.valueOf()) });
    const paul_birthdate = new Date(1942, 6, 18);
    const paul = new Contact({ name: 'Paul', date: new Date(paul_birthdate.valueOf()) });
    const george_birthdate = new Date(1943, 2, 25);
    const george = new Contact({ name: 'George', date: new Date(george_birthdate.valueOf()) });
    const ringo_birthdate = new Date(1940, 7, 7);
    const ringo = new Contact({ name: 'Ringo', date: new Date(ringo_birthdate.valueOf()) });
    const major_duo = new kb.Collection([john, paul]);
    const minor_duo = new kb.Collection([george, ringo]);
    const nested_model = new kb.Model({
      john,
      paul,
      george,
      ringo,
      major_duo1: major_duo,
      major_duo2: major_duo,
      major_duo3: major_duo,
      minor_duo1: minor_duo,
      minor_duo2: minor_duo,
      minor_duo3: minor_duo,
    });

    const nested_view_model = kb.viewModel(nested_model, {
      factories: {
        john: ContactViewModelDate,
        george: { create(model, options) { return new ContactViewModelDate(model, options); } },
        'major_duo1.models': ContactViewModelDate,
        'major_duo2.models': { create(model, options) { return new ContactViewModelDate(model, options); } },
        'major_duo3.models': { models_only: true },
        'minor_duo1.models': kb.ViewModel,
        'minor_duo2.models': { create(model, options) { return new kb.ViewModel(model, options); } },
      },
    });

    const validateContactViewModel = function (view_model, name, birthdate) {
      const model = kb.utils.wrappedModel(view_model);
      assert.equal(view_model.name(), name, `${name}: Name matches`);

      // set from the view model
      kb.locale_manager.setLocale('en-GB');
      const formatted_date = new kb.LongDateLocalizer(birthdate);
      assert.equal(view_model.date(), formatted_date(), `${name}: Birthdate in Great Britain format`);
      view_model.date('10 December 1963');
      let current_date = model.get('date');
      assert.equal(current_date.getFullYear(), 1963, `${name}: year is good`);
      assert.equal(current_date.getMonth(), 11, `${name}: month is good`);
      assert.equal(current_date.getDate(), 10, `${name}: day is good`);
      assert.equal(view_model._date().getFullYear(), 1963, `${name}: year is good`);
      assert.equal(view_model._date().getMonth(), 11, `${name}: month is good`);
      assert.equal(view_model._date().getDate(), 10, `${name}: day is good`);

      model.set({ date: new Date(birthdate.valueOf()) }); // restore birthdate

      // set from the model
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.date(), formatted_date(), `${name}: Birthdate in France format`);
      view_model.date('10 novembre 1940');
      current_date = model.get('date');
      assert.equal(current_date.getFullYear(), 1940, `${name}: year is good`);
      assert.equal(current_date.getMonth(), 10, `${name}: month is good`);
      assert.equal(current_date.getDate(), 10, `${name}: day is good`);
      assert.equal(view_model._date().getFullYear(), 1940, `${name}: year is good`);
      assert.equal(view_model._date().getMonth(), 10, `${name}: month is good`);
      assert.equal(view_model._date().getDate(), 10, `${name}: day is good`);

      return model.set({ date: new Date(birthdate.valueOf()) }); // restore birthdate
    };

    const validateGenericViewModel = function (view_model, name, birthdate) {
      assert.equal(view_model.name(), name, `${name}: Name matches`);
      return assert.equal(view_model.date().valueOf(), birthdate.valueOf(), `${name}: Birthdate matches`);
    };

    const validateModel = function (model, name, birthdate) {
      assert.equal(model.get('name'), name, `${name}: Name matches`);
      return assert.equal(model.get('date').valueOf(), birthdate.valueOf(), `${name}: Birthdate matches`);
    };

    // models
    validateContactViewModel(nested_view_model.john(), 'John', john_birthdate);
    validateGenericViewModel(nested_view_model.paul(), 'Paul', paul_birthdate);
    validateContactViewModel(nested_view_model.george(), 'George', george_birthdate);
    validateGenericViewModel(nested_view_model.ringo(), 'Ringo', ringo_birthdate);

    // colllections
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

    // and cleanup after yourself when you are done.
    kb.release(nested_view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  it('12. Prior kb.Observables functionality', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats
    kb.locale_manager = locale_manager;

    const ContactViewModel = function (model) {
      this.dynamic_observables = kb.viewModel(model, { keys: {
        name: { key: 'name' },
        number: 'number',
        date: { key: 'date', localizer: kb.LongDateLocalizer },
        name2: { key: 'name' },
      } }, this);
    };

    const model = new Contact({ name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9) });
    const view_model = new ContactViewModel(model);

    // get
    assert.equal(view_model.name(), 'John', 'It is a name');
    assert.equal(view_model.name2(), 'John', 'It is a name');
    assert.equal(view_model.number(), '555-555-5558', 'Not so interesting number');
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");

    // set from the view model
    assert.equal(model.get('name'), 'John', 'Name not changed');
    assert.equal(view_model.name(), 'John', 'Name not changed');
    assert.equal(view_model.name2(), 'John', 'Name not changed');
    view_model.number('9222-222-222');
    assert.equal(model.get('number'), '9222-222-222', 'Number was changed');
    assert.equal(view_model.number(), '9222-222-222', 'Number was changed');
    kb.locale_manager.setLocale('en-GB');
    view_model.date('10 December 1963');
    let current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1963, 'year is good');
    assert.equal(current_date.getMonth(), 11, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');

    assert.equal(model.get('name'), 'John', 'Name not changed');
    assert.equal(view_model.name(), 'John', 'Name not changed');
    assert.equal(view_model.name2(), 'John', 'Name not changed');

    // set from the model
    model.set({ name: 'Yoko', number: '818-818-8181' });
    assert.equal(view_model.name(), 'Yoko', 'Name changed');
    assert.equal(view_model.number(), '818-818-8181', 'Number was changed');
    model.set({ date: new Date(1940, 10, 9) });
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, 'year is good');
    assert.equal(current_date.getMonth(), 10, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  return it('13. Bulk mode (array of keys)', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats
    kb.locale_manager = locale_manager;

    const model = new Contact({ name: 'John', number: '555-555-5558' });
    const view_model = kb.viewModel(model, ['name', 'number']);

    // get
    assert.equal(view_model.name(), 'John', 'It is a name');
    assert.equal(view_model.number(), '555-555-5558', 'Not so interesting number');
    kb.locale_manager.setLocale('en-GB');
    kb.locale_manager.setLocale('fr-FR');

    // set from the view model
    view_model.name('Paul');
    assert.equal(model.get('name'), 'Paul', 'Name changed');
    assert.equal(view_model.name(), 'Paul', 'Name changed');
    view_model.number('9222-222-222');
    assert.equal(model.get('number'), '9222-222-222', 'Number was changed');
    assert.equal(view_model.number(), '9222-222-222', 'Number was changed');
    kb.locale_manager.setLocale('en-GB');

    // set from the model
    model.set({ name: 'Yoko', number: '818-818-8181' });
    assert.equal(view_model.name(), 'Yoko', 'Name changed');
    assert.equal(view_model.number(), '818-818-8181', 'Number was changed');
    kb.locale_manager.setLocale('fr-FR');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });
});

describe('defaults @quick @defaults', () => {
  it('TEST DEPENDENCY MISSING', (done) => {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!kb.Model, 'kb.Model');
    assert.ok(!!kb.Collection, 'kb.Collection');
    assert.ok(!!kb, 'kb');
    assert.ok(!!Globalize, 'Globalize');
    return done();
  });

  const locale_manager = new LocaleManager('en', {
    en: { loading: 'Loading dude' },
    'en-GB': { loading: 'Loading sir' },
    'fr-FR': { loading: 'Chargement' },
  });

  if (kb.Backbone) {
    it.skip('1. Standard use case: just enough to get the picture', (done) => {
      kb.statistics = new kb.Statistics(); // turn on stats
      kb.locale_manager = locale_manager;

      const ContactViewModel = function (model) {
        this.loading_message = new kb.LocalizedStringLocalizer(new LocalizedString('loading'));
        this._auto = kb.viewModel(model, { keys: {
          name: { key: 'name', default: this.loading_message },
          number: { key: 'number', default: this.loading_message },
          date: { key: 'date', default: this.loading_message, localizer: kb.ShortDateLocalizer },
        } }, this);
        return this;
      };

      const collection = new Contacts();
      const model_ref = new kb.Backbone.ModelRef(collection, 'b4');
      const view_model = new ContactViewModel(model_ref);

      kb.locale_manager.setLocale('en');
      assert.equal(view_model.name(), 'Loading dude', 'Is that what we want to convey?');
      kb.locale_manager.setLocale('en-GB');
      assert.equal(view_model.name(), 'Loading sir', 'Maybe too formal');
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.name(), 'Chargement', 'Localize from day one. Good!');

      collection.add(collection.parse({ id: 'b4', name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9) }));
      const model = collection.get('b4');

      // get
      assert.equal(view_model.name(), 'John', 'It is a name');
      assert.equal(view_model.number(), '555-555-5558', 'Not so interesting number');
      kb.locale_manager.setLocale('en-GB');
      assert.equal(view_model.date(), '09/11/1940', "John's birthdate in Great Britain format");
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.date(), '09/11/1940', "John's birthdate in France format");

      // set from the view model
      assert.equal(model.get('name'), 'John', 'Name not changed');
      assert.equal(view_model.name(), 'John', 'Name not changed');
      view_model.number('9222-222-222');
      assert.equal(model.get('number'), '9222-222-222', 'Number was changed');
      assert.equal(view_model.number(), '9222-222-222', 'Number was changed');
      kb.locale_manager.setLocale('en-GB');
      view_model.date('10/12/1963');
      let current_date = model.get('date');
      assert.equal(current_date.getFullYear(), 1963, 'year is good');
      assert.equal(current_date.getMonth(), 11, 'month is good');
      assert.equal(current_date.getDate(), 10, 'day is good');

      // set from the model
      model.set({ name: 'Yoko', number: '818-818-8181' });
      assert.equal(view_model.name(), 'Yoko', 'Name changed');
      assert.equal(view_model.number(), '818-818-8181', 'Number was changed');
      model.set({ date: new Date(1940, 10, 9) });
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.date(), '09/11/1940', "John's birthdate in France format");
      view_model.date('10/11/1940');
      current_date = model.get('date');
      assert.equal(current_date.getFullYear(), 1940, 'year is good');
      assert.equal(current_date.getMonth(), 10, 'month is good');
      assert.equal(current_date.getDate(), 10, 'day is good');

      // go back to loading state
      collection.reset();
      assert.equal(view_model.name(), 'Chargement', 'Resets to default');
      view_model._auto.setToDefault(); // override default behavior and go back to loading state
      kb.locale_manager.setLocale('en');
      assert.equal(view_model.name(), 'Loading dude', 'Is that what we want to convey?');
      kb.locale_manager.setLocale('en-GB');
      assert.equal(view_model.name(), 'Loading sir', 'Maybe too formal');
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.name(), 'Chargement', 'Localize from day one. Good!');

      // and cleanup after yourself when you are done.
      kb.release(view_model);

      assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
      return done();
    });

    it('2. Standard use case with kb.ViewModels', (done) => {
      kb.statistics = new kb.Statistics(); // turn on stats
      kb.locale_manager = locale_manager;

      class ContactViewModel extends kb.ViewModel {
        constructor(model) {
          super(model, { internals: ['name', 'number', 'date'] });
          this.loading_message = new kb.LocalizedStringLocalizer(new LocalizedString('loading'));
          this.name = kb.defaultObservable(this._name, this.loading_message);
          this.number = kb.defaultObservable(this._number, this.loading_message);
          this.date = kb.defaultObservable(new kb.LongDateLocalizer(this._date), this.loading_message);
        }
      }

      const collection = new Contacts();
      const model_ref = new kb.Backbone.ModelRef(collection, 'b4');
      const view_model = new ContactViewModel(model_ref);

      kb.locale_manager.setLocale('en');
      assert.equal(view_model.name(), 'Loading dude', 'Is that what we want to convey?');
      kb.locale_manager.setLocale('en-GB');
      assert.equal(view_model.name(), 'Loading sir', 'Maybe too formal');
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.name(), 'Chargement', 'Localize from day one. Good!');

      collection.add(collection.parse({ id: 'b4', name: 'John', number: '555-555-5558', date: new Date(1940, 10, 9) }));
      const model = collection.get('b4');

      // get
      assert.equal(view_model.name(), 'John', 'It is a name');
      assert.equal(view_model.number(), '555-555-5558', 'Not so interesting number');
      kb.locale_manager.setLocale('en-GB');
      assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");

      // set from the view model
      view_model.number('9222-222-222');
      assert.equal(model.get('number'), '9222-222-222', 'Number was changed');
      assert.equal(view_model.number(), '9222-222-222', 'Number was changed');
      kb.locale_manager.setLocale('en-GB');
      view_model.date('10 December 1963');
      let current_date = model.get('date');
      assert.equal(current_date.getFullYear(), 1963, 'year is good');
      assert.equal(current_date.getMonth(), 11, 'month is good');
      assert.equal(current_date.getDate(), 10, 'day is good');

      // set from the model
      model.set({ name: 'Yoko', number: '818-818-8181' });
      assert.equal(view_model.name(), 'Yoko', 'Name changed');
      assert.equal(view_model.number(), '818-818-8181', 'Number was changed');
      model.set({ date: new Date(1940, 10, 9) });
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
      view_model.date('10 novembre 1940');
      current_date = model.get('date');
      assert.equal(current_date.getFullYear(), 1940, 'year is good');
      assert.equal(current_date.getMonth(), 10, 'month is good');
      assert.equal(current_date.getDate(), 10, 'day is good');

      // go back to loading state
      collection.reset();
      assert.equal(view_model.name(), 'Chargement', 'Resets to default');
      kb.utils.setToDefault(view_model);
      kb.locale_manager.setLocale('en');
      assert.equal(view_model.name(), 'Loading dude', 'Is that what we want to convey?');
      kb.locale_manager.setLocale('en-GB');
      assert.equal(view_model.name(), 'Loading sir', 'Maybe too formal');
      kb.locale_manager.setLocale('fr-FR');
      assert.equal(view_model.name(), 'Chargement', 'Localize from day one. Good!');

      // and cleanup after yourself when you are done.
      kb.release(view_model);

      assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
      return done();
    });
  }

  it('3. internals test (Coffeescript inheritance)', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats
    kb.locale_manager = locale_manager;

    class ContactViewModel extends kb.ViewModel {
      constructor(model) {
        super(model, { internals: ['email', 'date'] });
        this.email = kb.defaultObservable(this._email, 'your.name@yourplace.com');
        this.date = new kb.LongDateLocalizer(this._date);
      }
    }

    const birthdate = new Date(1940, 10, 9);
    const model = new Contact({ name: 'John', date: new Date(birthdate.valueOf()) });
    const view_model = new ContactViewModel(model);

    // check email
    assert.equal(view_model._email(), undefined, 'no email');
    assert.equal(view_model.email(), 'your.name@yourplace.com', 'default message');

    view_model._email('j@imagine.com');
    assert.equal(view_model._email(), 'j@imagine.com', 'received email');
    assert.equal(view_model.email(), 'j@imagine.com', 'received email');

    view_model.email('john@imagine.com');
    assert.equal(view_model._email(), 'john@imagine.com', 'received email');
    assert.equal(view_model.email(), 'john@imagine.com', 'received email');

    // set from the view model
    kb.locale_manager.setLocale('en-GB');
    assert.equal(view_model.date(), '09 November 1940', "John's birthdate in Great Britain format");
    view_model.date('10 December 1963');
    let current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1963, 'year is good');
    assert.equal(current_date.getMonth(), 11, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');
    assert.equal(view_model._date().getFullYear(), 1963, 'year is good');
    assert.equal(view_model._date().getMonth(), 11, 'month is good');
    assert.equal(view_model._date().getDate(), 10, 'day is good');

    // set from the model
    model.set({ date: new Date(birthdate.valueOf()) });
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '09 novembre 1940', "John's birthdate in France format");
    view_model.date('10 novembre 1940');
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, 'year is good');
    assert.equal(current_date.getMonth(), 10, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');
    assert.equal(view_model._date().getFullYear(), 1940, 'year is good');
    assert.equal(view_model._date().getMonth(), 10, 'month is good');
    assert.equal(view_model._date().getDate(), 10, 'day is good');

    // set from the automatically-generated date observable
    view_model.date(new Date(birthdate.valueOf()));
    kb.locale_manager.setLocale('fr-FR');
    assert.equal(view_model.date(), '10 novembre 1940', "One past John's birthdate in France format");
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, 'year is good');
    assert.equal(current_date.getMonth(), 10, 'month is good');
    assert.equal(current_date.getDate(), 10, 'day is good');
    assert.equal(view_model._date().getFullYear(), 1940, 'year is good');
    assert.equal(view_model._date().getMonth(), 10, 'month is good');
    assert.equal(view_model._date().getDate(), 10, 'day is good');

    // and cleanup after yourself when you are done.
    kb.release(view_model);

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });

  // https://github.com/kmalakoff/knockback/issues/114
  return it('4. 0 should not behave as null', (done) => {
    kb.statistics = new kb.Statistics(); // turn on stats

    const model = new Contact();
    const casebutton = kb.observable(model, { key: 'casebutton', default: 99 });
    const casecond = ko.computed(() => {
      switch (casebutton()) {
        case 0: return 'Open';
        case 1: return 'Closed';
        default: return 'Unknown';
      }
    });

    assert.equal(casebutton(), 99);
    assert.equal(casecond(), 'Unknown');

    model.set({ casebutton: 0 });
    assert.equal(casebutton(), 0);
    assert.equal(casecond(), 'Open');

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', 'Cleanup: stats'); kb.statistics = null;
    return done();
  });
});
