import kb from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';
import BackboneORM, { installBrowserRuntime } from 'backbone-orm/browser';

type Callback<T> = (error: Error | null, value?: T) => void;

type FamilyGlobal = typeof globalThis & {
  Backbone?: typeof Backbone;
  BackboneORM?: typeof BackboneORM;
  __familyScriptURLs?: string[];
  __retainedBackboneORM?: typeof BackboneORM;
};

function callbackResult<T>(register: (callback: Callback<T>) => void): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    register((error, value) => (error ? reject(error) : resolve(value)));
  });
}

function listenerCount(target: Backbone.EventsHash): number {
  const events = (target as Backbone.EventsHash & { _events?: Record<string, unknown | unknown[]> })._events;
  if (!events) return 0;
  return Object.values(events).reduce((count, listeners) => count + (Array.isArray(listeners) ? listeners.length : 1), 0);
}

describe('local family browser ORM application', () => {
  it('runs the packaged UMD and public browser overlay with one Backbone', async () => {
    const browserGlobal = globalThis as FamilyGlobal;
    assert.strictEqual(browserGlobal.__retainedBackboneORM, BackboneORM);
    assert.strictEqual(browserGlobal.BackboneORM, BackboneORM);
    assert.strictEqual(browserGlobal.Backbone, Backbone);
    assert.strictEqual(BackboneORM.Backbone, Backbone);
    assert.strictEqual((Backbone as typeof Backbone & { ModelRef?: typeof ModelRef }).ModelRef, ModelRef);
    assert.strictEqual(installBrowserRuntime(browserGlobal), BackboneORM);
    assert.deepStrictEqual(
      browserGlobal.__familyScriptURLs?.map((url) => new URL(url).origin),
      [location.origin, location.origin, location.origin]
    );
    assert.deepStrictEqual(
      browserGlobal.__familyScriptURLs?.map((url) => new URL(url).pathname),
      ['/__local/underscore.js', '/__local/backbone.js', '/__local/backbone-orm.js']
    );

    kb.configure({ orm: 'backbone-orm' });
    BackboneORM.configure({ model_cache: { enabled: true, max: 20 } });

    const Child = Backbone.Model.extend({
      model_name: 'LocalFamilyBrowserChild',
      schema() {
        return { id: ['Integer', { manual: true }], name: 'String' };
      },
    });
    const Parent = Backbone.Model.extend({
      model_name: 'LocalFamilyBrowserParent',
      schema() {
        return {
          children: () => ['hasMany', Child],
          id: ['Integer', { manual: true }],
          name: 'String',
          primary: () => ['belongsTo', Child],
        };
      },
    });
    BackboneORM.configureModel(Child);
    BackboneORM.configureModel(Parent);

    const first = new Child({ id: 1, name: 'first' });
    const second = new Child({ id: 2, name: 'second' });
    await callbackResult((callback) => first.save(callback));
    await callbackResult((callback) => second.save(callback));
    const parent = new Parent({ children: [], id: 10, name: 'parent', primary: null });
    await callbackResult((callback) => parent.save(callback));

    const parentListenersBefore = listenerCount(parent);
    const view = kb.viewModel(parent);
    const childrenObservable = view.children;
    const primaryObservable = view.primary;
    parent.set({ children: [first], primary: first });
    assert.strictEqual(view.children, childrenObservable);
    assert.strictEqual(view.primary, primaryObservable);
    assert.deepStrictEqual(
      view.children().map((child) => child.name()),
      ['first']
    );
    assert.strictEqual(view.primary().name(), 'first');

    parent.set({ children: [second], primary: second });
    assert.strictEqual(view.children, childrenObservable);
    assert.strictEqual(view.primary, primaryObservable);
    assert.deepStrictEqual(
      view.children().map((child) => child.name()),
      ['second']
    );
    assert.strictEqual(view.primary().name(), 'second');

    parent.set({ children: [], primary: null });
    assert.strictEqual(view.children, childrenObservable);
    assert.strictEqual(view.primary, primaryObservable);
    assert.deepStrictEqual(view.children(), []);
    assert.strictEqual(view.primary(), null);

    const referencedChildren = new (Backbone.Collection.extend({ model: Child }))();
    const reference = new ModelRef(referencedChildren, 7);
    const referenceView = kb.viewModel(reference, { keys: ['name'] });
    const nameObservable = referenceView.name;
    assert.strictEqual(nameObservable(), null);
    const loaded = new Child({ id: 7, name: 'loaded' });
    referencedChildren.add(loaded);
    assert.strictEqual(referenceView.model(), loaded);
    assert.strictEqual(nameObservable(), 'loaded');
    referencedChildren.remove(loaded);
    assert.strictEqual(referenceView.model(), null);
    assert.strictEqual(nameObservable(), null);
    referencedChildren.add(loaded);
    assert.strictEqual(referenceView.model(), loaded);
    assert.strictEqual(referenceView.name, nameObservable);

    referenceView.dispose();
    assert.strictEqual(listenerCount(reference), 0);
    assert.strictEqual(reference.ref_count, 1);
    reference.release();
    assert.strictEqual(reference.ref_count, 0);
    assert.strictEqual(listenerCount(referencedChildren), 0);
    view.dispose();
    assert.strictEqual(listenerCount(parent), parentListenersBefore);
    kb.configure({ orm: undefined });

    const externalRequests = performance
      .getEntriesByType('resource')
      .map((entry) => entry.name)
      .filter((url) => new URL(url).origin !== location.origin);
    assert.deepStrictEqual(externalRequests, []);
  });
});
