const root = (typeof window !== 'undefined' && window !== null) ? window : global;
var assert = assert || (typeof require === 'function' ? require('chai').assert : undefined);

describe('Knockback.js with Backbone-Relational.js @backbone-relational', function() {

  // after -> delete root.Person

  // import Underscore (or Lo-Dash with precedence), Backbone, Knockout, and Knockback
  let Person;
  let kb = typeof window !== 'undefined' && window !== null ? window.kb : undefined; try { if (!kb) { kb = typeof require === 'function' ? require('knockback') : undefined; } } catch (error) {} try { if (!kb) { kb = typeof require === 'function' ? require('../../../knockback') : undefined; } } catch (error1) {}
  const {_, Backbone, ko} = kb;
  if (!(Backbone != null ? Backbone.Relational : undefined)) { if (typeof require === 'function') {
    require('backbone-relational');
  } }

  it('TEST DEPENDENCY MISSING', function(done) {
    assert.ok(!!ko, 'ko');
    assert.ok(!!_, '_');
    assert.ok(!!Backbone, 'Backbone');
    assert.ok(!!kb, 'kb');
    assert.ok(!!Backbone.Relational, 'Backbone.Relational');
    kb.configure({orm: 'backbone-relational'});
    return done();
  });

  if (!(Backbone != null ? Backbone.Relational : undefined)) { return; }
  Backbone.Relational.store = new Backbone.Store(); if (typeof Backbone.Relational.store.addModelScope === 'function') {
    Backbone.Relational.store.addModelScope(root);
  }

  root.Person = (Person = Backbone.RelationalModel.extend({
    relations: [{
      type: Backbone.HasMany,
      key: 'friends',
      relatedModel: 'Person'
    }]
  }));

  // ref counted view model
  class RefCountableViewModel {
    static initClass() {
  
      this.view_models = [];
    }
    constructor() {
      RefCountableViewModel.view_models.push(this);
      this.ref_count = 1;
    }

    refCount() { return this.ref_count; }
    retain() {
      this.ref_count++;
      return this;
    }
    release() {
      --this.ref_count;
      if (this.ref_count < 0) { throw "ref count is corrupt"; }
      if (!this.ref_count) {
        this.is_destroyed = true;
        this.__destroy();
      }
      return this;
    }

    __destroy() {
      return RefCountableViewModel.view_models.splice(_.indexOf(RefCountableViewModel.view_models, this), 1);
    }
  }
  RefCountableViewModel.initClass();

  // destroyable view model
  class DestroyableViewModel {
    static initClass() {
  
      this.view_models = [];
    }
    constructor() {
      DestroyableViewModel.view_models.push(this);
    }

    destroy() {
      return DestroyableViewModel.view_models.splice(_.indexOf(DestroyableViewModel.view_models, this), 1);
    }
  }
  DestroyableViewModel.initClass();

  // simple view model
  class SimpleViewModel {
    static initClass() {
  
      this.view_models = [];
    }
    constructor() {
      this.prop = ko.observable();
      SimpleViewModel.view_models.push(this);
    }
  }
  SimpleViewModel.initClass();

  it('kb.CollectionObservable with recursive view models', function(done) {
    kb.statistics = new kb.Statistics(); // turn on stats

    const john = new Person({
      id: 'person-1-1',
      name: 'John',
      friends: ['person-1-2', 'person-1-3', 'person-1-4']
    });
    const paul = new Person({
      id: 'person-1-2',
      name: 'Paul',
      friends: ['person-1-1', 'person-1-3', 'person-1-4']
    });
    const george = new Person({
      id: 'person-1-3',
      name: 'George',
      friends: ['person-1-1', 'person-1-2', 'person-1-4']
    });
    const ringo = new Person({
      id: 'person-1-4',
      name: 'Ringo',
      friends: ['person-1-1', 'person-1-2', 'person-1-3']
    });

    const band = new kb.Collection([john, paul, george, ringo]);

    // ref counted view model
    RefCountableViewModel.view_models = [];
    let collection_observable = kb.collectionObservable(band, {view_model: RefCountableViewModel});
    assert.equal(RefCountableViewModel.view_models.length, 4, "Created: 4");

    const instance = collection_observable()[0].retain();

    kb.release(collection_observable);
    assert.equal(RefCountableViewModel.view_models.length, 1, "Still one reference");
    assert.equal(instance.refCount(), 1, "All instances were destroyed in the collection's store");

    // destroyable view model
    DestroyableViewModel.view_models = [];
    collection_observable = kb.collectionObservable(band, {view_model: DestroyableViewModel});
    assert.equal(DestroyableViewModel.view_models.length, 4, "Created: 4");

    kb.release(collection_observable);
    assert.equal(DestroyableViewModel.view_models.length, 0, "All destroyed");

    // simple view model
    SimpleViewModel.view_models = [];
    collection_observable = kb.collectionObservable(band, {view_model: SimpleViewModel});
    assert.equal(SimpleViewModel.view_models.length, 4, "Created: 4");

    kb.release(collection_observable);
    assert.equal(SimpleViewModel.view_models.length, 4, "Destroyed: 4");
    for (let view_model of SimpleViewModel.view_models) { assert.ok(!view_model.prop, "Prop destroyed"); }

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null;
    return done();
  });

  it('kb.CollectionObservable with recursive view models and external store', function(done) {
    kb.statistics = new kb.Statistics(); // turn on stats

    const john = new Person({
      id: 'person-2-1',
      name: 'John',
      friends: ['person-2-2', 'person-2-3', 'person-2-4']
    });
    const paul = new Person({
      id: 'person-2-2',
      name: 'Paul',
      friends: ['person-2-1', 'person-2-3', 'person-2-4']
    });
    const george = new Person({
      id: 'person-2-3',
      name: 'George',
      friends: ['person-2-1', 'person-2-2', 'person-2-4']
    });
    const ringo = new Person({
      id: 'person-2-4',
      name: 'Ringo',
      friends: ['person-2-1', 'person-2-2', 'person-2-3']
    });

    const band = new kb.Collection([john, paul, george, ringo]);

    // ref counted view model
    let store = new kb.Store();
    RefCountableViewModel.view_models = [];
    let collection_observable = kb.collectionObservable(band, {view_model: RefCountableViewModel, store});
    assert.equal(RefCountableViewModel.view_models.length, 4, "Created: 4");

    const instance = collection_observable()[0].retain();

    kb.release(collection_observable);
    assert.equal(RefCountableViewModel.view_models.length, 4, "Remaining: 4");

    assert.equal(instance.refCount(), 2, "One instance retained and one in the store");

    store.destroy(); store = null;

    assert.equal(RefCountableViewModel.view_models.length, 1, "Still one reference");
    assert.equal(instance.refCount(), 1, "All instances were destroyed in the collection's store");

    // destroyable view model
    store = new kb.Store();
    DestroyableViewModel.view_models = [];
    collection_observable = kb.collectionObservable(band, {view_model: DestroyableViewModel, store});
    assert.equal(DestroyableViewModel.view_models.length, 4, "Created: 4");

    kb.release(collection_observable);
    assert.equal(DestroyableViewModel.view_models.length, 4, "All destroyed");

    store.destroy(); store = null;

    // all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    assert.equal(DestroyableViewModel.view_models.length, 0, "All destroyed");

    // simple view model
    store = new kb.Store();
    SimpleViewModel.view_models = [];
    collection_observable = kb.collectionObservable(band, {view_model: SimpleViewModel, store});
    assert.equal(SimpleViewModel.view_models.length, 4, "Created: 4");

    kb.release(collection_observable);
    assert.equal(SimpleViewModel.view_models.length, 4, "Remaining: 4");
    for (var view_model of SimpleViewModel.view_models) { assert.ok(view_model.prop, "Prop destroyed"); }

    store.destroy(); store = null;

    // all instances in the collection's store were released when it was destroyed (to remove potential cycles)
    assert.equal(SimpleViewModel.view_models.length, 4, "Destroyed: 4");
    for (view_model of SimpleViewModel.view_models) { assert.ok(!view_model.prop, "Prop destroyed"); }

    assert.equal(kb.statistics.registeredStatsString('all released'), 'all released', "Cleanup: stats"); kb.statistics = null;
    return done();
  });

  return it('CLEANUP', () => kb.configure({orm: 'default'}));
});
