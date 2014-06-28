var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

describe('knockback-view-model.js', function() {
  var TestViewModel, kb, ko, _;
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
  if (!ko.computed) {
    ko.computed = ko.dependentObservable;
  }
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
  it('1. Standard use case: read and write', function(done) {
    var model, view_model;
    kb.statistics = new kb.Statistics();
    model = new kb.Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = kb.viewModel(model);
    assert.equal(view_model.name(), 'Ringo', "Interesting name");
    assert.equal(view_model.number(), '555-555-5556', "Not so interesting number");
    view_model.number('9222-222-222');
    assert.equal(model.get('number'), '9222-222-222', "Number was changed");
    assert.equal(view_model.number(), '9222-222-222', "Number was changed");
    model.set({
      name: 'Starr',
      number: 'XXX-XXX-XXXX'
    });
    assert.equal(view_model.name(), 'Starr', "Name changed");
    assert.equal(view_model.number(), 'XXX-XXX-XXXX', "Number was changed");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('2. Using Coffeescript classes', function(done) {
    var ContactViewModelCustom, model, view_model;
    kb.statistics = new kb.Statistics();
    ContactViewModelCustom = (function(_super) {
      __extends(ContactViewModelCustom, _super);

      function ContactViewModelCustom(model) {
        ContactViewModelCustom.__super__.constructor.call(this, model, {
          internals: ['name', 'number']
        });
        this.name = ko.dependentObservable((function(_this) {
          return function() {
            return "First: " + (_this._name());
          };
        })(this));
      }

      return ContactViewModelCustom;

    })(kb.ViewModel);
    model = new kb.Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = new ContactViewModelCustom(model);
    assert.equal(view_model._name(), 'Ringo', "Interesting name");
    assert.equal(view_model.name(), 'First: Ringo', "Interesting name");
    model.set({
      name: 'Starr'
    });
    assert.equal(view_model._name(), 'Starr', "Name changed");
    assert.equal(view_model.name(), 'First: Starr', "Name changed");
    view_model._name('Ringo');
    assert.equal(view_model._name(), 'Ringo', "Interesting name");
    assert.equal(view_model.name(), 'First: Ringo', "Interesting name");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('3. Using simple Javascript classes', function(done) {
    var ContactViewModelCustom, model, view_model;
    kb.statistics = new kb.Statistics();
    ContactViewModelCustom = function(model) {
      var view_model;
      view_model = kb.viewModel(model);
      view_model.formatted_name = kb.observable(model, {
        key: 'name',
        read: function() {
          return "First: " + (model.get('name'));
        }
      });
      view_model.formatted_number = kb.observable(model, {
        key: 'number',
        read: function() {
          return "#: " + (model.get('number'));
        },
        write: function(value) {
          return model.set({
            number: value.substring(3)
          });
        }
      }, view_model);
      return view_model;
    };
    model = new kb.Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = new ContactViewModelCustom(model);
    assert.equal(view_model.name(), 'Ringo', "Interesting name");
    assert.equal(view_model.formatted_name(), 'First: Ringo', "Interesting name");
    assert.equal(view_model.number(), '555-555-5556', "Not so interesting number");
    assert.equal(view_model.formatted_number(), '#: 555-555-5556', "Not so interesting number");
    view_model.formatted_number('#: 9222-222-222');
    assert.equal(model.get('number'), '9222-222-222', "Number was changed");
    assert.equal(view_model.number(), '9222-222-222', "Number was changed");
    assert.equal(view_model.formatted_number(), '#: 9222-222-222', "Number was changed");
    model.set({
      name: 'Starr',
      number: 'XXX-XXX-XXXX'
    });
    assert.equal(view_model.name(), 'Starr', "Name changed");
    assert.equal(view_model.formatted_name(), 'First: Starr', "Name changed");
    assert.equal(view_model.number(), 'XXX-XXX-XXXX', "Number was changed");
    assert.equal(view_model.formatted_number(), '#: XXX-XXX-XXXX', "Number was changed");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('4. requires', function(done) {
    var ContactViewModelFullName, ContactViewModelFullName2, model, view_model;
    kb.statistics = new kb.Statistics();
    ContactViewModelFullName = (function(_super) {
      __extends(ContactViewModelFullName, _super);

      function ContactViewModelFullName(model) {
        ContactViewModelFullName.__super__.constructor.call(this, model, {
          requires: ['first', 'last']
        });
        this.full_name = ko.dependentObservable((function(_this) {
          return function() {
            return "Last: " + (_this.last()) + ", First: " + (_this.first());
          };
        })(this));
      }

      return ContactViewModelFullName;

    })(kb.ViewModel);
    model = new kb.Model();
    view_model = new ContactViewModelFullName(model);
    assert.equal(view_model.full_name(), 'Last: null, First: null', "full name is good");
    model.set({
      first: 'Ringo',
      last: 'Starr'
    });
    assert.equal(view_model.full_name(), 'Last: Starr, First: Ringo', "full name is good");
    model.set({
      first: 'Bongo'
    });
    assert.equal(view_model.full_name(), 'Last: Starr, First: Bongo', "full name is good");
    kb.release(view_model);
    ContactViewModelFullName2 = (function(_super) {
      __extends(ContactViewModelFullName2, _super);

      function ContactViewModelFullName2(model) {
        ContactViewModelFullName2.__super__.constructor.call(this, model, {
          requires: 'first'
        });
        this.last = kb.observable(model, 'last');
        this.full_name = ko.dependentObservable((function(_this) {
          return function() {
            return "Last: " + (_this.last()) + ", First: " + (_this.first());
          };
        })(this));
      }

      return ContactViewModelFullName2;

    })(kb.ViewModel);
    model = new kb.Model();
    view_model = new ContactViewModelFullName2(model);
    assert.equal(view_model.full_name(), 'Last: null, First: null', "full name is good");
    model.set({
      first: 'Ringo',
      last: 'Starr'
    });
    assert.equal(view_model.full_name(), 'Last: Starr, First: Ringo', "full name is good");
    model.set({
      first: 'Bongo'
    });
    assert.equal(view_model.full_name(), 'Last: Starr, First: Bongo', "full name is good");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('5. reference counting and custom __destroy (Coffeescript inheritance)', function(done) {
    var ContactViewModelFullName, model, view_model;
    kb.statistics = new kb.Statistics();
    ContactViewModelFullName = (function(_super) {
      __extends(ContactViewModelFullName, _super);

      function ContactViewModelFullName(model) {
        ContactViewModelFullName.__super__.constructor.call(this, model, {
          requires: ['first', 'last']
        });
        this.is_destroyed = false;
        this.ref_count = 1;
        this.super_destroy = this.destroy;
        this.destroy = null;
        this.is_destroyed = false;
      }

      ContactViewModelFullName.prototype.retain = function() {
        return this.ref_count++;
      };

      ContactViewModelFullName.prototype.refCount = function() {
        return this.ref_count;
      };

      ContactViewModelFullName.prototype.release = function() {
        --this.ref_count;
        if (this.ref_count < 0) {
          throw new Error('ref count is corrupt');
        }
        if (this.ref_count) {
          return;
        }
        this.is_destroyed = true;
        return this.super_destroy();
      };

      return ContactViewModelFullName;

    })(kb.ViewModel);
    model = new kb.Model({
      first: "Hello"
    });
    view_model = new ContactViewModelFullName(model);
    assert.equal(view_model.first(), "Hello", "Hello exists");
    view_model.retain();
    assert.equal(view_model.refCount(), 2, "ref count 2");
    assert.equal(view_model.is_destroyed, false, "not destroyed");
    view_model.release();
    assert.equal(view_model.refCount(), 1, "ref count 1");
    assert.equal(view_model.is_destroyed, false, "not destroyed");
    kb.release(view_model);
    assert.equal(view_model.refCount(), 0, "ref count 0");
    assert.equal(view_model.is_destroyed, true, "is destroyed using overridden destroy function");
    assert.ok(!view_model.first, "Hello doesn't exist anymore");
    assert["throw"]((function() {
      return view_model.release();
    }), Error, "ref count is corrupt");
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('6. reference counting and custom __destroy (Javascript inheritance)', function(done) {
    var ContactViewModelFullName, model, view_model;
    kb.statistics = new kb.Statistics();
    ContactViewModelFullName = kb.ViewModel.extend({
      constructor: function(model) {
        kb.ViewModel.prototype.constructor.call(this, model, {
          requires: ['first', 'last']
        });
        this.ref_count = 1;
        this.super_destroy = this.destroy;
        this.destroy = null;
        return this.is_destroyed = false;
      },
      retain: function() {
        return this.ref_count++;
      },
      refCount: function() {
        return this.ref_count;
      },
      release: function() {
        --this.ref_count;
        if (this.ref_count < 0) {
          throw new Error("ref count is corrupt");
        }
        if (this.ref_count) {
          return;
        }
        this.is_destroyed = true;
        return this.super_destroy();
      }
    });
    model = new kb.Model({
      first: "Hello"
    });
    view_model = new ContactViewModelFullName(model);
    assert.equal(view_model.first(), "Hello", "Hello exists");
    view_model.retain();
    assert.equal(view_model.refCount(), 2, "ref count 2");
    assert.equal(view_model.is_destroyed, false, "not destroyed");
    view_model.release();
    assert.equal(view_model.refCount(), 1, "ref count 1");
    assert.equal(view_model.is_destroyed, false, "not destroyed");
    kb.release(view_model);
    assert.equal(view_model.refCount(), 0, "ref count 0");
    assert.equal(view_model.is_destroyed, true, "is destroyed using overridden destroy function");
    assert.ok(!view_model.first, "Hello doesn't exist anymore");
    assert["throw"]((function() {
      return view_model.release();
    }), Error, "ref count is corrupt");
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('7. Nested custom view models', function(done) {
    var ContactViewModelDate, george, george_birthdate, john, john_birthdate, major_duo, minor_duo, nested_model, nested_view_model, paul, paul_birthdate, ringo, ringo_birthdate, validateContactViewModel, validateGenericViewModel, validateModel;
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
  it('8. Changing attribute types', function(done) {
    var model, view_model;
    kb.statistics = new kb.Statistics();
    model = new kb.Model({
      reused: null
    });
    view_model = kb.viewModel(model);
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_SIMPLE, 'reused is kb.TYPE_SIMPLE');
    model.set({
      reused: new kb.Model()
    });
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_MODEL, 'reused is kb.TYPE_MODEL');
    model.set({
      reused: new kb.Collection()
    });
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_COLLECTION, 'reused is kb.TYPE_COLLECTION');
    model.set({
      reused: null
    });
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_COLLECTION, 'reused is retains type of kb.TYPE_COLLECTION');
    kb.release(view_model);
    view_model = kb.viewModel(model, {
      factories: {
        reused: function(obj, options) {
          if (obj instanceof kb.Collection) {
            return kb.collectionObservable(obj, options);
          } else {
            return kb.viewModel(obj, options);
          }
        }
      }
    });
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_MODEL, 'reused is kb.TYPE_MODEL');
    model.set({
      reused: new kb.Model()
    });
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_MODEL, 'reused is kb.TYPE_MODEL');
    model.set({
      reused: new kb.Collection()
    });
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_COLLECTION, 'reused is kb.TYPE_COLLECTION');
    model.set({
      reused: null
    });
    assert.equal(kb.utils.valueType(view_model.reused), kb.TYPE_COLLECTION, 'reused retains type of kb.TYPE_COLLECTION');
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('9. Shared Options', function(done) {
    var model1, model2, model3, view_model1, view_model2, view_model3;
    kb.statistics = new kb.Statistics();
    model1 = new kb.Model({
      id: 1,
      name: 'Bob'
    });
    model2 = new kb.Model({
      id: 1,
      name: 'Bob'
    });
    model3 = new kb.Model({
      id: 1,
      name: 'Bob'
    });
    view_model1 = kb.viewModel(model1);
    view_model2 = kb.viewModel(model2);
    view_model3 = kb.viewModel(model3, view_model1.shareOptions());
    assert.ok((view_model1.name !== view_model2.name) && (view_model1.name() === view_model2.name()), 'not sharing');
    assert.ok((view_model1.name !== view_model3.name) && (view_model1.name() === view_model3.name()), 'sharing');
    kb.release([view_model1, view_model2, view_model3]);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('10. Options', function(done) {
    var view_model;
    kb.statistics = new kb.Statistics();
    view_model = kb.viewModel(new kb.Model({
      name: 'Bob'
    }), {
      keys: ['name', 'date']
    });
    assert.equal(view_model.name(), 'Bob', 'keys: Bob');
    assert.ok(view_model.date, 'keys: date');
    assert.equal(view_model.date(), null, 'keys: date fn');
    kb.release(view_model);
    view_model = kb.viewModel(new kb.Model({
      name: 'Bob'
    }), {
      keys: 'date'
    });
    assert.ok(view_model.date, 'keys: date');
    assert.equal(view_model.date(), null, 'keys: date fn');
    kb.release(view_model);
    view_model = kb.viewModel(new kb.Model({
      name: 'Bob'
    }), {
      keys: {
        name: {},
        date: {}
      }
    });
    assert.equal(view_model.name(), 'Bob', 'keys: Bob');
    assert.ok(view_model.date, 'keys: date');
    assert.equal(view_model.date(), null, 'keys: date fn');
    kb.release(view_model);
    view_model = kb.viewModel(new kb.Model({
      name: 'Bob',
      date: new Date()
    }), {
      excludes: ['date']
    });
    assert.equal(view_model.name(), 'Bob', 'excludes: Bob');
    assert.ok(!view_model.date, 'excludes: date');
    kb.release(view_model);
    view_model = kb.viewModel(new kb.Model({
      name: 'Bob',
      date: new Date()
    }), {
      excludes: 'date'
    });
    assert.equal(view_model.name(), 'Bob', 'excludes: Bob');
    assert.ok(!view_model.date, 'excludes: date');
    kb.release(view_model);
    view_model = kb.viewModel(new kb.Model(), {
      requires: ['name']
    });
    assert.equal(view_model.name(), null, 'requires: name');
    assert.ok(!view_model.date, 'requires: date');
    kb.release(view_model);
    view_model = kb.viewModel(new kb.Model(), {
      requires: 'name'
    });
    assert.equal(view_model.name(), null, 'requires: name');
    assert.ok(!view_model.date, 'requires: date');
    kb.release(view_model);
    view_model = kb.viewModel(new kb.Model(), {
      internals: ['name']
    });
    assert.equal(view_model._name(), null, 'internals: name');
    assert.ok(!view_model.date, 'internals: date');
    kb.release(view_model);
    view_model = kb.viewModel(new kb.Model(), {
      internals: 'name'
    });
    assert.equal(view_model._name(), null, 'internals: name');
    assert.ok(!view_model.date, 'internals: date');
    kb.release(view_model);
    view_model = kb.viewModel(new kb.Model(), {
      mappings: {
        name: {}
      }
    });
    assert.equal(view_model.name(), null, 'mappings: name');
    assert.ok(!view_model.date, 'mappings: date');
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('11. array attributes', function(done) {
    var model, view_model;
    model = new kb.Model({
      text: ["heading.get these rewards"],
      widget: ["sign_up", "rewards"],
      model_data: {
        reward: {
          top_rewards: {
            properties: ["title", "description", "num_points"],
            query: {
              type: "active",
              limit: 6
            }
          }
        }
      }
    });
    view_model = kb.viewModel(model);
    assert.ok(_.isEqual(view_model.text(), ["heading.get these rewards"]), 'text observable matches');
    assert.ok(_.isEqual(view_model.widget(), ["sign_up", "rewards"]), 'widget observable matches');
    assert.ok(_.isEqual(view_model.model_data().reward.top_rewards.properties, ["title", "description", "num_points"]), 'model_data observable matches');
    return done();
  });
  it('12. model change is observable', function(done) {
    var count, model, view_model;
    kb.statistics = new kb.Statistics();
    model = new kb.Model({
      id: 1,
      name: 'Bob'
    });
    view_model = kb.viewModel(model);
    count = 0;
    ko.dependentObservable(function() {
      view_model.model();
      return count++;
    });
    view_model.model(null);
    view_model.model(model);
    assert.equal(count, 3, "model change was observed");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('13. model replacement', function(done) {
    var Model, model1, model2, model_opts, view_model;
    kb.statistics = new kb.Statistics();
    model_opts = {
      attributes: {
        prop: 1
      },
      defaults: {
        prop: 1
      }
    };
    Model = kb.Parse ? kb.Model.extend('Model', model_opts) : kb.Model.extend(model_opts);
    model1 = new Model;
    view_model = kb.viewModel(model1);
    assert.equal(view_model.prop(), 1, "sanity check");
    model2 = new Model({
      prop: 2
    });
    assert.equal(model2.get('prop'), 2, "sanity check 2");
    view_model.model(model2);
    assert.equal(model2.get('prop'), 2, "switched in model shouldn't inherit values from previous model");
    assert.equal(view_model.prop(), 2, "view model should have the value of the switched in model");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('14. model replacement with select', function(done) {
    var Model, el, model1, model2, model_opts, view_model, widget;
    kb.statistics = new kb.Statistics();
    model_opts = {
      attributes: {
        prop: 1
      },
      defaults: {
        prop: 1
      }
    };
    Model = kb.Parse ? kb.Model.extend('Model', model_opts) : kb.Model.extend(model_opts);
    model1 = new Model;
    view_model = kb.viewModel(model1);
    el = $('<div id="the_template1">\n  <select data-bind="value: prop">\n      <option value="" selected>---</option>\n      <option value="1">1</option>\n      <option value="2">2</option>\n  </select>\n</div>');
    $('body').append(el);
    widget = el.find('select');
    assert.equal(widget.val(), "", "select should be empty to start with");
    ko.applyBindings(view_model, el.get(0));
    assert.equal(widget.val(), "1", "select should be equal to the model after bindings applied");
    model2 = new Model({
      prop: 2
    });
    assert.equal(model2.get('prop'), 2, "sanity check 2");
    view_model.model(model2);
    assert.equal(widget.val(), 2, "model sets the select");
    assert.equal(model2.get('prop'), 2, "switched in model shouldn't inherit values from previous model");
    assert.equal(view_model.model(), model2, "view_model.model should be the same as the new model");
    assert.equal(view_model.prop(), 2, "view model should have the value of the switched in model");
    el.remove();
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('16. model replacement with input', function(done) {
    var Model, el, model1, model2, model_opts, view_model, widget;
    kb.statistics = new kb.Statistics();
    model_opts = {
      attributes: {
        prop: 1
      },
      defaults: {
        prop: 1
      }
    };
    Model = kb.Parse ? kb.Model.extend('Model', model_opts) : kb.Model.extend(model_opts);
    model1 = new Model;
    view_model = kb.viewModel(model1);
    el = $('<div id="the_template1">\n  <input data-bind="value: prop" />\n</div>');
    $('body').append(el);
    widget = el.find('input');
    assert.equal(widget.val(), "", "input should be empty to start with");
    ko.applyBindings(view_model, el.get(0));
    assert.equal(widget.val(), "1", "input should be equal to the model after bindings applied");
    model2 = new Model({
      prop: 2
    });
    assert.equal(model2.get('prop'), 2, "sanity check 2");
    view_model.model(model2);
    assert.equal(widget.val(), 2, "model sets the select");
    assert.equal(model2.get('prop'), 2, "switched in model shouldn't inherit values from previous model");
    assert.equal(view_model.model(), model2, "view_model.model should be the same as the new model");
    assert.equal(view_model.prop(), 2, "view model should have the value of the switched in model");
    el.remove();
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('17. model replacement with multiple selects and weird backbone bug', function(done) {
    var Model, default_attrs, el, model1, model2, model_opts, view_model, widget1, widget2;
    kb.statistics = new kb.Statistics();
    default_attrs = {
      prop1: "p1-wrong",
      prop2: "p2-wrong"
    };
    model_opts = {
      attributes: default_attrs,
      defaults: default_attrs
    };
    Model = kb.Parse ? kb.Model.extend('Model', model_opts) : kb.Model.extend(model_opts);
    model1 = new Model;
    view_model = kb.viewModel(model1);
    el = $('<div id="the_template1">\n  <select id="prop1" data-bind="value: prop1">\n      <option value="p1-wrong" selected>WRONG</option>\n      <option value="p1-right">RIGHT</option>\n  </select>\n  <select id="prop2" data-bind="value: prop2">\n      <option value="p2-wrong" selected>WRONG</option>\n      <option value="p2-right">RIGHT</option>\n  </select>\n</div>');
    $('body').append(el);
    widget1 = el.find('#prop1');
    widget2 = el.find('#prop2');
    assert.equal(widget1.val(), "p1-wrong", "select should be first value to start with");
    assert.equal(widget2.val(), "p2-wrong", "select should be first value to start with");
    ko.applyBindings(view_model, el.get(0));
    assert.equal(widget1.val(), "p1-wrong", "select should be equal to the model after bindings applied");
    assert.equal(widget2.val(), "p2-wrong", "select should be equal to the model after bindings applied");
    model2 = new Model({
      DUMMY: "",
      prop1: "p1-right",
      prop2: "p2-right"
    });
    assert.equal(model2.get('prop1'), 'p1-right', "sanity check 2");
    assert.equal(model2.get('prop2'), 'p2-right', "sanity check 3");
    view_model.model(model2);
    assert.equal(widget1.val(), 'p1-right', "model sets the select");
    assert.equal(widget2.val(), 'p2-right', "model sets the select");
    assert.equal(model2.get('prop1'), 'p1-right', "switched in model shouldn't inherit values from previous model");
    assert.equal(model2.get('prop2'), 'p2-right', "switched in model shouldn't inherit values from previous model");
    assert.equal(view_model.model(), model2, "view_model.model should be the same as the new model");
    assert.equal(view_model.prop1(), 'p1-right', "view model should have the value of the switched in model");
    assert.equal(view_model.prop2(), 'p2-right', "view model should have the value of the switched in model");
    el.remove();
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('18. can merge unique options', function(done) {
    var collapsed_options, options;
    options = {
      internals: ['internal1'],
      keys: ['key1'],
      factories: {
        models: function() {}
      },
      options: {
        requires: 'require2',
        keys: ['key2'],
        excludes: 'exclude2',
        options: {
          excludes: ['exclude3'],
          factories: {
            'collection.models': function() {}
          }
        }
      }
    };
    collapsed_options = kb.utils.collapseOptions(options);
    assert.deepEqual(collapsed_options.internals, ['internal1']);
    assert.deepEqual(collapsed_options.keys, ['key1', 'key2']);
    assert.deepEqual(_.keys(collapsed_options.factories), ['models', 'collection.models']);
    assert.deepEqual(collapsed_options.excludes, ['exclude2', 'exclude3']);
    return done();
  });
  it('19. can merge non-unique options', function(done) {
    var collapsed_options, factory, factoryOverride, options;
    factoryOverride = function() {};
    factory = function() {};
    options = {
      internals: ['internal1'],
      keys: ['key1'],
      factories: {
        models: factory
      },
      options: {
        requires: 'require1',
        keys: ['key1'],
        excludes: 'exclude1',
        options: {
          excludes: ['exclude1'],
          factories: {
            models: factoryOverride
          }
        }
      }
    };
    collapsed_options = kb.utils.collapseOptions(options);
    assert.deepEqual(collapsed_options.internals, ['internal1']);
    assert.deepEqual(collapsed_options.keys, ['key1']);
    assert.deepEqual(_.keys(collapsed_options.factories), ['models']);
    assert.equal(collapsed_options.factories.models, factoryOverride, 'selected overidden factory');
    assert.notEqual(collapsed_options.factories.models, factory, 'did not select original factory');
    assert.deepEqual(collapsed_options.excludes, ['exclude1']);
    return done();
  });
  it('20. can merge keys as object', function(done) {
    var collapsed_options, options;
    options = {
      keys: {
        name: {
          key: 'name'
        }
      },
      options: {
        keys: {
          thing: {
            key: 'thing'
          }
        }
      }
    };
    collapsed_options = kb.utils.collapseOptions(options);
    assert.deepEqual(collapsed_options.keys, {
      name: {
        key: 'name'
      },
      thing: {
        key: 'thing'
      }
    });
    options = {
      keys: 'name',
      options: {
        keys: {
          thing: {
            key: 'thing'
          }
        }
      }
    };
    collapsed_options = kb.utils.collapseOptions(options);
    assert.deepEqual(collapsed_options.keys, {
      name: {
        key: 'name'
      },
      thing: {
        key: 'thing'
      }
    });
    options = {
      keys: ['name'],
      options: {
        keys: {
          thing: {
            key: 'thing'
          }
        }
      }
    };
    collapsed_options = kb.utils.collapseOptions(options);
    assert.deepEqual(collapsed_options.keys, {
      name: {
        key: 'name'
      },
      thing: {
        key: 'thing'
      }
    });
    options = {
      keys: {
        name: {
          key: 'name'
        }
      },
      options: {
        keys: 'thing'
      }
    };
    collapsed_options = kb.utils.collapseOptions(options);
    assert.deepEqual(collapsed_options.keys, {
      name: {
        key: 'name'
      },
      thing: {
        key: 'thing'
      }
    });
    options = {
      keys: {
        name: {
          key: 'name'
        }
      },
      options: {
        keys: ['thing']
      }
    };
    collapsed_options = kb.utils.collapseOptions(options);
    assert.deepEqual(collapsed_options.keys, {
      name: {
        key: 'name'
      },
      thing: {
        key: 'thing'
      }
    });
    return done();
  });
  it('21. view model changes do not cause dependencies inside ko.dependentObservable', function(done) {
    var count_manual, count_set_collection, count_set_existing, count_set_model, count_set_new, model, observable_count, view_model;
    kb.statistics = new kb.Statistics();
    view_model = new TestViewModel(new kb.Model({
      id: 1,
      name: 'Initial'
    }));
    model = view_model.model();
    count_manual = 0;
    ko.dependentObservable(function() {
      view_model.model(new kb.Model({
        id: 10,
        name: 'Manual'
      }));
      return count_manual++;
    });
    count_set_existing = 0;
    ko.dependentObservable(function() {
      model.set({
        name: 'Existing'
      });
      return count_set_existing++;
    });
    count_set_new = 0;
    ko.dependentObservable(function() {
      model.set({
        new_attribute: 'New'
      });
      return count_set_new++;
    });
    count_set_model = 0;
    ko.dependentObservable(function() {
      model.set({
        model: new kb.Model({
          name: 'NestedModel'
        })
      });
      return count_set_model++;
    });
    count_set_collection = 0;
    ko.dependentObservable(function() {
      model.set({
        collection: new kb.Collection([
          {
            name: 'NestedModel'
          }
        ])
      });
      return count_set_collection++;
    });
    observable_count = 0;
    ko.dependentObservable(function() {
      view_model.model();
      return observable_count++;
    });
    assert.equal(count_manual, 1, 'count_manual');
    assert.equal(count_set_existing, 1, 'count_set_existing');
    assert.equal(count_set_new, 1, 'count_set_new');
    assert.equal(count_set_model, 1, 'count_set_model');
    assert.equal(count_set_collection, 1, 'count_set_collection');
    assert.equal(observable_count, 1, 'observable_count');
    view_model.model(new kb.Model({
      id: 10,
      name: 'Manual'
    }));
    model.set({
      name: 'Existing'
    });
    model.set({
      new_attribute: 'New'
    });
    model.set({
      model: new kb.Model({
        name: 'NestedModel'
      })
    });
    model.set({
      collection: new kb.Collection([
        {
          name: 'NestedModel'
        }
      ])
    });
    assert.equal(count_manual, 1, 'count_manual');
    assert.equal(count_set_existing, 1, 'count_set_existing');
    assert.equal(count_set_new, 1, 'count_set_new');
    assert.equal(count_set_model, 1, 'count_set_model');
    assert.equal(count_set_collection, 1, 'count_set_collection');
    assert.equal(observable_count, 2, 'observable_count');
    model = view_model.model();
    model.set({
      name: 'Bob2'
    });
    assert.equal(view_model.name(), 'Bob2');
    view_model.test('world');
    assert.equal(view_model.test(), 'world');
    assert.equal(count_manual, 1, 'count_manual');
    assert.equal(count_set_existing, 1, 'count_set_existing');
    assert.equal(count_set_new, 1, 'count_set_new');
    assert.equal(count_set_model, 1, 'count_set_model');
    assert.equal(count_set_collection, 1, 'count_set_collection');
    assert.equal(observable_count, 2, 'observable_count');
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('22. statics and static defaults keyword', function(done) {
    var view_model;
    kb.statistics = new kb.Statistics();
    view_model = new kb.ViewModel(new kb.Model({
      id: 1,
      name: 'Initial',
      date: new Date()
    }), {
      statics: ['name', 'author', 'description', 'tags'],
      static_defaults: {
        author: '(none)',
        description: null
      }
    });
    assert.ok(view_model.name && !ko.isObservable(view_model.name), 'name: non-observable');
    assert.equal(view_model.name, 'Initial', 'name: value is correct');
    assert.equal(ko.utils.unwrapObservable(view_model.name), 'Initial', 'name: unwrapped value is correct');
    assert.ok(view_model.date && ko.isObservable(view_model.date), 'date: observable');
    assert.equal(view_model.date(), view_model.model().get('date'), 'date: value is correct');
    assert.equal(ko.utils.unwrapObservable(view_model.date), view_model.model().get('date'), 'date: unwrapped value is correct');
    assert.ok(view_model.author && !ko.isObservable(view_model.author), 'author: non-observable');
    assert.equal(view_model.author, '(none)', 'author: value is correct');
    assert.equal(ko.utils.unwrapObservable(view_model.author), '(none)', 'author: unwrapped value is correct');
    assert.ok(!view_model.description && !ko.isObservable(view_model.description), 'description: non-observable');
    assert.equal(view_model.description, null, 'description: value is correct');
    assert.equal(ko.utils.unwrapObservable(view_model.description), null, 'description: unwrapped value is correct');
    assert.ok(_.isUndefined(view_model.tags), 'tags: not created');
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('23. Issue 94', function(done) {
    var Child, ChildViewModel, Parent, ParentViewModel, parent_view_model;
    kb.statistics = new kb.Statistics();
    if (kb.Parse) {
      return done();
    }
    Child = kb.Model.extend();
    Parent = kb.Model.extend({
      defaults: {
        child: new Child({
          name: "SingleChild"
        }),
        children: new kb.Collection([
          new Child({
            name: "Child1"
          }), new Child({
            name: "Child2"
          })
        ], {
          model: Child
        })
      }
    });
    ChildViewModel = function(model) {
      var view_model;
      assert.ok(!!model, 'model is null?');
      view_model = kb.viewModel(model);
      view_model.nameComputed = ko.computed((function(_this) {
        return function() {
          var ret;
          ret = "no name function!";
          if (view_model.name) {
            ret = "Hello, " + view_model.name();
          }
          return ret;
        };
      })(this));
      return view_model;
    };
    ParentViewModel = function(model) {
      var view_model;
      view_model = kb.viewModel(model, {
        factories: {
          'children.models': ChildViewModel,
          'child': ChildViewModel
        }
      });
      view_model.nameComputed = ko.computed((function(_this) {
        return function() {
          return "Hello, " + view_model.name();
        };
      })(this));
      return view_model;
    };
    parent_view_model = new ParentViewModel(new Parent({
      name: "TestParent"
    }));
    kb.release(parent_view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('24. Issue 82 - createObservables', function(done) {
    var children, parent, subFactory, vm;
    kb.statistics = new kb.Statistics();
    children = new kb.Collection([
      new kb.Model({
        name: "Charles"
      }), new kb.Model({
        name: "Eve"
      })
    ]);
    parent = new kb.Model({
      name: "Bob",
      children: children
    });
    subFactory = function(model) {
      var subVm;
      subVm = new kb.ViewModel(model);
      subVm.cid = ko.computed(function() {
        return model.cid;
      });
      return subVm;
    };
    vm = new kb.ViewModel(parent, {
      excludes: ['children']
    });
    vm.shareOptions().factory.addPathMapping('children.models', subFactory);
    vm.createObservables(parent, ['children']);
    assert.ok(vm.children()[0].cid());
    kb.release(vm);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  return it('24. Issue 82 - mapObservables', function(done) {
    var children, parent, subFactory, vm;
    kb.statistics = new kb.Statistics();
    children = new kb.Collection([
      new kb.Model({
        name: "Charles"
      }), new kb.Model({
        name: "Eve"
      })
    ]);
    parent = new kb.Model({
      name: "Bob",
      children: children
    });
    subFactory = function(model) {
      var subVm;
      subVm = new kb.ViewModel(model);
      subVm.cid = ko.computed(function() {
        return model.cid;
      });
      return subVm;
    };
    vm = new kb.ViewModel(parent, {
      excludes: ['children']
    });
    vm.shareOptions().factory.addPathMapping('children.models', subFactory);
    vm.mapObservables(parent, {
      children: {}
    });
    assert.ok(vm.children()[0].cid());
    kb.release(vm);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
});
