var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

describe('knockback.js memory management', function() {
  var DestroyableViewModel, Person, RefCountableViewModel, SimpleViewModel, kb, ko, _;
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
  RefCountableViewModel = (function() {
    function RefCountableViewModel() {
      RefCountableViewModel.view_models.push(this);
      this.ref_count = 1;
    }

    RefCountableViewModel.prototype.refCount = function() {
      return this.ref_count;
    };

    RefCountableViewModel.prototype.retain = function() {
      this.ref_count++;
      return this;
    };

    RefCountableViewModel.prototype.release = function() {
      --this.ref_count;
      if (this.ref_count < 0) {
        throw "ref count is corrupt";
      }
      if (!this.ref_count) {
        this.is_destroyed = true;
        this.__destroy();
      }
      return this;
    };

    RefCountableViewModel.prototype.__destroy = function() {
      return RefCountableViewModel.view_models.splice(_.indexOf(RefCountableViewModel.view_models, this), 1);
    };

    RefCountableViewModel.view_models = [];

    return RefCountableViewModel;

  })();
  DestroyableViewModel = (function() {
    function DestroyableViewModel() {
      DestroyableViewModel.view_models.push(this);
    }

    DestroyableViewModel.prototype.destroy = function() {
      return DestroyableViewModel.view_models.splice(_.indexOf(DestroyableViewModel.view_models, this), 1);
    };

    DestroyableViewModel.view_models = [];

    return DestroyableViewModel;

  })();
  SimpleViewModel = (function() {
    function SimpleViewModel() {
      this.prop = ko.observable();
      SimpleViewModel.view_models.push(this);
    }

    SimpleViewModel.view_models = [];

    return SimpleViewModel;

  })();
  if (kb.Backbone) {
    Person = (function(_super) {
      __extends(Person, _super);

      function Person() {
        return Person.__super__.constructor.apply(this, arguments);
      }

      Person.prototype.relations = [
        {
          type: Backbone.HasMany,
          key: 'friends',
          relatedModel: Person
        }
      ];

      return Person;

    })(Backbone.RelationalModel);
  }
  it('Basic view model properties', function(done) {
    var ViewModel, index, nested_view_model, view_model, _i;
    kb.statistics = new kb.Statistics();
    nested_view_model = kb.viewModel(new kb.Model({
      name: 'name1'
    }), {
      name: {}
    }, this);
    ViewModel = function() {
      this.prop1 = ko.observable();
      this.prop2 = ko.observable([
        'test', 1, null, kb.viewModel(new kb.Model({
          name: 'name1'
        }))
      ]);
      this.prop3 = ko.observableArray([
        'test', 1, null, kb.viewModel(new kb.Model({
          name: 'name1'
        }))
      ]);
      this.prop4 = ko.dependentObservable(function() {
        return true;
      });
      this.prop5 = kb.observable(new kb.Model({
        name: 'name1'
      }), 'name');
      this.prop6 = nested_view_model;
      this.prop7 = kb.collectionObservable(new kb.Collection(), {
        models_only: true
      });
      this.prop8 = kb.viewModel(new kb.Model({
        name: 'name1'
      }));
      this.prop9 = kb.collectionObservable(new kb.Collection());
    };
    view_model = new ViewModel();
    kb.release(view_model);
    for (index = _i = 1; _i <= 9; index = ++_i) {
      assert.ok(!view_model["prop" + index], "Property released: prop" + index);
    }
    assert.ok(!view_model.name, "Property released: view_model.name");
    assert.ok(!nested_view_model.name, "Property released: nested_view_model.name");
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('Releasing with nodes', function(done) {
    var $co_el, $vm_el, child, collection_observable, index, name, view_model, _i, _len, _ref;
    kb.statistics = new kb.Statistics();
    view_model = kb.viewModel(new kb.Model({
      name: 'Bob'
    }));
    collection_observable = kb.collectionObservable(new kb.Collection([
      new kb.Model({
        name: 'Fred'
      }), new kb.Model({
        name: 'Mary'
      })
    ]));
    $vm_el = $('<div id="vm" data-bind="text: name"></div>');
    $co_el = $('<div id="co" data-bind="foreach: co"><div data-bind="text: name"></div></div>');
    $('body').append($vm_el).append($co_el);
    kb.applyBindings(view_model, $vm_el[0]);
    kb.applyBindings({
      co: collection_observable
    }, $co_el[0]);
    assert.equal($vm_el.text(), 'Bob', 'found Bob');
    _ref = $co_el.children();
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      child = _ref[index];
      name = index ? 'Mary' : 'Fred';
      assert.equal($(child).text(), name, "found " + name);
    }
    assert.equal(kb.statistics.registeredCount('ViewModel'), 3, '3 bound view models');
    assert.equal(kb.statistics.registeredCount('CollectionObservable'), 1, '1 bound collection observable');
    ko.removeNode($co_el[0]);
    assert.equal(kb.statistics.registeredCount('ViewModel'), 1, '1 bound view model');
    assert.equal(kb.statistics.registeredCount('CollectionObservable'), 0, 'no bound collection observables');
    ko.removeNode($vm_el[0]);
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('RefCounting', function(done) {
    var RefViewModel, ref_counted, view_model;
    kb.statistics = new kb.Statistics();
    RefViewModel = (function() {
      function RefViewModel() {
        this.prop = kb.observable(new kb.Model({
          name: 'name1'
        }), 'name');
        this.ref_count = 1;
      }

      RefViewModel.prototype.refCount = function() {
        return this.ref_count;
      };

      RefViewModel.prototype.retain = function() {
        this.ref_count++;
        return this;
      };

      RefViewModel.prototype.release = function() {
        --this.ref_count;
        if (this.ref_count < 0) {
          throw "ref count is corrupt";
        }
        if (!this.ref_count) {
          this.is_destroyed = true;
          this.__destroy();
        }
        return this;
      };

      RefViewModel.prototype.__destroy = function() {
        kb.release(this.prop);
        return this.prop = null;
      };

      return RefViewModel;

    })();
    ref_counted = new RefViewModel();
    view_model = {
      ref_counted: ref_counted.retain()
    };
    kb.release(view_model);
    assert.ok(!view_model.ref_counted, "Property released: view_model.ref_counted");
    assert.ok(!!ref_counted.prop, "Property not released: ref_counted.prop");
    ref_counted.release();
    assert.ok(!ref_counted.prop, "Property released: ref_counted.prop");
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('kb.CollectionObservable', function(done) {
    var collection_observable, instance, view_model, _i, _len, _ref;
    kb.statistics = new kb.Statistics();
    RefCountableViewModel.view_models = [];
    collection_observable = kb.collectionObservable(new kb.Collection([
      {
        name: 'name1'
      }, {
        name: 'name2'
      }
    ]), {
      view_model: RefCountableViewModel
    });
    assert.equal(RefCountableViewModel.view_models.length, 2, "Created: 2");
    instance = collection_observable()[0].retain();
    kb.release(collection_observable);
    assert.equal(RefCountableViewModel.view_models.length, 1, "Still one reference");
    assert.equal(instance.refCount(), 1, "All instances were destroyed in the collection's store");
    DestroyableViewModel.view_models = [];
    collection_observable = kb.collectionObservable(new kb.Collection([
      {
        name: 'name1'
      }, {
        name: 'name2'
      }
    ]), {
      view_model: DestroyableViewModel
    });
    assert.equal(DestroyableViewModel.view_models.length, 2, "Created: 2");
    kb.release(collection_observable);
    assert.equal(DestroyableViewModel.view_models.length, 0, "All destroyed");
    SimpleViewModel.view_models = [];
    collection_observable = kb.collectionObservable(new kb.Collection([
      {
        name: 'name1'
      }, {
        name: 'name2'
      }
    ]), {
      view_model: SimpleViewModel
    });
    assert.equal(SimpleViewModel.view_models.length, 2, "Created: 2");
    kb.release(collection_observable);
    assert.equal(SimpleViewModel.view_models.length, 2, "Destroyed: 2");
    _ref = SimpleViewModel.view_models;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view_model = _ref[_i];
      assert.ok(!view_model.prop, "Prop destroyed");
    }
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('kb.CollectionObservable with external store', function(done) {
    var collection_observable, instance, store, view_model, _i, _j, _len, _len1, _ref, _ref1;
    kb.statistics = new kb.Statistics();
    store = new kb.Store();
    RefCountableViewModel.view_models = [];
    collection_observable = kb.collectionObservable(new kb.Collection([
      {
        name: 'name1'
      }, {
        name: 'name2'
      }
    ]), {
      view_model: RefCountableViewModel,
      store: store
    });
    assert.equal(RefCountableViewModel.view_models.length, 2, "Created: 2");
    instance = collection_observable()[0].retain();
    kb.release(collection_observable);
    assert.equal(RefCountableViewModel.view_models.length, 2, "Remaining: 2");
    assert.equal(instance.refCount(), 2, "One instance retained and one in the store");
    store.destroy();
    store = null;
    assert.equal(RefCountableViewModel.view_models.length, 1, "Still one reference");
    assert.equal(instance.refCount(), 1, "All instances were destroyed in the collection's store");
    store = new kb.Store();
    DestroyableViewModel.view_models = [];
    collection_observable = kb.collectionObservable(new kb.Collection([
      {
        name: 'name1'
      }, {
        name: 'name2'
      }
    ]), {
      view_model: DestroyableViewModel,
      store: store
    });
    assert.equal(DestroyableViewModel.view_models.length, 2, "Created: 2");
    kb.release(collection_observable);
    assert.equal(DestroyableViewModel.view_models.length, 2, "All destroyed");
    store.destroy();
    store = null;
    assert.equal(DestroyableViewModel.view_models.length, 0, "All destroyed");
    store = new kb.Store();
    SimpleViewModel.view_models = [];
    collection_observable = kb.collectionObservable(new kb.Collection([
      {
        name: 'name1'
      }, {
        name: 'name2'
      }
    ]), {
      view_model: SimpleViewModel,
      store: store
    });
    assert.equal(SimpleViewModel.view_models.length, 2, "Created: 2");
    kb.release(collection_observable);
    assert.equal(SimpleViewModel.view_models.length, 2, "Remaining: 2");
    _ref = SimpleViewModel.view_models;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      view_model = _ref[_i];
      assert.ok(view_model.prop, "Prop destroyed");
    }
    store.destroy();
    store = null;
    assert.equal(SimpleViewModel.view_models.length, 2, "Destroyed: 2");
    _ref1 = SimpleViewModel.view_models;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      view_model = _ref1[_j];
      assert.ok(!view_model.prop, "Prop destroyed");
    }
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  it('kb.release destructiveness', function(done) {
    var array, obj, view_model;
    kb.statistics = new kb.Statistics();
    array = ['Hello', 'Friend'];
    kb.release(array);
    assert.ok(_.isEqual(array, ['Hello', 'Friend']), 'preserves arrays');
    obj = {
      name: 'Fred'
    };
    kb.release(obj);
    assert.ok(_.isEqual(obj, {
      name: 'Fred'
    }), 'preserves objects');
    view_model = {
      array: ['Hello', 'Friend'],
      obj: {
        name: 'Fred'
      },
      value: ko.observable('hi'),
      array_value1: ko.observable(['Hello', 'Friend']),
      array_value2: ko.observableArray(['Hello', 'Friend']),
      model_value: kb.viewModel(new kb.Model()),
      collection_value: kb.collectionObservable(new kb.Collection())
    };
    kb.release(view_model);
    assert.ok(_.isEqual(view_model.array, ['Hello', 'Friend']), 'preserves arrays');
    assert.ok(_.isEqual(view_model.obj, {
      name: 'Fred'
    }), 'preserves arrays');
    assert.ok(!view_model.value, 'releases observables: value');
    assert.ok(!view_model.array_value1, 'releases observables: array_value1');
    assert.ok(!view_model.array_value2, 'releases observables: array_value2');
    assert.ok(!view_model.model_value, 'releases observables: model_value');
    assert.ok(!view_model.collection_value, 'releases observables: collection_value');
    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
    kb.statistics = null;
    return done();
  });
  if (kb.Backbone) {
    it('kb.CollectionObservable with recursive view models', function(done) {
      var band, collection_observable, george, instance, john, paul, ringo, view_model, _i, _len, _ref;
      kb.statistics = new kb.Statistics();
      john = new Person({
        id: 'person-1-1',
        name: 'John',
        friends: ['person-1-2', 'person-1-3', 'person-1-4']
      });
      paul = new Person({
        id: 'person-1-2',
        name: 'Paul',
        friends: ['person-1-1', 'person-1-3', 'person-1-4']
      });
      george = new Person({
        id: 'person-1-3',
        name: 'George',
        friends: ['person-1-1', 'person-1-2', 'person-1-4']
      });
      ringo = new Person({
        id: 'person-1-4',
        name: 'Ringo',
        friends: ['person-1-1', 'person-1-2', 'person-1-3']
      });
      band = new kb.Collection([john, paul, george, ringo]);
      RefCountableViewModel.view_models = [];
      collection_observable = kb.collectionObservable(band, {
        view_model: RefCountableViewModel
      });
      assert.equal(RefCountableViewModel.view_models.length, 4, "Created: 4");
      instance = collection_observable()[0].retain();
      kb.release(collection_observable);
      assert.equal(RefCountableViewModel.view_models.length, 1, "Still one reference");
      assert.equal(instance.refCount(), 1, "All instances were destroyed in the collection's store");
      DestroyableViewModel.view_models = [];
      collection_observable = kb.collectionObservable(band, {
        view_model: DestroyableViewModel
      });
      assert.equal(DestroyableViewModel.view_models.length, 4, "Created: 4");
      kb.release(collection_observable);
      assert.equal(DestroyableViewModel.view_models.length, 0, "All destroyed");
      SimpleViewModel.view_models = [];
      collection_observable = kb.collectionObservable(band, {
        view_model: SimpleViewModel
      });
      assert.equal(SimpleViewModel.view_models.length, 4, "Created: 4");
      kb.release(collection_observable);
      assert.equal(SimpleViewModel.view_models.length, 4, "Destroyed: 4");
      _ref = SimpleViewModel.view_models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view_model = _ref[_i];
        assert.ok(!view_model.prop, "Prop destroyed");
      }
      assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
      kb.statistics = null;
      return done();
    });
    return it('kb.CollectionObservable with recursive view models and external store', function(done) {
      var band, collection_observable, george, instance, john, paul, ringo, store, view_model, _i, _j, _len, _len1, _ref, _ref1;
      kb.statistics = new kb.Statistics();
      john = new Person({
        id: 'person-2-1',
        name: 'John',
        friends: ['person-2-2', 'person-2-3', 'person-2-4']
      });
      paul = new Person({
        id: 'person-2-2',
        name: 'Paul',
        friends: ['person-2-1', 'person-2-3', 'person-2-4']
      });
      george = new Person({
        id: 'person-2-3',
        name: 'George',
        friends: ['person-2-1', 'person-2-2', 'person-2-4']
      });
      ringo = new Person({
        id: 'person-2-4',
        name: 'Ringo',
        friends: ['person-2-1', 'person-2-2', 'person-2-3']
      });
      band = new kb.Collection([john, paul, george, ringo]);
      store = new kb.Store();
      RefCountableViewModel.view_models = [];
      collection_observable = kb.collectionObservable(band, {
        view_model: RefCountableViewModel,
        store: store
      });
      assert.equal(RefCountableViewModel.view_models.length, 4, "Created: 4");
      instance = collection_observable()[0].retain();
      kb.release(collection_observable);
      assert.equal(RefCountableViewModel.view_models.length, 4, "Remaining: 4");
      assert.equal(instance.refCount(), 2, "One instance retained and one in the store");
      store.destroy();
      store = null;
      assert.equal(RefCountableViewModel.view_models.length, 1, "Still one reference");
      assert.equal(instance.refCount(), 1, "All instances were destroyed in the collection's store");
      store = new kb.Store();
      DestroyableViewModel.view_models = [];
      collection_observable = kb.collectionObservable(band, {
        view_model: DestroyableViewModel,
        store: store
      });
      assert.equal(DestroyableViewModel.view_models.length, 4, "Created: 4");
      kb.release(collection_observable);
      assert.equal(DestroyableViewModel.view_models.length, 4, "All destroyed");
      store.destroy();
      store = null;
      assert.equal(DestroyableViewModel.view_models.length, 0, "All destroyed");
      store = new kb.Store();
      SimpleViewModel.view_models = [];
      collection_observable = kb.collectionObservable(band, {
        view_model: SimpleViewModel,
        store: store
      });
      assert.equal(SimpleViewModel.view_models.length, 4, "Created: 4");
      kb.release(collection_observable);
      assert.equal(SimpleViewModel.view_models.length, 4, "Remaining: 4");
      _ref = SimpleViewModel.view_models;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        view_model = _ref[_i];
        assert.ok(view_model.prop, "Prop destroyed");
      }
      store.destroy();
      store = null;
      assert.equal(SimpleViewModel.view_models.length, 4, "Destroyed: 4");
      _ref1 = SimpleViewModel.view_models;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        view_model = _ref1[_j];
        assert.ok(!view_model.prop, "Prop destroyed");
      }
      assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats");
      kb.statistics = null;
      return done();
    });
  }
});
