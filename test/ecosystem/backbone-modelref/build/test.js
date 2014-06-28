var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

describe('Knockback.js with Backbone.ModelRef.js', function() {
  var Backbone, kb, ko, _;
  _ = window._ || (typeof require === "function" ? require('underscore') : void 0);
  Backbone = window.Backbone || (typeof require === "function" ? require('backbone') : void 0);
  Backbone.ModelRef = window.Backbone.ModelRef || (typeof require === "function" ? require('backbone-modelref') : void 0);
  ko = window.ko || (typeof require === "function" ? require('knockout') : void 0);
  kb = window.kb || (typeof require === "function" ? require('knockback') : void 0);
  it('TEST DEPENDENCY MISSING', function(done) {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!Backbone, 'Backbone');
    assert.ok(!!Backbone.ModelRef, 'Backbone.ModelRef');
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
  it('Standard use case: just enough to get the picture', function(done) {
    var ContactViewModel, collection, current_date, model, model_ref, view_model;
    kb.statistics = new kb.Statistics();
    ContactViewModel = function(model) {
      this._auto = kb.viewModel(model, {
        keys: {
          name: {
            key: 'name'
          },
          number: {
            key: 'number'
          },
          date: {
            key: 'date'
          }
        }
      }, this);
    };
    collection = new kb.ContactsCollection();
    model_ref = new Backbone.ModelRef(collection, 'b4');
    view_model = new ContactViewModel(model_ref);
    assert.equal(view_model.name(), null, "Is that what we want to convey?");
    collection.add(collection.parse({
      id: 'b4',
      name: 'John',
      number: '555-555-5558',
      date: new Date(1940, 10, 9)
    }));
    model = collection.get('b4');
    assert.equal(view_model.name(), 'John', "It is a name");
    assert.equal(view_model.number(), '555-555-5558', "Not so interesting number");
    assert.equal(view_model.date().toString(), new Date(1940, 10, 9).toString(), "John's birthdate matches");
    assert.equal(model.get('name'), 'John', "Name not changed");
    assert.equal(view_model.name(), 'John', "Name not changed");
    view_model.number('9222-222-222');
    assert.equal(model.get('number'), '9222-222-222', "Number was changed");
    assert.equal(view_model.number(), '9222-222-222', "Number was changed");
    view_model.date(new Date(1963, 11, 10));
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
    assert.equal(view_model.date().toString(), (new Date(1940, 10, 9)).toString(), "John's birthdate");
    view_model.date(new Date(1940, 10, 10));
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, "year is good");
    assert.equal(current_date.getMonth(), 10, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  return it('Standard use case with kb.ViewModels', function(done) {
    var ContactViewModel, collection, current_date, model, model_ref, view_model;
    kb.statistics = new kb.Statistics();
    ContactViewModel = (function(_super) {
      __extends(ContactViewModel, _super);

      function ContactViewModel(model) {
        ContactViewModel.__super__.constructor.call(this, model, {
          requires: ['name', 'number', 'date']
        });
      }

      return ContactViewModel;

    })(kb.ViewModel);
    collection = new kb.ContactsCollection();
    model_ref = new Backbone.ModelRef(collection, 'b4');
    view_model = new ContactViewModel(model_ref);
    assert.equal(view_model.name(), null, "Is that what we want to convey?");
    collection.add(collection.parse({
      id: 'b4',
      name: 'John',
      number: '555-555-5558',
      date: new Date(1940, 10, 9)
    }));
    model = collection.get('b4');
    assert.equal(view_model.name(), 'John', "It is a name");
    assert.equal(view_model.number(), '555-555-5558', "Not so interesting number");
    assert.equal(view_model.date().toString(), (new Date(1940, 10, 9)).toString(), "John's birthdate matches");
    assert.equal(model.get('name'), 'John', "Name not changed");
    assert.equal(view_model.name(), 'John', "Name not changed");
    view_model.number('9222-222-222');
    assert.equal(model.get('number'), '9222-222-222', "Number was changed");
    assert.equal(view_model.number(), '9222-222-222', "Number was changed");
    view_model.date(new Date(1963, 11, 10));
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
    assert.equal(view_model.date().toString(), (new Date(1940, 10, 9)).toString(), "John's birthdate");
    view_model.date(new Date(1940, 10, 10));
    current_date = model.get('date');
    assert.equal(current_date.getFullYear(), 1940, "year is good");
    assert.equal(current_date.getMonth(), 10, "month is good");
    assert.equal(current_date.getDate(), 10, "day is good");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
});
