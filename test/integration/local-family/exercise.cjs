'use strict';

const assert = require('assert');

function callbackResult(register) {
  return new Promise((resolve, reject) => {
    register((error, value) => (error ? reject(error) : resolve(value)));
  });
}

function save(model) {
  return callbackResult((callback) => model.save(callback));
}

function fetch(model) {
  return callbackResult((callback) => model.fetch(callback));
}

function findWithCallback(modelType, query) {
  return callbackResult((callback) => modelType.find(query, callback));
}

function listenerCount(target) {
  if (!target || !target._events) return 0;
  return Object.values(target._events).reduce((count, listeners) => count + (Array.isArray(listeners) ? listeners.length : 1), 0);
}

async function exerciseFamily({ Backbone, format, kb, ko, ModelRef, ORM, SQL, filename, sqlModels }) {
  assert.strictEqual(ORM.Backbone, Backbone);
  assert.strictEqual(Backbone.ModelRef, ModelRef);
  assert.strictEqual(Backbone.RelationalModel, undefined);
  assert.strictEqual(Backbone.AssociatedModel, undefined);

  kb.configure({ orm: 'backbone-orm' });
  ORM.configure({ model_cache: { enabled: true, max: 100 } });

  const Child = Backbone.Model.extend({
    model_name: `LocalFamilyChild${format}`,
    schema() {
      return SQL ? { name: 'String' } : { id: ['Integer', { manual: true }], name: 'String' };
    },
  });
  const Parent = Backbone.Model.extend({
    model_name: `LocalFamilyParent${format}`,
    schema() {
      return {
        ...(SQL ? {} : { id: ['Integer', { manual: true }] }),
        name: 'String',
        primary: () => ['belongsTo', Child],
        children: () => ['hasMany', Child],
      };
    },
  });
  if (SQL) {
    assert.strictEqual(SQL.Backbone, Backbone);
    assert.strictEqual(SQL.modules['backbone-orm'], ORM);
    sqlModels.push(Child, Parent);
    Child.prototype.urlRoot = `sqlite3:///family_children_${format}`;
    Parent.prototype.urlRoot = `sqlite3:///family_parents_${format}`;
    Child.prototype.sync = SQL.sync(Child, { filename });
    Parent.prototype.sync = SQL.sync(Parent, { filename });
    await callbackResult((callback) => ORM.Utils.resetSchemas([Child, Parent], {}, callback));
  } else {
    ORM.configureModel(Child);
    ORM.configureModel(Parent);
  }

  const first = new Child({ ...(SQL ? {} : { id: 101 }), name: 'first' });
  const second = new Child({ ...(SQL ? {} : { id: 102 }), name: 'second' });
  await save(first);
  await save(second);

  const parent = new Parent({ ...(SQL ? {} : { id: 1 }), name: 'Ada', primary: null, children: [] });
  await save(parent);
  const parentListenersBefore = listenerCount(parent);
  const view = kb.viewModel(parent);
  const primaryObservable = view.primary;
  const childrenObservable = view.children;
  assert.strictEqual(primaryObservable(), null);
  assert.strictEqual(primaryObservable.valueType(), kb.TYPE_MODEL);
  assert.deepStrictEqual(childrenObservable(), []);
  assert.strictEqual(childrenObservable.valueType(), kb.TYPE_COLLECTION);
  assert.ok(listenerCount(parent) > parentListenersBefore);

  parent.set({ primary: first, children: [first] });
  assert.strictEqual(view.primary().name(), 'first');
  assert.deepStrictEqual(
    view.children().map((child) => child.name()),
    ['first']
  );
  assert.strictEqual(view.primary, primaryObservable);
  assert.strictEqual(view.children, childrenObservable);
  await save(parent);
  assert.strictEqual(view.primary, primaryObservable, 'save replaced the primary observable');
  assert.strictEqual(view.children, childrenObservable, 'save replaced the children observable');

  const query = { id: parent.id, ...(SQL ? { $include: ['primary', 'children'] } : {}) };
  const promiseMatches = await Parent.find(query);
  assert.strictEqual(view.primary, primaryObservable, 'Promise find replaced the primary observable');
  assert.strictEqual(view.children, childrenObservable, 'Promise find replaced the children observable');
  const callbackMatches = await findWithCallback(Parent, query);
  assert.strictEqual(view.primary, primaryObservable, 'callback find replaced the primary observable');
  assert.strictEqual(view.children, childrenObservable, 'callback find replaced the children observable');
  assert.strictEqual(promiseMatches.length, 1);
  assert.strictEqual(callbackMatches.length, 1);
  assert.strictEqual(promiseMatches[0], parent);
  assert.strictEqual(callbackMatches[0], parent);
  assert.strictEqual(promiseMatches[0], callbackMatches[0]);
  assert.strictEqual(Parent.cache.get(parent.id), parent);
  if (SQL) {
    assert.strictEqual(promiseMatches[0].get('primary').get('name'), 'first');
    assert.deepStrictEqual(promiseMatches[0].get('children').pluck('name'), ['first']);
  }

  const fetched = new Parent({ id: parent.id });
  assert.strictEqual(view.primary, primaryObservable, 'same-ID construction replaced the primary observable');
  assert.strictEqual(view.children, childrenObservable, 'same-ID construction replaced the children observable');
  await fetch(fetched);
  assert.strictEqual(view.primary, primaryObservable, 'fetch replaced the primary observable');
  assert.strictEqual(view.children, childrenObservable, 'fetch replaced the children observable');
  assert.strictEqual(fetched.get('name'), 'Ada');

  const ordinary = new Backbone.Model({ name: 'ordinary' });
  const ordinaryView = kb.viewModel(ordinary, { keys: ['name'] });
  assert.strictEqual(ordinaryView.name(), 'ordinary');
  ordinary.set('name', 'ordinary-updated');
  assert.strictEqual(ordinaryView.name(), 'ordinary-updated');
  ordinaryView.dispose();

  const references = new (Backbone.Collection.extend({ model: Child }))();
  const reference = new ModelRef(references, 500);
  const referenceView = kb.viewModel(reference, { keys: ['name'] });
  const nameObservable = referenceView.name;
  assert.strictEqual(referenceView.model(), null);
  assert.strictEqual(nameObservable(), null);

  const loaded = new Child({ id: 500, name: 'delayed' });
  references.add(loaded);
  assert.strictEqual(referenceView.model(), loaded);
  assert.strictEqual(nameObservable(), 'delayed');

  const replacement = new Child({ id: 500, name: 'replacement' });
  references.reset([replacement]);
  assert.strictEqual(referenceView.model(), replacement);
  assert.strictEqual(nameObservable(), 'replacement');
  assert.strictEqual(referenceView.name, nameObservable);

  references.remove(replacement);
  assert.strictEqual(referenceView.model(), null);
  assert.strictEqual(nameObservable(), null);
  references.add(replacement);
  assert.strictEqual(referenceView.model(), replacement);
  assert.strictEqual(nameObservable(), 'replacement');

  assert.strictEqual(listenerCount(reference) >= 2, true);
  referenceView.dispose();
  assert.strictEqual(listenerCount(reference), 0);
  assert.strictEqual(reference.ref_count, 1);
  reference.release();
  assert.strictEqual(reference.ref_count, 0);
  assert.strictEqual(listenerCount(references), 0);

  const ownershipParent = new Parent({ id: 2, name: 'ownership', primary: null, children: [] });
  const ownershipListenersBefore = listenerCount(ownershipParent);
  const ownershipView = kb.viewModel(ownershipParent);
  assert.ok(listenerCount(ownershipParent) > ownershipListenersBefore);
  ownershipView.dispose();
  assert.strictEqual(listenerCount(ownershipParent), ownershipListenersBefore);

  parent.set({ primary: second, children: [second] });
  const relationDefect =
    view.primary === primaryObservable && view.children === childrenObservable
      ? null
      : {
          childrenIdentityPreserved: view.children === childrenObservable,
          childrenType: typeof view.children,
          childrenValueIsNull: view.children === null,
          primaryIdentityPreserved: view.primary === primaryObservable,
          primaryType: typeof view.primary,
          primaryValueIsNull: view.primary === null,
        };
  if (!relationDefect) {
    assert.strictEqual(view.primary().name(), 'second');
    assert.deepStrictEqual(
      view.children().map((child) => child.name()),
      ['second']
    );
    if (SQL) {
      await save(parent);
      await fetch(parent);
      const replaced = await Parent.find(query);
      assert.strictEqual(replaced[0], parent);
      assert.strictEqual(view.primary, primaryObservable);
      assert.strictEqual(view.children, childrenObservable);
      assert.strictEqual(view.primary().name(), 'second');
      assert.deepStrictEqual(
        view.children().map((child) => child.name()),
        ['second']
      );
    }

    parent.set({ primary: null, children: [] });
    assert.strictEqual(view.primary(), null);
    assert.deepStrictEqual(view.children(), []);
    assert.strictEqual(view.primary, primaryObservable);
    assert.strictEqual(view.children, childrenObservable);
    if (SQL) {
      await save(parent);
      await fetch(parent);
      const cleared = await Parent.find(query);
      assert.strictEqual(cleared[0], parent);
      assert.strictEqual(view.primary(), null);
      assert.deepStrictEqual(view.children(), []);
      assert.strictEqual(view.primary, primaryObservable);
      assert.strictEqual(view.children, childrenObservable);
    }
  }

  view.dispose();
  assert.strictEqual(listenerCount(parent), parentListenersBefore);
  kb.configure({ orm: undefined });

  const computed = ko.computed(() => ordinary.get('name'));
  assert.strictEqual(computed(), 'ordinary-updated');
  computed.dispose();

  console.log(
    JSON.stringify({
      cacheIdentity: true,
      callbackPromiseParity: true,
      format,
      modelRefListenersReleased: true,
      ordinaryBackbone: true,
      parentListenersRestored: true,
    })
  );
  if (relationDefect) throw new Error(`Relation observable identity defect: ${JSON.stringify(relationDefect)}`);

  return {
    cacheIdentity: true,
    callbackPromiseParity: true,
    format,
    modelRefLifecycle: true,
    ordinaryBackbone: true,
    relationObservables: true,
  };
}

module.exports = exerciseFamily;
