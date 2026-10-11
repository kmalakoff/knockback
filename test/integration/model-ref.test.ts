import kb from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';
import ko from 'knockout';
import { listenerCount } from '../lib/backbone-events.ts';

interface PersonAttributes {
  id: number;
  name: string;
  role?: string;
  status?: string;
  required?: string;
  extra?: string;
}

class PersonModel extends Backbone.Model<PersonAttributes> {}

class PersonCollection extends Backbone.Collection<PersonModel> {
  model = PersonModel;
}

interface PersonViewModel {
  name: ko.Observable<string | null>;
}

describe('ModelRef integration', () => {
  it('uses one pinned Backbone instance in each test environment', () => {
    const expectedVersion = typeof window === 'undefined' ? '1.6.1' : '1.6.0';
    const installedBackbone = Backbone as typeof Backbone & { ModelRef?: typeof ModelRef; VERSION: string };

    assert.strictEqual(installedBackbone.VERSION, expectedVersion);
    assert.strictEqual(installedBackbone.ModelRef, ModelRef);
  });

  it('keeps a surviving view current through the full reference lifecycle', () => {
    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 0);

    const firstView = kb.viewModel<PersonViewModel, PersonModel>(reference, { keys: ['name'] });
    const secondView = kb.viewModel<PersonViewModel, PersonModel>(reference, { keys: ['name'] });

    assert.strictEqual(reference.ref_count, 3);
    assert.strictEqual(firstView.model(), null);
    assert.strictEqual(secondView.model(), null);
    assert.strictEqual(firstView.name(), null);
    assert.strictEqual(secondView.name(), null);

    const firstModel = new PersonModel({ id: 0, name: 'zero' });
    collection.add(firstModel);

    assert.strictEqual(firstView.model(), firstModel);
    assert.strictEqual(secondView.model(), firstModel);
    assert.strictEqual(firstView.name(), 'zero');
    assert.strictEqual(secondView.name(), 'zero');

    firstModel.set('name', 'zero changed');
    assert.strictEqual(firstView.name(), 'zero changed');
    assert.strictEqual(secondView.name(), 'zero changed');

    collection.remove(firstModel);
    assert.strictEqual(firstView.model(), null);
    assert.strictEqual(secondView.model(), null);
    assert.strictEqual(firstView.name(), null);
    assert.strictEqual(secondView.name(), null);

    collection.add(firstModel);
    assert.strictEqual(firstView.model(), firstModel);
    assert.strictEqual(secondView.model(), firstModel);

    const replacement = new PersonModel({ id: 0, name: 'replacement' });
    let destroyCalls = 0;
    replacement.destroy = (() => {
      destroyCalls++;
      return false;
    }) as typeof replacement.destroy;
    collection.reset([replacement]);

    assert.strictEqual(firstView.model(), replacement);
    assert.strictEqual(secondView.model(), replacement);
    assert.strictEqual(firstView.name(), 'replacement');
    assert.strictEqual(secondView.name(), 'replacement');
    assert.strictEqual(listenerCount(reference, 'loaded'), 2);
    assert.strictEqual(listenerCount(reference, 'unloaded'), 2);

    firstView.dispose();
    assert.strictEqual(reference.ref_count, 2);
    assert.strictEqual(listenerCount(reference, 'loaded'), 1);
    assert.strictEqual(listenerCount(reference, 'unloaded'), 1);

    replacement.set('name', 'survivor');
    assert.strictEqual(secondView.name(), 'survivor');

    secondView.dispose();
    assert.strictEqual(reference.ref_count, 1);
    assert.strictEqual(listenerCount(reference, 'loaded'), 0);
    assert.strictEqual(listenerCount(reference, 'unloaded'), 0);
    assert.strictEqual(destroyCalls, 0);

    reference.release();
    assert.strictEqual(reference.ref_count, 0);
    assert.strictEqual(reference.collection, null);
    assert.strictEqual(listenerCount(collection, 'add'), 0);
    assert.strictEqual(listenerCount(collection, 'remove'), 0);
    assert.strictEqual(listenerCount(collection, 'reset'), 0);
    assert.strictEqual(destroyCalls, 0);
  });

  it('transfers a view between ordinary and referenced models before clearing', () => {
    const collection = new PersonCollection();
    const referencedModel = new PersonModel({ id: 0, name: 'referenced' });
    collection.add(referencedModel);
    const reference = new ModelRef(collection, 0);
    const ordinaryModel = new PersonModel({ id: 1, name: 'ordinary' });
    const replacement = new PersonModel({ id: 2, name: 'replacement' });
    const view = kb.viewModel<PersonViewModel, PersonModel>(ordinaryModel, { keys: ['name'] });

    view.model(reference);
    assert.strictEqual(reference.ref_count, 2);
    assert.strictEqual(view.model(), referencedModel);
    assert.strictEqual(view.name(), 'referenced');

    view.model(replacement);
    assert.strictEqual(reference.ref_count, 1);
    assert.strictEqual(view.model(), replacement);
    assert.strictEqual(view.name(), 'replacement');

    view.model(null);
    assert.strictEqual(view.model(), null);
    assert.strictEqual(view.name(), null);

    referencedModel.set('name', 'ignored reference');
    replacement.set('name', 'ignored replacement');
    assert.strictEqual(view.model(), null);
    assert.strictEqual(view.name(), null);

    view.dispose();
    view.dispose();
    assert.strictEqual(reference.ref_count, 1);
    reference.release();
  });

  it('clears one reference-backed view without releasing its sibling', () => {
    const collection = new PersonCollection();
    const model = new PersonModel({ id: 0, name: 'shared' });
    collection.add(model);
    const reference = new ModelRef(collection, 0);
    const firstView = kb.viewModel<PersonViewModel, PersonModel>(reference, { keys: ['name'] });
    const secondView = kb.viewModel<PersonViewModel, PersonModel>(reference, { keys: ['name'] });

    assert.strictEqual(reference.ref_count, 3);
    firstView.model(null);
    assert.strictEqual(reference.ref_count, 2);
    assert.strictEqual(firstView.model(), null);
    assert.strictEqual(firstView.name(), null);
    assert.strictEqual(secondView.model(), model);
    assert.strictEqual(secondView.name(), 'shared');

    model.set('name', 'survivor');
    assert.strictEqual(firstView.name(), null);
    assert.strictEqual(secondView.name(), 'survivor');

    firstView.dispose();
    firstView.dispose();
    assert.strictEqual(reference.ref_count, 2);

    secondView.dispose();
    secondView.dispose();
    assert.strictEqual(reference.ref_count, 1);
    reference.release();
    assert.strictEqual(reference.ref_count, 0);
  });

  it('publishes loaded and replacement models after their attributes are ready', () => {
    interface ReactiveViewModel {
      name: ko.Observable<string | null>;
      role: ko.Observable<string | null>;
    }

    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 7);
    const view = kb.viewModel<ReactiveViewModel, PersonModel>(reference);
    const labels: Array<string | null> = [];
    const readyModels: Array<{ model: PersonModel; name: string | null; role: string | null }> = [];
    const label = ko.computed(() => {
      const model = view.model();
      if (!model) return null;
      return model.has('role') ? `${view.name()}:${view.role()}` : view.name();
    });
    const labelSubscription = label.subscribe((value) => labels.push(value));
    const modelSubscription = view.model.subscribe((model) => {
      if (!model) return;
      readyModels.push({
        model,
        name: view.name(),
        role: model.has('role') ? view.role() : null,
      });
    });

    try {
      assert.strictEqual(label(), null);

      const initialModel = new PersonModel({ id: 7, name: 'loaded' });
      collection.add(initialModel);

      assert.strictEqual(label(), 'loaded');
      assert.deepStrictEqual(labels, ['loaded']);
      assert.deepStrictEqual(readyModels, [{ model: initialModel, name: 'loaded', role: null }]);

      const replacement = new PersonModel({ id: 7, name: 'replacement', role: 'admin' });
      collection.reset([replacement]);

      assert.strictEqual(label(), 'replacement:admin');
      assert.strictEqual(labels[labels.length - 1], 'replacement:admin');
      assert.deepStrictEqual(readyModels[readyModels.length - 1], {
        model: replacement,
        name: 'replacement',
        role: 'admin',
      });
    } finally {
      modelSubscription.dispose();
      labelSubscription.dispose();
      label.dispose();
      view.dispose();
      reference.release();
    }
  });

  it('publishes default-discovered values before each non-null model notification', () => {
    interface ReadyViewModel {
      name: ko.Observable<string | null>;
      role: ko.Observable<string | null>;
    }

    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 7);
    const view = kb.viewModel<ReadyViewModel, PersonModel>(reference);
    const seen: Array<{ expected: string | undefined; actual: string | null; role: string | null }> = [];
    const subscription = view.model.subscribe((model) => {
      if (!model) return;
      seen.push({
        expected: model.get('name'),
        actual: view.name(),
        role: model.has('role') ? view.role() : null,
      });
    });

    try {
      const first = new PersonModel({ id: 7, name: 'first' });
      collection.add(first);
      assert.deepStrictEqual(seen[0], { expected: 'first', actual: 'first', role: null });

      const sameKeys = new PersonModel({ id: 7, name: 'second' });
      collection.reset([sameKeys]);
      assert.deepStrictEqual(seen[1], { expected: 'second', actual: 'second', role: null });

      const newKey = new PersonModel({ id: 7, name: 'third', role: 'admin' });
      collection.reset([newKey]);
      assert.deepStrictEqual(seen[2], { expected: 'third', actual: 'third', role: 'admin' });

      collection.remove(newKey);
      assert.strictEqual(view.model(), null);
      assert.strictEqual(view.name(), null);
      assert.strictEqual(view.role(), null);

      const reloaded = new PersonModel({ id: 7, name: 'reloaded' });
      collection.add(reloaded);
      assert.deepStrictEqual(seen[3], { expected: 'reloaded', actual: 'reloaded', role: null });

      const direct = new PersonModel({ id: 8, name: 'direct', role: 'owner' });
      view.model(direct);
      assert.deepStrictEqual(seen[4], { expected: 'direct', actual: 'direct', role: 'owner' });
      assert.strictEqual(reference.ref_count, 1);
    } finally {
      subscription.dispose();
      view.dispose();
      reference.release();
    }
  });

  it('publishes explicit and mapped values before each non-null model notification', () => {
    interface ReadyMappedViewModel {
      name: ko.Observable<string | null>;
      displayName: ko.Observable<string | null>;
      role?: ko.Observable<string | null>;
    }

    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 7);
    const view = kb.viewModel<ReadyMappedViewModel, PersonModel>(reference, {
      keys: ['name'],
      mappings: {
        displayName: { key: 'name' },
      },
    });
    const seen: Array<{ expected: string | undefined; name: string | null; displayName: string | null }> = [];
    const subscription = view.model.subscribe((model) => {
      if (!model) return;
      seen.push({
        expected: model.get('name'),
        name: view.name(),
        displayName: view.displayName(),
      });
    });

    try {
      const first = new PersonModel({ id: 7, name: 'first' });
      collection.add(first);
      assert.deepStrictEqual(seen[0], { expected: 'first', name: 'first', displayName: 'first' });

      const sameKeys = new PersonModel({ id: 7, name: 'second' });
      collection.reset([sameKeys]);
      assert.deepStrictEqual(seen[1], { expected: 'second', name: 'second', displayName: 'second' });

      const newKey = new PersonModel({ id: 7, name: 'third', role: 'filtered' });
      collection.reset([newKey]);
      assert.deepStrictEqual(seen[2], { expected: 'third', name: 'third', displayName: 'third' });
      assert.strictEqual(view.role, undefined);

      collection.remove(newKey);
      assert.strictEqual(view.model(), null);
      assert.strictEqual(view.name(), null);
      assert.strictEqual(view.displayName(), null);

      const reloaded = new PersonModel({ id: 7, name: 'reloaded' });
      collection.add(reloaded);
      assert.deepStrictEqual(seen[3], { expected: 'reloaded', name: 'reloaded', displayName: 'reloaded' });

      const direct = new PersonModel({ id: 8, name: 'direct' });
      view.model(direct);
      assert.deepStrictEqual(seen[4], { expected: 'direct', name: 'direct', displayName: 'direct' });
      assert.strictEqual(reference.ref_count, 1);
    } finally {
      subscription.dispose();
      view.dispose();
      reference.release();
    }
  });

  it('updates a real browser DOM binding across the reference lifecycle', () => {
    if (typeof document === 'undefined') return;

    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 7);
    const view = kb.viewModel<PersonViewModel, PersonModel>(reference);
    const node = document.createElement('div');
    const label = document.createElement('span');
    label.setAttribute('data-bind', "text: model() ? name() : ''");
    node.append(label);
    document.body.append(node);
    let bindingsApplied = false;

    try {
      ko.applyBindings(view, node);
      bindingsApplied = true;
      assert.strictEqual(label.textContent, '');

      const initialModel = new PersonModel({ id: 7, name: 'loaded' });
      collection.add(initialModel);
      assert.strictEqual(label.textContent, 'loaded');

      initialModel.set('name', 'changed');
      assert.strictEqual(label.textContent, 'changed');

      const replacement = new PersonModel({ id: 7, name: 'replacement' });
      collection.reset([replacement]);
      assert.strictEqual(label.textContent, 'replacement');

      collection.remove(replacement);
      assert.strictEqual(label.textContent, '');

      collection.add(new PersonModel({ id: 7, name: 'reloaded' }));
      assert.strictEqual(label.textContent, 'reloaded');
    } finally {
      if (bindingsApplied) ko.cleanNode(node);
      node.remove();
      view.dispose();
      reference.release();
    }
  });

  it('discovers attributes for two views across delayed loads and replacements', () => {
    interface DiscoveredViewModel {
      id: ko.Observable<number | null>;
      name: ko.Observable<string | null>;
      role: ko.Observable<string | null>;
      status: ko.Observable<string | null>;
    }

    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 7);
    const firstView = kb.viewModel<DiscoveredViewModel, PersonModel>(reference);
    const secondView = kb.viewModel<DiscoveredViewModel, PersonModel>(reference);

    assert.strictEqual(reference.ref_count, 3);
    assert.strictEqual(firstView.model(), null);
    assert.strictEqual(secondView.model(), null);
    const firstNameBeforeLoad = firstView.name;
    const secondNameBeforeLoad = secondView.name;
    assert.strictEqual(firstNameBeforeLoad, undefined);
    assert.strictEqual(secondNameBeforeLoad, undefined);

    const initialModel = new PersonModel({ id: 7, name: 'loaded' });
    collection.add(initialModel);

    assert.strictEqual(firstView.model(), initialModel);
    assert.strictEqual(secondView.model(), initialModel);
    assert.strictEqual(firstView.name(), 'loaded');
    assert.strictEqual(secondView.name(), 'loaded');

    const replacement = new PersonModel({ id: 7, name: 'replacement', role: 'admin' });
    collection.reset([replacement]);

    assert.strictEqual(firstView.model(), replacement);
    assert.strictEqual(secondView.model(), replacement);
    assert.strictEqual(firstView.role(), 'admin');
    assert.strictEqual(secondView.role(), 'admin');

    collection.remove(replacement);
    assert.strictEqual(firstView.model(), null);
    assert.strictEqual(secondView.model(), null);
    assert.strictEqual(firstView.name(), null);
    assert.strictEqual(secondView.role(), null);

    const reloadedModel = new PersonModel({ id: 7, name: 'reloaded', status: 'ready' });
    collection.add(reloadedModel);

    assert.strictEqual(firstView.model(), reloadedModel);
    assert.strictEqual(secondView.model(), reloadedModel);
    assert.strictEqual(firstView.status(), 'ready');
    assert.strictEqual(secondView.status(), 'ready');
    assert.strictEqual(listenerCount(reloadedModel, 'change'), 2);

    firstView.dispose();
    assert.strictEqual(reference.ref_count, 2);
    assert.strictEqual(listenerCount(reloadedModel, 'change'), 1);

    reloadedModel.set('name', 'survivor');
    assert.strictEqual(secondView.name(), 'survivor');

    secondView.dispose();
    assert.strictEqual(reference.ref_count, 1);
    assert.strictEqual(listenerCount(reloadedModel, 'change'), 0);
    assert.strictEqual(listenerCount(reference, 'loaded'), 0);
    assert.strictEqual(listenerCount(reference, 'unloaded'), 0);

    reference.release();
    assert.strictEqual(reference.ref_count, 0);
    assert.strictEqual(listenerCount(collection, 'add'), 0);
    assert.strictEqual(listenerCount(collection, 'remove'), 0);
    assert.strictEqual(listenerCount(collection, 'reset'), 0);
  });

  it('preserves explicit keys, requires, and mappings on a delayed load', () => {
    interface FilteredViewModel {
      name: ko.Observable<string | null>;
      required: ko.Observable<string | null>;
      displayName: ko.Observable<string | null>;
      id?: ko.Observable<number>;
      extra?: ko.Observable<string>;
    }

    const collection = new PersonCollection();
    const reference = new ModelRef(collection, 12);
    const view = kb.viewModel<FilteredViewModel, PersonModel>(reference, {
      keys: ['name'],
      requires: ['required'],
      mappings: {
        displayName: { key: 'name' },
      },
    });

    assert.strictEqual(view.name(), null);
    assert.strictEqual(view.required(), null);
    assert.strictEqual(view.displayName(), null);

    const model = new PersonModel({ id: 12, name: 'mapped', required: 'present', extra: 'filtered' });
    collection.add(model);

    assert.strictEqual(view.name(), 'mapped');
    assert.strictEqual(view.required(), 'present');
    assert.strictEqual(view.displayName(), 'mapped');
    assert.strictEqual(view.id, undefined);
    assert.strictEqual(view.extra, undefined);

    const replacement = new PersonModel({ id: 12, name: 'replacement', required: 'still present', extra: 'still filtered' });
    collection.reset([replacement]);

    assert.strictEqual(view.name(), 'replacement');
    assert.strictEqual(view.required(), 'still present');
    assert.strictEqual(view.displayName(), 'replacement');
    assert.strictEqual(view.id, undefined);
    assert.strictEqual(view.extra, undefined);

    view.dispose();
    assert.strictEqual(reference.ref_count, 1);
    reference.release();
  });
});
