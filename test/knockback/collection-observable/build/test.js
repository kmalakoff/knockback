var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

describe('knockback-collection-observable.js', function() {
  var ContactViewModel, ContactViewModelClass, TestViewModel, kb, ko, _;
  ko = window.ko || (typeof require === "function" ? require('knockout') : void 0);
  kb = window.kb || (typeof require === "function" ? require('knockback') : void 0);
  _ = kb._;
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
  ContactViewModel = function(model) {
    this.name = kb.observable(model, 'name');
    this.number = kb.observable(model, 'number');
    return this;
  };
  ContactViewModelClass = (function() {
    function ContactViewModelClass(model) {
      this.name = kb.observable(model, 'name');
      this.number = kb.observable(model, 'number');
    }

    return ContactViewModelClass;

  })();
  TestViewModel = (function(_super) {
    __extends(TestViewModel, _super);

    function TestViewModel() {
      var value;
      TestViewModel.__super__.constructor.apply(this, arguments);
      this.test = ko.observable('hello');
      value = this.test();
      value = this.name();
    }

    return TestViewModel;

  })(kb.ViewModel);
  it('2. Basic Usage: collection observable with ko.dependentObservable', function(done) {
    var collection, collection_observable, view_model;
    kb.statistics = new kb.Statistics();
    collection = new kb.ContactsCollection();
    collection_observable = kb.collectionObservable(collection);
    view_model = {
      count: ko.dependentObservable(function() {
        return collection_observable().length;
      })
    };
    assert.equal(collection.length, 0, "no models");
    assert.equal(view_model.count(), 0, "no count");
    collection.add(new kb.Contact({
      id: 'b1',
      name: 'Ringo',
      number: '555-555-5556'
    }));
    collection.add(new kb.Contact({
      id: 'b2',
      name: 'George',
      number: '555-555-5555'
    }));
    assert.equal(collection.length, 2, "2 models");
    assert.equal(view_model.count(), 2, "2 count");
    collection.add(new kb.Contact({
      id: 'b3',
      name: 'Paul',
      number: '555-555-5557'
    }));
    assert.equal(collection.length, 3, "3 models");
    assert.equal(view_model.count(), 3, "3 count");
    collection.remove('b2');
    collection.remove('b3');
    assert.equal(collection.length, 1, "1 model");
    assert.equal(view_model.count(), 1, "1 count");
    kb.release(collection_observable);
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('3. Basic Usage: collection observable with ko.dependentObservable', function(done) {
    var collection, collection_observable, view_model;
    kb.statistics = new kb.Statistics();
    collection = new kb.ContactsCollection();
    collection_observable = kb.collectionObservable(collection, {
      factories: {
        models: ContactViewModel
      }
    });
    view_model = {
      count: ko.dependentObservable(function() {
        return collection_observable().length;
      })
    };
    assert.equal(collection.length, 0, "no models");
    assert.equal(view_model.count(), 0, "no count");
    collection.add(new kb.Contact({
      id: 'b1',
      name: 'Ringo',
      number: '555-555-5556'
    }));
    collection.add(new kb.Contact({
      id: 'b2',
      name: 'George',
      number: '555-555-5555'
    }));
    assert.equal(collection.length, 2, "2 models");
    assert.equal(view_model.count(), 2, "2 count");
    collection.add(new kb.Contact({
      id: 'b3',
      name: 'Paul',
      number: '555-555-5557'
    }));
    assert.equal(collection.length, 3, "3 models");
    assert.equal(view_model.count(), 3, "3 count");
    assert.ok(collection_observable()[2] instanceof ContactViewModel, 'correct type from factory');
    collection.remove('b2');
    collection.remove('b3');
    assert.equal(collection.length, 1, "1 model");
    assert.equal(view_model.count(), 1, "1 count");
    kb.release(collection_observable);
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('4. Basic Usage: no view models', function(done) {
    var collection, collection_observable, model, model_count, view_model;
    kb.statistics = new kb.Statistics();
    collection = new kb.ContactsCollection();
    collection_observable = kb.collectionObservable(collection, {
      models_only: true
    });
    assert.equal(collection.length, 0, "no models");
    assert.equal(collection_observable().length, 0, "no view models");
    collection.add(new kb.Contact({
      id: 'b1',
      name: 'Ringo',
      number: '555-555-5555'
    }));
    collection.add(new kb.Contact({
      id: 'b2',
      name: 'George',
      number: '555-555-5556'
    }));
    assert.equal(collection.length, 2, "two models");
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first");
    assert.equal(collection.models[1].get('name'), 'George', "George is second");
    assert.equal(collection_observable().length, 2, "two view models");
    assert.equal(collection_observable()[0].get('name'), 'Ringo', "Ringo is first");
    assert.equal(collection_observable()[1].get('name'), 'George', "George is second");
    collection.remove('b2');
    assert.equal(collection.length, 1, "one models");
    assert.equal(collection_observable().length, 1, "one view models");
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is left");
    model = kb.utils.wrappedModel(collection_observable()[0]);
    assert.equal(model.get('name'), 'Ringo', "Ringo is left");
    model = collection_observable()[0];
    assert.equal(model.get('name'), 'Ringo', "Ringo is left");
    view_model = collection_observable.viewModelByModel(model);
    assert.ok(!view_model, "no view model found since the collection observable is not wrapping models in view models");
    model_count = 0;
    _.each(collection_observable(), function(model) {
      return model_count++;
    });
    assert.equal(model_count, 1, "one model");
    assert.ok(collection_observable.collection() === collection, "collections match");
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('5. Basic Usage: no sorting and no callbacks', function(done) {
    var collection, collection_observable, model, view_model, view_model_count;
    kb.statistics = new kb.Statistics();
    collection = new kb.ContactsCollection();
    collection_observable = kb.collectionObservable(collection, {
      factories: {
        models: {
          create: function(model) {
            return new ContactViewModel(model);
          }
        }
      }
    });
    assert.equal(collection.length, 0, "no models");
    assert.equal(collection_observable().length, 0, "no view models");
    collection.add(new kb.Contact({
      id: 'b1',
      name: 'Ringo',
      number: '555-555-5555'
    }));
    collection.add(new kb.Contact({
      id: 'b2',
      name: 'George',
      number: '555-555-5556'
    }));
    assert.equal(collection.length, 2, "two models");
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first");
    assert.equal(collection.models[1].get('name'), 'George', "George is second");
    assert.equal(collection_observable().length, 2, "two view models");
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Ringo', "Ringo is first");
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'George', "George is second");
    collection.remove('b2');
    assert.equal(collection.length, 1, "one model");
    assert.equal(collection_observable().length, 1, "one view model");
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is left");
    model = kb.utils.wrappedModel(collection_observable()[0]);
    assert.equal(model.get('name'), 'Ringo', "Ringo is left");
    view_model = collection_observable.viewModelByModel(model);
    assert.equal(kb.utils.wrappedModel(view_model).get('name'), 'Ringo', "Ringo is left");
    view_model_count = 0;
    _.each(collection_observable(), function(view_model) {
      return view_model_count++;
    });
    assert.equal(view_model_count, 1, "one view model");
    assert.ok(collection_observable.collection() === collection, "collections match");
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('6. Collection sync sorting with sort_attribute', function(done) {
    var collection, collection_observable;
    kb.statistics = new kb.Statistics();
    collection = new kb.ContactsCollection();
    collection_observable = kb.collectionObservable(collection, {
      view_model: ContactViewModelClass,
      sort_attribute: 'name'
    });
    assert.equal(collection.length, 0, "no models");
    assert.equal(collection_observable().length, 0, "no view models");
    collection.add(new kb.Contact({
      id: 'b1',
      name: 'Ringo',
      number: '555-555-5556'
    }));
    collection.add(new kb.Contact({
      id: 'b2',
      name: 'George',
      number: '555-555-5555'
    }));
    assert.equal(collection.length, 2, "two models");
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first");
    assert.equal(collection.models[1].get('name'), 'George', "George is second");
    assert.equal(collection_observable().length, 2, "two view models");
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!");
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!");
    collection.add(new kb.Contact({
      id: 'b3',
      name: 'Paul',
      number: '555-555-5557'
    }));
    assert.equal(collection.length, 3, "three models");
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first");
    assert.equal(collection.models[1].get('name'), 'George', "George is second");
    assert.equal(collection.models[2].get('name'), 'Paul', "Paul is second");
    assert.equal(collection_observable().length, 3, "two view models");
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!");
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Paul', "Paul is second - sorting worked!");
    assert.equal(kb.utils.wrappedModel(collection_observable()[2]).get('name'), 'Ringo', "Ringo is third - sorting worked!");
    collection.remove('b2');
    collection.remove('b3');
    assert.equal(collection.length, 1, "one model");
    assert.equal(collection_observable().length, 1, "one view model");
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is left");
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Ringo', "Ringo is left");
    collection.reset();
    assert.equal(collection.length, 0, "no models");
    assert.equal(collection_observable().length, 0, "no view models");
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('7. Collection sync sorting with comparator', function(done) {
    var collection, collection_observable, sortNumber;
    kb.statistics = new kb.Statistics();
    sortNumber = function(model_a, model_b) {
      var delta, index, part, parts_a, parts_b;
      parts_a = kb.utils.wrappedModel(model_a).get('number').split('-');
      parts_b = kb.utils.wrappedModel(model_b).get('number').split('-');
      if (parts_a.length !== parts_b.length) {
        return parts_a.length - parts_b.length;
      }
      for (index in parts_b) {
        part = parts_b[index];
        if ((delta = parts_a[index] - parseInt(part, 10)) !== 0) {
          return delta;
        }
      }
      return 0;
    };
    collection = new kb.ContactsCollection();
    collection_observable = kb.collectionObservable(collection, {
      models_only: true,
      comparator: sortNumber
    });
    collection.add(new kb.Contact({
      id: 'b1',
      name: 'Ringo',
      number: '555-555-5556'
    }));
    collection.add(new kb.Contact({
      id: 'b2',
      name: 'George',
      number: '555-555-5555'
    }));
    assert.equal(collection.length, 2, "two models");
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first");
    assert.equal(collection.models[1].get('name'), 'George', "George is second");
    assert.equal(collection_observable().length, 2, "two view models");
    assert.equal(collection_observable()[0].get('name'), 'George', "George is first - sorting worked!");
    assert.equal(collection_observable()[1].get('name'), 'Ringo', "Ringo is second - sorting worked!");
    kb.release(collection_observable);
    collection = new kb.ContactsCollection();
    collection_observable = kb.collectionObservable(collection, {
      view_model: ContactViewModelClass,
      comparator: sortNumber
    });
    collection.add(new kb.Contact({
      id: 'b1',
      name: 'Ringo',
      number: '555-555-5556'
    }));
    collection.add(new kb.Contact({
      id: 'b2',
      name: 'George',
      number: '555-555-5555'
    }));
    assert.equal(collection.length, 2, "two models");
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first");
    assert.equal(collection.models[1].get('name'), 'George', "George is second");
    assert.equal(collection_observable().length, 2, "two view models");
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!");
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!");
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('8. Collection sorting with callbacks', function(done) {
    var collection, collection_observable;
    kb.statistics = new kb.Statistics();
    kb.NameSortedContactsCollection = kb.Collection.extend({
      model: kb.Contact,
      comparator: function(model) {
        return model.get('name');
      }
    });
    collection = new kb.NameSortedContactsCollection();
    collection_observable = kb.collectionObservable(collection, {
      view_model: ContactViewModel
    });
    assert.equal(collection.length, 0, "no models");
    assert.equal(collection_observable().length, 0, "no view models");
    collection.add(new kb.Contact({
      id: 'b1',
      name: 'Ringo',
      number: '555-555-5556'
    }));
    collection.add(new kb.Contact({
      id: 'b2',
      name: 'George',
      number: '555-555-5555'
    }));
    assert.equal(collection.length, 2, "two models");
    assert.equal(collection.models[0].get('name'), 'George', "George is first");
    assert.equal(collection.models[1].get('name'), 'Ringo', "Ringo is second");
    assert.equal(collection_observable().length, 2, "two view models");
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!");
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!");
    collection.add(new kb.Contact({
      id: 'b3',
      name: 'Paul',
      number: '555-555-5557'
    }));
    assert.equal(collection.length, 3, "three models");
    assert.equal(collection.models[0].get('name'), 'George', "George is first");
    assert.equal(collection.models[1].get('name'), 'Paul', "Paul is second");
    assert.equal(collection.models[2].get('name'), 'Ringo', "Ringo is second");
    assert.equal(collection_observable().length, 3, "two view models");
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!");
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Paul', "Paul is second - sorting worked!");
    assert.equal(kb.utils.wrappedModel(collection_observable()[2]).get('name'), 'Ringo', "Ringo is third - sorting worked!");
    collection.remove('b2');
    collection.remove('b3');
    assert.equal(collection.length, 1, "one models");
    assert.equal(collection_observable().length, 1, "one view models");
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is left");
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Ringo', "Ringo is left");
    collection.reset();
    assert.equal(collection.length, 0, "no models");
    assert.equal(collection_observable().length, 0, "no view models");
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('9. Collection sync dynamically changing the sorting function', function(done) {
    var collection, collection_observable;
    kb.statistics = new kb.Statistics();
    collection = new kb.ContactsCollection();
    collection_observable = kb.collectionObservable(collection, {
      view_model: ContactViewModel
    });
    assert.equal(collection.length, 0, "no models");
    assert.equal(collection_observable().length, 0, "no view models");
    collection.add(new kb.Contact({
      id: 'b1',
      name: 'Ringo',
      number: '555-555-5556'
    }));
    collection.add(new kb.Contact({
      id: 'b2',
      name: 'George',
      number: '555-555-5555'
    }));
    assert.equal(collection.length, 2, "two models");
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first");
    assert.equal(collection.models[1].get('name'), 'George', "George is second");
    assert.equal(collection_observable().length, 2, "two view models");
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Ringo', "Ringo is first - no sorting");
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'George', "George is first - no sorting");
    collection_observable.sortAttribute('name');
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first");
    assert.equal(collection.models[1].get('name'), 'George', "George is second");
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!");
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Ringo', "Ringo is second - sorting worked!");
    collection.add(new kb.Contact({
      id: 'b3',
      name: 'Paul',
      number: '555-555-5554'
    }));
    assert.equal(collection.length, 3, "three models");
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first");
    assert.equal(collection.models[1].get('name'), 'George', "George is second");
    assert.equal(collection.models[2].get('name'), 'Paul', "Paul is second");
    assert.equal(collection_observable().length, 3, "two view models");
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'George', "George is first - sorting worked!");
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'Paul', "Paul is second - sorting worked!");
    assert.equal(kb.utils.wrappedModel(collection_observable()[2]).get('name'), 'Ringo', "Ringo is third - sorting worked!");
    collection_observable.sortAttribute('number');
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is first");
    assert.equal(collection.models[1].get('name'), 'George', "George is second");
    assert.equal(collection.models[2].get('name'), 'Paul', "Paul is second");
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Paul', "Paul is first - sorting worked!");
    assert.equal(kb.utils.wrappedModel(collection_observable()[1]).get('name'), 'George', "Paul is second - sorting worked!");
    assert.equal(kb.utils.wrappedModel(collection_observable()[2]).get('name'), 'Ringo', "Ringo is third - sorting worked!");
    collection_observable.sortAttribute('name');
    collection.remove('b2');
    collection.remove('b3');
    assert.equal(collection.length, 1, "one models");
    assert.equal(collection_observable().length, 1, "one view models");
    assert.equal(collection.models[0].get('name'), 'Ringo', "Ringo is left");
    assert.equal(kb.utils.wrappedModel(collection_observable()[0]).get('name'), 'Ringo', "Ringo is left");
    collection.reset();
    assert.equal(collection.length, 0, "no models");
    assert.equal(collection_observable().length, 0, "no view models");
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('10. Nested custom view models', function(done) {
    var ContactViewModelDate, george, george_birthdate, john, john_birthdate, major_duo, minor_duo, nested_view_model, paul, paul_birthdate, ringo, ringo_birthdate, validateContactViewModel, validateGenericViewModel, validateModel;
    kb.statistics = new kb.Statistics();
    ContactViewModelDate = (function(_super) {
      __extends(ContactViewModelDate, _super);

      function ContactViewModelDate(model, options) {
        ContactViewModelDate.__super__.constructor.call(this, model, _.extend({
          requires: ['date']
        }, options));
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
    nested_view_model = {
      major_duo1: kb.collectionObservable(major_duo),
      major_duo2: kb.collectionObservable(major_duo, {
        models_only: true
      }),
      major_duo3: kb.collectionObservable(major_duo, {
        view_model: kb.ViewModel
      }),
      major_duo4: kb.collectionObservable(major_duo, {
        view_model: ContactViewModelDate
      }),
      major_duo5: kb.collectionObservable(major_duo, {
        create: function(model, options) {
          return new ContactViewModelDate(model, options);
        }
      }),
      major_duo6: kb.collectionObservable(major_duo, {
        create: function(model, options) {
          if (model.get('name') === 'John') {
            return new ContactViewModelDate(model, options);
          } else {
            return kb.viewModel(model, options);
          }
        }
      }),
      minor_duo1: kb.collectionObservable(minor_duo, {
        factories: {}
      }),
      minor_duo2: kb.collectionObservable(minor_duo, {
        factories: {
          models: {
            models_only: true
          }
        }
      }),
      minor_duo3: kb.collectionObservable(minor_duo, {
        factories: {
          models: kb.ViewModel
        }
      }),
      minor_duo4: kb.collectionObservable(minor_duo, {
        factories: {
          models: {
            view_model: ContactViewModelDate
          }
        }
      }),
      minor_duo5: kb.collectionObservable(minor_duo, {
        factories: {
          models: {
            create: function(model, options) {
              return new ContactViewModelDate(model, options);
            }
          }
        }
      }),
      minor_duo6: kb.collectionObservable(minor_duo, {
        factories: {
          models: {
            create: function(model, options) {
              if (model.get('name') === 'George') {
                return new ContactViewModelDate(model, options);
              } else {
                return kb.viewModel(model, options);
              }
            }
          }
        }
      })
    };
    validateContactViewModel = function(view_model, name, birthdate) {
      var current_date, model;
      model = kb.utils.wrappedModel(view_model);
      assert.equal(view_model.name(), name, "" + name + ": Name matches");
      view_model.date(new Date(1963, 11, 10));
      current_date = model.get('date');
      assert.equal(current_date.getFullYear(), 1963, "" + name + ": year is good");
      assert.equal(current_date.getMonth(), 11, "" + name + ": month is good");
      assert.equal(current_date.getDate(), 10, "" + name + ": day is good");
      assert.equal(view_model.date().getFullYear(), 1963, "" + name + ": year is good");
      assert.equal(view_model.date().getMonth(), 11, "" + name + ": month is good");
      assert.equal(view_model.date().getDate(), 10, "" + name + ": day is good");
      model.set({
        date: new Date(birthdate.valueOf())
      });
      view_model.date(new Date(1940, 10, 10));
      current_date = model.get('date');
      assert.equal(current_date.getFullYear(), 1940, "" + name + ": year is good");
      assert.equal(current_date.getMonth(), 10, "" + name + ": month is good");
      assert.equal(current_date.getDate(), 10, "" + name + ": day is good");
      assert.equal(view_model.date().getFullYear(), 1940, "" + name + ": year is good");
      assert.equal(view_model.date().getMonth(), 10, "" + name + ": month is good");
      assert.equal(view_model.date().getDate(), 10, "" + name + ": day is good");
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
    validateGenericViewModel(nested_view_model.major_duo1()[0], 'John', john_birthdate);
    validateGenericViewModel(nested_view_model.major_duo1()[1], 'Paul', paul_birthdate);
    validateModel(nested_view_model.major_duo2()[0], 'John', john_birthdate);
    validateModel(nested_view_model.major_duo2()[1], 'Paul', paul_birthdate);
    validateGenericViewModel(nested_view_model.major_duo3()[0], 'John', john_birthdate);
    validateGenericViewModel(nested_view_model.major_duo3()[1], 'Paul', paul_birthdate);
    validateContactViewModel(nested_view_model.major_duo4()[0], 'John', john_birthdate);
    validateContactViewModel(nested_view_model.major_duo4()[1], 'Paul', paul_birthdate);
    validateContactViewModel(nested_view_model.major_duo5()[0], 'John', john_birthdate);
    validateContactViewModel(nested_view_model.major_duo5()[1], 'Paul', paul_birthdate);
    validateContactViewModel(nested_view_model.major_duo6()[0], 'John', john_birthdate);
    validateGenericViewModel(nested_view_model.major_duo6()[1], 'Paul', paul_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo1()[0], 'George', george_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo1()[1], 'Ringo', ringo_birthdate);
    validateModel(nested_view_model.minor_duo2()[0], 'George', george_birthdate);
    validateModel(nested_view_model.minor_duo2()[1], 'Ringo', ringo_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo3()[0], 'George', george_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo3()[1], 'Ringo', ringo_birthdate);
    validateContactViewModel(nested_view_model.minor_duo4()[0], 'George', george_birthdate);
    validateContactViewModel(nested_view_model.minor_duo4()[1], 'Ringo', ringo_birthdate);
    validateContactViewModel(nested_view_model.minor_duo5()[0], 'George', george_birthdate);
    validateContactViewModel(nested_view_model.minor_duo5()[1], 'Ringo', ringo_birthdate);
    validateContactViewModel(nested_view_model.minor_duo6()[0], 'George', george_birthdate);
    validateGenericViewModel(nested_view_model.minor_duo6()[1], 'Ringo', ringo_birthdate);
    kb.release(nested_view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('11. Shared Options', function(done) {
    var collection, collection_observable1, collection_observable2, collection_observable3;
    kb.statistics = new kb.Statistics();
    collection = new kb.Collection({
      id: 1,
      name: 'Bob'
    });
    collection_observable1 = kb.collectionObservable(collection);
    collection_observable2 = kb.collectionObservable(collection);
    collection_observable3 = kb.collectionObservable(collection, collection_observable1.shareOptions());
    assert.ok(collection_observable1()[0] !== collection_observable2()[0], 'not sharing');
    assert.ok(collection_observable1()[0] === collection_observable3()[0], 'sharing');
    kb.release([collection_observable1, collection_observable2, collection_observable3]);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('12. Filters option', function(done) {
    var collection, collection_observable1, collection_observable2, collection_observable3, collection_observable4, collection_observable5, collection_observable6, collection_observable7, observable1;
    kb.statistics = new kb.Statistics();
    collection = new kb.Collection([
      {
        id: 1,
        name: 'Bob'
      }, {
        id: 2,
        name: 'Fred'
      }, {
        id: 3,
        name: 'George'
      }
    ]);
    collection_observable1 = kb.collectionObservable(collection);
    collection_observable2 = kb.collectionObservable(collection, {
      filters: 1
    });
    collection_observable3 = kb.collectionObservable(collection, {
      filters: [2]
    });
    collection_observable4 = kb.collectionObservable(collection, {
      filters: 5
    });
    collection_observable5 = kb.collectionObservable(collection, {
      filters: [5]
    });
    collection_observable6 = kb.collectionObservable(collection, {
      filters: function(model) {
        return model.get('name') !== 'George';
      }
    });
    collection_observable7 = kb.collectionObservable(collection, {
      filters: [
        (function(model) {
          return model.get('name') !== 'Bob';
        }), (function(model) {
          return model.get('name') !== 'Fred';
        })
      ]
    });
    observable1 = ko.dependentObservable(function() {
      return _.filter(collection_observable6(), function(vm) {
        return vm.name() === 'Bob';
      });
    });
    assert.equal(_.map(_.pluck(collection_observable1(), 'name'), function(o) {
      return o();
    }).join(', '), 'Bob, Fred, George');
    assert.equal(_.map(_.pluck(collection_observable2(), 'name'), function(o) {
      return o();
    }).join(', '), 'Bob');
    assert.equal(_.map(_.pluck(collection_observable3(), 'name'), function(o) {
      return o();
    }).join(', '), 'Fred');
    assert.equal(_.map(_.pluck(collection_observable4(), 'name'), function(o) {
      return o();
    }).join(', '), '');
    assert.equal(_.map(_.pluck(collection_observable5(), 'name'), function(o) {
      return o();
    }).join(', '), '');
    assert.equal(_.map(_.pluck(collection_observable6(), 'name'), function(o) {
      return o();
    }).join(', '), 'Bob, Fred');
    assert.equal(_.map(_.pluck(collection_observable7(), 'name'), function(o) {
      return o();
    }).join(', '), 'George');
    assert.equal(_.map(_.pluck(observable1(), 'name'), function(o) {
      return o();
    }).join(', '), 'Bob');
    collection.add([
      {
        id: 4,
        name: 'Bob'
      }, {
        id: 5,
        name: 'Fred'
      }, {
        id: 6,
        name: 'George'
      }, {
        id: 7,
        name: 'Mary'
      }
    ]);
    assert.equal(_.map(_.pluck(collection_observable1(), 'name'), function(o) {
      return o();
    }).join(', '), 'Bob, Fred, George, Bob, Fred, George, Mary');
    assert.equal(_.map(_.pluck(collection_observable2(), 'name'), function(o) {
      return o();
    }).join(', '), 'Bob');
    assert.equal(_.map(_.pluck(collection_observable3(), 'name'), function(o) {
      return o();
    }).join(', '), 'Fred');
    assert.equal(_.map(_.pluck(collection_observable4(), 'name'), function(o) {
      return o();
    }).join(', '), 'Fred');
    assert.equal(_.map(_.pluck(collection_observable5(), 'name'), function(o) {
      return o();
    }).join(', '), 'Fred');
    assert.equal(_.map(_.pluck(collection_observable6(), 'name'), function(o) {
      return o();
    }).join(', '), 'Bob, Fred, Bob, Fred, Mary');
    assert.equal(_.map(_.pluck(collection_observable7(), 'name'), function(o) {
      return o();
    }).join(', '), 'George, George, Mary');
    assert.equal(_.map(_.pluck(observable1(), 'name'), function(o) {
      return o();
    }).join(', '), 'Bob, Bob');
    kb.release([collection_observable1, collection_observable2, collection_observable3, collection_observable4, collection_observable5, collection_observable6, collection_observable7, observable1]);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('13. Setting view models', function(done) {
    var SpecializedViewModel, collection, collection_observable, previous_view_model, store, view_models;
    kb.statistics = new kb.Statistics();
    collection = new kb.Collection([
      {
        id: 1,
        name: 'Bob'
      }, {
        id: 2,
        name: 'Fred'
      }, {
        id: 3,
        name: 'George'
      }
    ]);
    collection_observable = kb.collectionObservable(collection);
    view_models = _.map(collection.models, function(model) {
      return kb.viewModel(model);
    });
    previous_view_model = collection_observable()[0];
    collection_observable(view_models);
    assert.ok(collection_observable()[0] !== previous_view_model, 'view model updated');
    assert.ok(collection_observable()[0] === view_models[0], 'view model updated from new list');
    store = kb.utils.wrappedStore(collection_observable);
    store.compact();
    assert.ok(store.find(collection.models[0], kb.ViewModel) === view_models[0], 'view model was added to the store');
    assert.ok(store.find(collection.models[0], kb.ViewModel) !== previous_view_model, 'previous view model was removed from the store');
    kb.release(view_models);
    kb.release(collection_observable);
    SpecializedViewModel = (function(_super) {
      __extends(SpecializedViewModel, _super);

      function SpecializedViewModel() {
        return SpecializedViewModel.__super__.constructor.apply(this, arguments);
      }

      return SpecializedViewModel;

    })(kb.ViewModel);
    collection_observable = kb.collectionObservable(collection);
    view_models = _.map(collection.models, function(model) {
      return new SpecializedViewModel(model);
    });
    previous_view_model = collection_observable()[0];
    assert["throw"]((function() {
      return collection_observable(view_models);
    }));
    assert.ok(collection_observable()[0] !== previous_view_model, 'view model updated');
    assert.ok(collection_observable()[0] === view_models[0], 'view model updated from new list');
    store = kb.utils.wrappedStore(collection_observable);
    store.compact();
    assert.ok(store.find(collection.models[0], kb.ViewModel) !== view_models[0], 'view model was not added to the store');
    assert.ok(store.find(collection.models[0], kb.ViewModel) === previous_view_model, 'previous view model was not removed from the store');
    kb.release(view_models);
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('14. collection change is observable', function(done) {
    var collection, collection_observable, count;
    kb.statistics = new kb.Statistics();
    collection = new kb.Collection([
      {
        id: 1,
        name: 'Bob'
      }, {
        id: 2,
        name: 'Fred'
      }, {
        id: 3,
        name: 'George'
      }
    ]);
    collection_observable = kb.collectionObservable(collection);
    count = 0;
    ko.dependentObservable(function() {
      collection_observable.collection();
      return count++;
    });
    assert.ok(collection_observable()[0] instanceof kb.ViewModel, 'is a kb.ViewModel');
    collection_observable.collection(null);
    collection_observable.collection(collection);
    assert.equal(count, 3, "collection change was observed");
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('15. collection is generated if not passed (no options)', function(done) {
    var collection, collection_observable, count;
    kb.statistics = new kb.Statistics();
    collection_observable = kb.collectionObservable();
    collection = collection_observable.collection();
    collection.reset([
      {
        id: 1,
        name: 'Bob'
      }, {
        id: 2,
        name: 'Fred'
      }, {
        id: 3,
        name: 'George'
      }
    ]);
    count = 0;
    ko.dependentObservable(function() {
      collection_observable.collection();
      return count++;
    });
    assert.ok(collection_observable()[0] instanceof kb.ViewModel, 'is a kb.ViewModel');
    collection_observable.collection(null);
    collection_observable.collection(collection);
    assert.equal(count, 3, "collection change was observed");
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('16. collection is generated if not passed (options)', function(done) {
    var collection, collection_observable, count;
    kb.statistics = new kb.Statistics();
    collection_observable = kb.collectionObservable({
      view_model: ContactViewModel
    });
    collection = collection_observable.collection();
    collection.reset([
      {
        id: 1,
        name: 'Bob'
      }, {
        id: 2,
        name: 'Fred'
      }, {
        id: 3,
        name: 'George'
      }
    ]);
    count = 0;
    ko.dependentObservable(function() {
      collection_observable.collection();
      return count++;
    });
    assert.ok(collection_observable()[0] instanceof ContactViewModel, 'is a ContactViewModel');
    collection_observable.collection(null);
    collection_observable.collection(collection);
    assert.equal(count, 3, "collection change was observed");
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('16. collection changes do not cause dependencies inside ko.dependentObservable', function(done) {
    var collection, collection_observable, count_add, count_manual, count_remove, count_reset, model, observable_count, view_model;
    kb.statistics = new kb.Statistics();
    collection_observable = kb.collectionObservable({
      view_model: TestViewModel
    });
    collection = collection_observable.collection();
    count_manual = 0;
    ko.dependentObservable(function() {
      collection_observable([
        new TestViewModel(new kb.Model({
          id: 10,
          name: 'Manual'
        }))
      ]);
      return count_manual++;
    });
    count_reset = 0;
    ko.dependentObservable(function() {
      collection.reset([
        {
          id: 20,
          name: 'Reset1'
        }, {
          id: 21,
          name: 'Reset2'
        }
      ]);
      return count_reset++;
    });
    count_add = 0;
    ko.dependentObservable(function() {
      collection.add([
        {
          id: 30,
          name: 'Add1'
        }, {
          id: 31,
          name: 'Add2'
        }
      ]);
      return count_add++;
    });
    count_remove = 0;
    ko.dependentObservable(function() {
      collection.remove(collection.at(0));
      return count_remove++;
    });
    observable_count = 0;
    ko.dependentObservable(function() {
      collection_observable();
      return observable_count++;
    });
    assert.equal(count_manual, 1, 'count_manual');
    assert.equal(count_reset, 1, 'count_reset');
    assert.equal(count_add, 1, 'count_add');
    assert.equal(count_remove, 1, 'count_remove');
    assert.equal(observable_count, 1, 'observable_count');
    collection_observable([
      new TestViewModel(new kb.Model({
        id: 10,
        name: 'Manual'
      }))
    ]);
    collection.reset([
      {
        id: 20,
        name: 'Reset1'
      }, {
        id: 21,
        name: 'Reset2'
      }
    ]);
    collection.add([
      {
        id: 30,
        name: 'Add1'
      }, {
        id: 31,
        name: 'Add2'
      }
    ]);
    collection.remove(collection.at(0));
    assert.equal(count_manual, 1, 'count_manual');
    assert.equal(count_reset, 1, 'count_reset');
    assert.equal(count_add, 1, 'count_add');
    assert.equal(count_remove, 1, 'count_remove');
    assert.equal(observable_count, 6, 'observable_count');
    view_model = collection_observable()[0];
    model = view_model.model();
    model.set({
      name: 'Bob2'
    });
    assert.equal(view_model.name(), 'Bob2');
    view_model.test('world');
    assert.equal(view_model.test(), 'world');
    assert.equal(count_manual, 1, 'count_manual');
    assert.equal(count_reset, 1, 'count_reset');
    assert.equal(count_add, 1, 'count_add');
    assert.equal(count_remove, 1, 'count_remove');
    assert.equal(observable_count, 6, 'observable_count');
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('17. Test auto-generate collections', function(done) {
    var PersonViewModel, collection_observable, id, models, view_models, _i, _len, _ref;
    kb.statistics = new kb.Statistics();
    models = (function() {
      var _i, _results;
      _results = [];
      for (id = _i = 1; _i <= 4; id = ++_i) {
        _results.push(new kb.Contact({
          id: id
        }));
      }
      return _results;
    })();
    PersonViewModel = (function(_super) {
      __extends(PersonViewModel, _super);

      function PersonViewModel() {
        return PersonViewModel.__super__.constructor.apply(this, arguments);
      }

      return PersonViewModel;

    })(kb.ViewModel);
    collection_observable = kb.collectionObservable({
      view_model: PersonViewModel
    });
    collection_observable.collection().reset(models);
    assert.equal(collection_observable.collection().length, 4);
    _ref = collection_observable();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view_models = _ref[_i];
      assert.ok(!!view_models.date());
      assert.ok(view_models.model() instanceof kb.Contact);
    }
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('18. Test auto-generate collections with model array', function(done) {
    var PersonViewModel, collection_observable, id, models, view_models, _i, _len, _ref;
    kb.statistics = new kb.Statistics();
    models = (function() {
      var _i, _results;
      _results = [];
      for (id = _i = 1; _i <= 4; id = ++_i) {
        _results.push(new kb.Contact({
          id: id
        }));
      }
      return _results;
    })();
    PersonViewModel = (function(_super) {
      __extends(PersonViewModel, _super);

      function PersonViewModel() {
        return PersonViewModel.__super__.constructor.apply(this, arguments);
      }

      return PersonViewModel;

    })(kb.ViewModel);
    collection_observable = kb.collectionObservable(models, {
      view_model: PersonViewModel
    });
    assert.equal(collection_observable.collection().length, 4);
    _ref = collection_observable();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view_models = _ref[_i];
      assert.ok(!!view_models.date());
      assert.ok(view_models.model() instanceof kb.Contact);
    }
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('19. push and unshift', function(done) {
    var PersonViewModel, collection_observable;
    kb.statistics = new kb.Statistics();
    PersonViewModel = (function(_super) {
      __extends(PersonViewModel, _super);

      function PersonViewModel() {
        return PersonViewModel.__super__.constructor.apply(this, arguments);
      }

      return PersonViewModel;

    })(kb.ViewModel);
    collection_observable = kb.collectionObservable(new kb.ContactsCollection(), {
      view_model: PersonViewModel
    });
    if (collection_observable.collection().push) {
      collection_observable.collection().push();
      assert.equal(collection_observable.collection().length, 0);
      assert.equal(collection_observable().length, 0);
      collection_observable.collection().push(null);
      assert.equal(collection_observable.collection().length, 0);
      assert.equal(collection_observable().length, 0);
      collection_observable.collection().push(new kb.Contact());
      assert.equal(collection_observable.collection().length, 1);
      assert.equal(collection_observable().length, 1);
      collection_observable.collection().reset();
      assert.equal(collection_observable.collection().length, 0);
      assert.equal(collection_observable().length, 0);
    }
    if (collection_observable.collection().unshift) {
      collection_observable.collection().unshift();
      assert.equal(collection_observable.collection().length, 0);
      assert.equal(collection_observable().length, 0);
      collection_observable.collection().unshift(null);
      assert.equal(collection_observable.collection().length, 0);
      assert.equal(collection_observable().length, 0);
      collection_observable.collection().unshift(new kb.Contact());
      assert.equal(collection_observable.collection().length, 1);
      assert.equal(collection_observable().length, 1);
      collection_observable.collection().reset();
      assert.equal(collection_observable.collection().length, 0);
      assert.equal(collection_observable().length, 0);
    }
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  return it('20. Auto compact for collections', function(done) {
    var PersonViewModel, collection_observable, id, models, new_view_models, previous_view_models, vm, _i, _j, _len, _len1;
    kb.statistics = new kb.Statistics();
    models = (function() {
      var _i, _results;
      _results = [];
      for (id = _i = 1; _i <= 4; id = ++_i) {
        _results.push(new kb.Contact({
          id: id
        }));
      }
      return _results;
    })();
    PersonViewModel = (function(_super) {
      __extends(PersonViewModel, _super);

      function PersonViewModel() {
        return PersonViewModel.__super__.constructor.apply(this, arguments);
      }

      return PersonViewModel;

    })(kb.ViewModel);
    collection_observable = kb.collectionObservable(models, {
      view_model: PersonViewModel,
      auto_compact: true
    });
    assert.equal(collection_observable.collection().length, 4);
    previous_view_models = collection_observable().slice();
    assert.equal(previous_view_models.length, 4);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'ViewModel: 4\n CollectionObservable: 1', "Expected stats");
    collection_observable.collection().add(new kb.Contact({
      id: 5
    }));
    new_view_models = collection_observable();
    assert.equal(new_view_models.length, 5);
    assert.equal(previous_view_models.length, 4);
    for (_i = 0, _len = new_view_models.length; _i < _len; _i++) {
      vm = new_view_models[_i];
      if (vm.model() === collection_observable.collection().models[4]) {
        assert.ok(!(__indexOf.call(previous_view_models, vm) >= 0));
      } else {
        assert.ok(__indexOf.call(previous_view_models, vm) >= 0);
      }
    }
    models = collection_observable.collection().models.slice();
    collection_observable.collection().reset(models);
    new_view_models = collection_observable();
    assert.equal(new_view_models.length, 5);
    assert.equal(previous_view_models.length, 4);
    for (_j = 0, _len1 = new_view_models.length; _j < _len1; _j++) {
      vm = new_view_models[_j];
      assert.ok(!(__indexOf.call(previous_view_models, vm) >= 0));
    }
    kb.release(collection_observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
});
