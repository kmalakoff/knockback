var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

describe('knockback-observable.js', function() {
  var kb, ko, _;
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
  it('1. Standard use case: direct attributes with read and write', function(done) {
    var ContactViewModel, model, view_model;
    kb.statistics = new kb.Statistics();
    ContactViewModel = function(model) {
      this.name = kb.observable(model, 'name');
      this.number = kb.observable(model, {
        key: 'number'
      });
    };
    model = new kb.Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = new ContactViewModel(model);
    assert.equal(view_model.name(), 'Ringo', "Interesting name");
    assert.equal(view_model.number(), '555-555-5556', "Not so interesting number");
    view_model.name('Paul');
    assert.equal(model.get('name'), 'Paul', "Name changed");
    assert.equal(view_model.name(), 'Paul', "Name changed");
    assert.equal(model.get('number'), '555-555-5556', "Number not changed");
    assert.equal(view_model.number(), '555-555-5556', "Number not changed");
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
  it('2. Standard use case: direct attributes with custom read and write', function(done) {
    var ContactViewModelCustom, model, view_model;
    kb.statistics = new kb.Statistics();
    ContactViewModelCustom = function(model) {
      this.name = kb.observable(model, {
        key: 'name',
        read: function() {
          return "First: " + (model.get('name'));
        }
      });
      this.number = kb.observable(model, {
        key: 'number',
        read: function() {
          return "#: " + (model.get('number'));
        },
        write: function(value) {
          return model.set({
            number: value.substring(3)
          });
        }
      });
    };
    model = new kb.Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = new ContactViewModelCustom(model);
    assert.equal(view_model.name(), 'First: Ringo', "Interesting name");
    assert.equal(view_model.number(), '#: 555-555-5556', "Not so interesting number");
    assert.equal(model.get('name'), 'Ringo', "Name not changed");
    assert.equal(view_model.name(), 'First: Ringo', "Name not changed");
    view_model.number('#: 9222-222-222');
    assert.equal(model.get('number'), '9222-222-222', "Number was changed");
    assert.equal(view_model.number(), '#: 9222-222-222', "Number was changed");
    model.set({
      name: 'Starr',
      number: 'XXX-XXX-XXXX'
    });
    assert.equal(view_model.name(), 'First: Starr', "Name changed");
    assert.equal(view_model.number(), '#: XXX-XXX-XXXX', "Number was changed");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('3. Read args', function(done) {
    var ContactViewModelCustom, args, model, view_model;
    kb.statistics = new kb.Statistics();
    args = [];
    ContactViewModelCustom = function(model) {
      this.name = kb.observable(model, {
        key: 'name',
        read: (function(key, arg1, arg2) {
          args.push(arg1);
          args.push(arg2);
          return model.get('name');
        }),
        args: ['name', 1]
      });
      this.number = kb.observable(model, {
        key: 'number',
        read: (function(key, arg) {
          args.push(arg);
          return model.get('number');
        }),
        args: 'number'
      });
    };
    model = new kb.Contact({
      name: 'Ringo',
      number: '555-555-5556'
    });
    view_model = new ContactViewModelCustom(model);
    assert.ok(_.isEqual(args, ['name', 1, 'number']) || _.isEqual(args, ['name', 1, 'name', 1, 'number', 'number']), "got the args: " + (args.join(', ')));
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('4. Standard use case: ko.dependentObservable', function(done) {
    var ContactViewModel, model, view_model;
    kb.statistics = new kb.Statistics();
    ContactViewModel = function(model) {
      this.name = kb.observable(model, {
        key: 'name'
      });
      this.formatted_name = ko.dependentObservable({
        read: this.name,
        write: (function(value) {
          return this.name($.trim(value));
        }),
        owner: this
      });
    };
    model = new kb.Contact({
      name: 'Ringo'
    });
    view_model = new ContactViewModel(model);
    assert.equal(view_model.name(), 'Ringo', "Interesting name");
    assert.equal(view_model.formatted_name(), 'Ringo', "Interesting name");
    view_model.formatted_name(' John ');
    assert.equal(view_model.name(), 'John', "Name changed");
    assert.equal(view_model.formatted_name(), 'John', "Name changed");
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('5. Inferring observable types: the easy way', function(done) {
    var ChildrenCollection, InferringViewModel, children, children_child, model, parent, view_model;
    kb.statistics = new kb.Statistics();
    ChildrenCollection = (function(_super) {
      __extends(ChildrenCollection, _super);

      function ChildrenCollection(collection, options) {
        return ChildrenCollection.__super__.constructor.call(this, collection, {
          view_model: InferringViewModel,
          options: options
        });
      }

      return ChildrenCollection;

    })(kb.CollectionObservable);
    InferringViewModel = (function(_super) {
      __extends(InferringViewModel, _super);

      function InferringViewModel(model, options) {
        InferringViewModel.__super__.constructor.call(this, model, {
          keys: ['name', 'parent', 'children', 'maybe_null_name', 'maybe_null_parent', 'maybe_null_children'],
          factories: {
            'maybe_null_parent': InferringViewModel,
            'maybe_null_children': ChildrenCollection
          },
          options: options
        });
      }

      return InferringViewModel;

    })(kb.ViewModel);
    parent = new kb.Model({
      id: _.uniqueId(),
      name: 'Daddy'
    });
    children_child = new kb.Model({
      id: _.uniqueId(),
      name: 'Baby'
    });
    children = new kb.Collection([
      {
        id: _.uniqueId(),
        name: 'Bob',
        children: new kb.Collection([children_child]),
        maybe_null_children: new kb.Collection([children_child])
      }
    ]);
    model = new kb.Model({
      id: _.uniqueId()
    });
    view_model = new InferringViewModel(model);
    assert.equal(view_model.name(), null, 'inferred name as simple null');
    assert.equal(view_model.parent(), null, 'inferred parent as simple null');
    assert.equal(view_model.children(), null, 'inferred children as simple null');
    assert.equal(view_model.maybe_null_name(), null, 'name is null');
    assert.equal(view_model.maybe_null_parent().name(), null, 'parent name is null');
    assert.ok(view_model.maybe_null_parent() instanceof InferringViewModel, 'maybe_null_parent type is inferring');
    assert.equal(view_model.maybe_null_children().length, 0, 'no children yet');
    model.set({
      name: 'Fred',
      parent: parent,
      children: children
    });
    assert.equal(view_model.name(), 'Fred', 'name is Fred');
    assert.equal(view_model.parent().name(), 'Daddy', 'parent name is Daddy');
    assert.ok(view_model.parent() instanceof kb.ViewModel, 'parent type is kb.ViewModel');
    assert.equal(view_model.children()[0].name(), 'Bob', 'child name is Bob');
    assert.ok(view_model.children()[0] instanceof kb.ViewModel, 'child type is kb.ViewModel');
    assert.equal(view_model.children()[0].children()[0].name(), 'Baby', 'child child name is Baby');
    assert.ok(view_model.children()[0].children()[0] instanceof kb.ViewModel, 'child child type is kb.ViewModel');
    assert.equal(view_model.maybe_null_name(), null, 'name is null');
    assert.equal(view_model.maybe_null_parent().name(), null, 'parent name is null');
    assert.equal(view_model.maybe_null_children().length, 0, 'no children yet');
    model.set({
      maybe_null_name: model.get('name'),
      maybe_null_parent: model.get('parent'),
      maybe_null_children: model.get('children')
    });
    assert.equal(view_model.maybe_null_name(), 'Fred', 'maybe_null_name is Fred');
    assert.equal(view_model.maybe_null_parent().name(), 'Daddy', 'maybe_null_parent name is Daddy');
    assert.ok(view_model.maybe_null_parent() instanceof InferringViewModel, 'maybe_null_parent type is InferringViewModel');
    assert.equal(view_model.maybe_null_children()[0].name(), 'Bob', 'child name is Bob');
    assert.ok(view_model.maybe_null_children()[0] instanceof InferringViewModel, 'child type is InferringViewModel');
    assert.equal(view_model.maybe_null_children()[0].children()[0].name(), 'Baby', 'child child name is Baby');
    assert.ok(view_model.maybe_null_children()[0].children()[0] instanceof kb.ViewModel, 'child child type is kb.ViewModel');
    assert.equal(view_model.maybe_null_children()[0].maybe_null_children()[0].name(), 'Baby', 'maybe_null_children maybe_null_children name is Baby');
    assert.ok(view_model.maybe_null_children()[0].maybe_null_children()[0] instanceof InferringViewModel, 'maybe_null_children maybe_null_children type is InferringViewModel');
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('6. Inferring observable types: the hard way', function(done) {
    var ChildrenCollection, InferringViewModel, children, children_child, model, parent, view_model;
    kb.statistics = new kb.Statistics();
    ChildrenCollection = (function(_super) {
      __extends(ChildrenCollection, _super);

      function ChildrenCollection(collection, options) {
        return ChildrenCollection.__super__.constructor.call(this, collection, {
          view_model: InferringViewModel,
          options: options
        });
      }

      return ChildrenCollection;

    })(kb.CollectionObservable);
    InferringViewModel = function(model, options) {
      this._auto = kb.viewModel(model, {
        keys: ['name', 'parent', 'children'],
        options: options
      }, this);
      this.maybe_null_name = kb.observable(model, 'maybe_null_name');
      this.maybe_null_parent = kb.observable(model, {
        key: 'maybe_null_parent',
        factories: InferringViewModel,
        options: this._auto.shareOptions()
      });
      this.maybe_null_children = kb.observable(model, {
        key: 'maybe_null_children',
        factories: ChildrenCollection,
        options: this._auto.shareOptions()
      });
    };
    parent = new kb.Model({
      id: _.uniqueId(),
      name: 'Daddy'
    });
    children_child = new kb.Model({
      id: _.uniqueId(),
      name: 'Baby'
    });
    children = new kb.Collection([
      {
        id: _.uniqueId(),
        name: 'Bob',
        children: new kb.Collection([children_child]),
        maybe_null_children: new kb.Collection([children_child])
      }
    ]);
    model = new kb.Model({
      id: _.uniqueId()
    });
    view_model = new InferringViewModel(model);
    assert.equal(view_model.name(), null, 'inferred name as simple null');
    assert.equal(view_model.parent(), null, 'inferred parent as simple null');
    assert.equal(view_model.children(), null, 'inferred children as simple null');
    assert.equal(view_model.maybe_null_name(), null, 'name is null');
    assert.equal(view_model.maybe_null_parent().name(), null, 'parent name is null');
    assert.ok(view_model.maybe_null_parent() instanceof InferringViewModel, 'maybe_null_parent type is inferring');
    assert.equal(view_model.maybe_null_children().length, 0, 'no children yet');
    model.set({
      name: 'Fred',
      parent: parent,
      children: children
    });
    assert.equal(view_model.name(), 'Fred', 'name is Fred');
    assert.equal(view_model.parent().name(), 'Daddy', 'parent name is Daddy');
    assert.ok(view_model.parent() instanceof kb.ViewModel, 'parent type is kb.ViewModel');
    assert.equal(view_model.children()[0].name(), 'Bob', 'child name is Bob');
    assert.ok(view_model.children()[0] instanceof kb.ViewModel, 'child type is kb.ViewModel');
    assert.equal(view_model.children()[0].children()[0].name(), 'Baby', 'child child name is Baby');
    assert.ok(view_model.children()[0].children()[0] instanceof kb.ViewModel, 'child child type is kb.ViewModel');
    assert.equal(view_model.maybe_null_name(), null, 'name is null');
    assert.equal(view_model.maybe_null_parent().name(), null, 'parent name is null');
    assert.equal(view_model.maybe_null_children().length, 0, 'no children yet');
    model.set({
      maybe_null_name: model.get('name'),
      maybe_null_parent: model.get('parent'),
      maybe_null_children: model.get('children')
    });
    assert.equal(view_model.maybe_null_name(), 'Fred', 'maybe_null_name is Fred');
    assert.equal(view_model.maybe_null_parent().name(), 'Daddy', 'maybe_null_parent name is Daddy');
    assert.ok(view_model.maybe_null_parent() instanceof InferringViewModel, 'maybe_null_parent type is InferringViewModel');
    assert.equal(view_model.maybe_null_children()[0].name(), 'Bob', 'child name is Bob');
    assert.ok(view_model.maybe_null_children()[0] instanceof InferringViewModel, 'child type is InferringViewModel');
    assert.equal(view_model.maybe_null_children()[0].children()[0].name(), 'Baby', 'child child name is Baby');
    assert.ok(view_model.maybe_null_children()[0].children()[0] instanceof kb.ViewModel, 'child child type is kb.ViewModel');
    assert.equal(view_model.maybe_null_children()[0].maybe_null_children()[0].name(), 'Baby', 'maybe_null_children maybe_null_children name is Baby');
    assert.ok(view_model.maybe_null_children()[0].maybe_null_children()[0] instanceof InferringViewModel, 'maybe_null_children maybe_null_children type is InferringViewModel');
    kb.release(view_model);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('7. model change is observable', function(done) {
    var count, model, observable;
    kb.statistics = new kb.Statistics();
    model = new kb.Model({
      id: 1,
      name: 'Bob'
    });
    observable = kb.observable(model, 'name');
    count = 0;
    ko.dependentObservable(function() {
      observable.model();
      return count++;
    });
    observable.model(null);
    observable.model(model);
    assert.equal(count, 3, "model change was observed");
    kb.release(observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('8. view model changes do not cause dependencies inside ko.dependentObservable', function(done) {
    var count_manual, model, observable, observable_count;
    kb.statistics = new kb.Statistics();
    model = new kb.Model({
      id: 1,
      name: 'Initial'
    });
    observable = kb.observable(model, 'name');
    count_manual = 0;
    ko.dependentObservable(function() {
      observable('Manual');
      return count_manual++;
    });
    observable_count = 0;
    ko.dependentObservable(function() {
      observable();
      return observable_count++;
    });
    assert.equal(count_manual, 1, 'count_manual');
    assert.equal(observable_count, 1, 'observable_count');
    observable('Update');
    assert.equal(count_manual, 1, 'count_manual');
    assert.equal(observable_count, 2, 'observable_count');
    kb.release(observable);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  return it('9. this is bound', function(done) {
    var ViewModel, model, view_model;
    kb.statistics = new kb.Statistics();
    model = new kb.Model({
      number: 33
    });
    ViewModel = function(model) {
      this.number = kb.observable(model, 'number');
      this.formatted_number = kb.observable(model, {
        key: 'number',
        read: function() {
          return "#: " + (this.number());
        },
        write: function(value) {
          return this.number(value.substring(3));
        }
      }, this);
    };
    view_model = new ViewModel(model);
    assert.equal(view_model.formatted_number(), "#: " + (view_model.number()));
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
});
