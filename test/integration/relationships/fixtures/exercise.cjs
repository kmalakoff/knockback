const assert = require('assert');
const fs = require('node:fs');

function packageVersion(name) {
  return JSON.parse(fs.readFileSync(require.resolve(`${name}/package.json`), 'utf8')).version;
}

function listenerCount(target, eventName) {
  const listeners = target._events?.[eventName];
  if (!listeners) return 0;
  return Array.isArray(listeners) ? listeners.length : 1;
}

function childViewModel(_kb, counters) {
  return class ChildViewModel {
    constructor(model) {
      this.name = () => model.get('name');
      counters.created++;
    }

    dispose() {
      if (this.disposed) return;
      this.disposed = true;
      counters.disposed++;
    }
  };
}

function verifyRelationshipLifecycle(kb, parent, Child, counters) {
  const ChildViewModel = childViewModel(kb, counters);
  const vm = kb.viewModel(parent, {
    factories: {
      primary: ChildViewModel,
      'children.models': ChildViewModel,
    },
  });

  assert.strictEqual(vm.primary(), null);
  assert.strictEqual(vm.primary.valueType(), kb.TYPE_MODEL);
  assert.deepStrictEqual(vm.children(), []);
  assert.strictEqual(vm.children.valueType(), kb.TYPE_COLLECTION);
  assert.strictEqual(counters.created, 0);

  const primary = new Child({ id: 'primary', name: 'Primary' });
  parent.set({ primary });
  assert.ok(vm.primary() instanceof ChildViewModel);
  assert.strictEqual(vm.primary().name(), 'Primary');
  assert.strictEqual(counters.created, 1);

  parent.set({ primary: null });
  assert.strictEqual(vm.primary(), null);
  assert.strictEqual(counters.disposed, 1);

  const member = new Child({ id: 'member', name: 'Member' });
  const children = parent.get('children');
  children.add(member);
  assert.strictEqual(vm.children().length, 1);
  assert.ok(vm.children()[0] instanceof ChildViewModel);
  assert.strictEqual(counters.created, 2);
  children.remove(member);
  assert.deepStrictEqual(vm.children(), []);
  assert.strictEqual(counters.disposed, 1);

  vm.dispose();
  assert.strictEqual(counters.disposed, 2);
}

function verifyLegacyPublicCompatibility({ Backbone, kb, ko, underscore }) {
  assert.strictEqual(kb.Backbone, Backbone);
  assert.strictEqual(kb.Model, Backbone.Model);
  assert.strictEqual(kb.Collection, Backbone.Collection);
  assert.strictEqual(kb.Events, Backbone.Events);
  assert.strictEqual(kb.ko, ko);
  assert.strictEqual(kb._, underscore);
  assert.strictEqual(kb.modules.backbone, Backbone);
  assert.strictEqual(kb.modules.knockout, ko);
  assert.strictEqual(kb.modules.underscore, underscore);

  function LegacyFactoryView() {}
  const parentFactory = new kb.Factory();
  parentFactory.addPathMapping('parent', LegacyFactoryView);
  const childFactory = new kb.Factory(parentFactory);
  childFactory.addPathMapping('legacy', { view_model: LegacyFactoryView });
  assert.strictEqual(childFactory.creatorForPath(null, 'parent'), LegacyFactoryView);
  assert.strictEqual(childFactory.creatorForPath(null, 'legacy'), LegacyFactoryView);
  assert.strictEqual(childFactory.creatorForPath(null, 'missing'), null);
  assert.strictEqual(kb.compare(1, 2), -1);
  assert.strictEqual(kb.compare(2, 1), 1);

  const helperSource = ko.observable('one');
  let ignoreEvaluations = 0;
  const ignored = ko.computed(() => {
    ignoreEvaluations++;
    return kb.ignore(() => helperSource());
  });
  let peekEvaluations = 0;
  const peeked = ko.computed(() => {
    peekEvaluations++;
    return kb.peek(helperSource);
  });
  assert.strictEqual(ignored(), 'one');
  assert.strictEqual(peeked(), 'one');
  helperSource('two');
  assert.strictEqual(ignoreEvaluations, 1);
  assert.strictEqual(peekEvaluations, 1);
  ignored.dispose();
  peeked.dispose();

  const watcherModel = new Backbone.Model({ name: 'Ada' });
  const watcher = new kb.EventWatcher(watcherModel);
  const view = new kb.ViewModel(watcherModel, {
    event_watcher: watcher,
    statics: ['missing'],
    static_defaults: { missing: 'fallback' },
  });
  const value = new kb.Observable(watcherModel, 'name', { event_watcher: watcher });
  assert.strictEqual(view.name(), 'Ada');
  assert.strictEqual(view.missing, 'fallback');
  assert.strictEqual(value(), 'Ada');
  watcherModel.set('name', 'Grace');
  assert.strictEqual(view.name(), 'Grace');
  assert.strictEqual(value(), 'Grace');

  const first = new Backbone.Model({ id: 1, rank: 2 });
  const second = new Backbone.Model({ id: 2, rank: 1 });
  const collection = new Backbone.Collection([first, second]);
  const collectionValue = new kb.CollectionObservable(collection, { models_only: true, sort_attribute: 'rank' });
  assert.deepStrictEqual(collectionValue(), [second, first]);
  assert.strictEqual(kb.observableCollection, kb.collectionObservable);
  assert.strictEqual(kb.observableDefault, kb.defaultObservable);
  assert.strictEqual(kb.observableFormatted, kb.formattedObservable);
  assert.strictEqual(kb.observableLocalized, kb.localizedObservable);
  assert.strictEqual(kb.observableTriggered, kb.triggeredObservable);

  const target = ko.observable(null);
  const defaultValue = new kb.DefaultObservable(target, 'fallback');
  const firstName = ko.observable('Ada');
  const lastName = ko.observable('Lovelace');
  const formatted = new kb.FormattedObservable('{0} {1}', firstName, lastName);
  const triggered = new kb.TriggeredObservable(watcherModel, 'ready');
  let notifications = 0;
  triggered.subscribe(() => notifications++);
  watcherModel.trigger('ready');
  assert.strictEqual(defaultValue(), 'fallback');
  assert.strictEqual(formatted(), 'Ada Lovelace');
  assert.strictEqual(notifications, 1);

  const Parent = kb.ViewModel.extend(
    {
      parentLabel() {
        return this.name();
      },
    },
    { inheritedStatic: 'shared' }
  );
  const Child = Parent.extend(
    {
      childLabel() {
        return this.parentLabel().toUpperCase();
      },
    },
    { category: 'child' }
  );
  const childModel = new Backbone.Model({ name: 'Hopper' });
  const child = new Child(childModel);
  assert.ok(child instanceof Child);
  assert.ok(child instanceof Parent);
  assert.ok(child instanceof kb.ViewModel);
  assert.strictEqual(Child.inheritedStatic, 'shared');
  assert.strictEqual(Child.category, 'child');
  assert.strictEqual(child.childLabel(), 'HOPPER');

  child.dispose();
  triggered.dispose();
  formatted.dispose();
  defaultValue.dispose();
  collectionValue.dispose();
  value.dispose();
  view.dispose();
  watcher.dispose();
  assert.strictEqual(listenerCount(watcherModel, 'change'), 0);
  assert.strictEqual(listenerCount(childModel, 'change'), 0);
  assert.strictEqual(listenerCount(collection, 'all'), 0);
}

async function relational({ Backbone, kb, load }) {
  assert.strictEqual(Backbone.RelationalModel, undefined);
  await load('backbone-relational');
  assert.strictEqual(packageVersion('backbone-relational'), '0.10.0');
  assert.ok(Backbone.RelationalModel.prototype instanceof Backbone.Model);

  Backbone.Relational.store = new Backbone.Store();
  const Child = Backbone.RelationalModel.extend({});
  const Parent = Backbone.RelationalModel.extend({
    relations: [
      { key: 'primary', relatedModel: Child, type: Backbone.HasOne },
      { key: 'children', relatedModel: Child, type: Backbone.HasMany },
    ],
  });
  const parent = new Parent({ id: 'parent', primary: null, children: [] });
  verifyRelationshipLifecycle(kb, parent, Child, { created: 0, disposed: 0 });
}

async function associations({ Backbone, kb, load }) {
  assert.strictEqual(Backbone.AssociatedModel, undefined);
  const loaded = await load('backbone-associations');
  assert.strictEqual(packageVersion('backbone-associations'), '0.6.2');
  assert.ok(Backbone.AssociatedModel.prototype instanceof Backbone.Model);
  if (loaded && loaded.default) assert.strictEqual(loaded.default, Backbone);

  const Child = Backbone.AssociatedModel.extend({});
  const Parent = Backbone.AssociatedModel.extend({
    relations: [
      { key: 'primary', relatedModel: Child, type: Backbone.One },
      { key: 'children', relatedModel: Child, type: Backbone.Many },
    ],
  });
  const parent = new Parent({ id: 'parent', primary: null, children: [] });
  verifyRelationshipLifecycle(kb, parent, Child, { created: 0, disposed: 0 });
}

async function orm({ Backbone, kb, load }) {
  kb.configure({ orm: 'backbone-orm' });
  const loaded = await load('backbone-orm');
  const BackboneORM = loaded.default || loaded;
  assert.strictEqual(packageVersion('backbone-orm'), '0.7.14');

  let Child;
  Child = Backbone.Model.extend({
    model_name: 'MatrixChild',
    schema: { id: [{ manual: true }] },
  });
  const Parent = Backbone.Model.extend({
    model_name: 'MatrixParent',
    schema: {
      id: [{ manual: true }],
      primary: () => ['belongsTo', Child],
      children: () => ['hasMany', Child],
    },
  });
  Child.prototype.sync = BackboneORM.sync(Child);
  Parent.prototype.sync = BackboneORM.sync(Parent);

  const parent = new Parent({ id: 'parent' });
  verifyRelationshipLifecycle(kb, parent, Child, { created: 0, disposed: 0 });

  kb.configure({ orm: undefined });
  const schemaOnly = new Backbone.Model({ name: 'ordinary' });
  schemaOnly.schema = () => ({ relations: { phantom: { type: 'hasMany' } } });
  schemaOnly.relation = () => ({ type: 'hasMany' });
  const ordinary = kb.viewModel(schemaOnly);
  assert.strictEqual(ordinary.name(), 'ordinary');
  assert.strictEqual(ordinary.phantom, undefined);
  kb.dispose(ordinary);
}

async function mixed({ Backbone, kb, load }) {
  await load('backbone-relational');
  await load('backbone-associations');
  assert.ok(Backbone.RelationalModel.prototype instanceof Backbone.Model);
  assert.ok(Backbone.AssociatedModel.prototype instanceof Backbone.Model);

  Backbone.Relational.store = new Backbone.Store();
  const RelChild = Backbone.RelationalModel.extend({});
  const RelParent = Backbone.RelationalModel.extend({
    relations: [{ key: 'children', relatedModel: RelChild, type: Backbone.HasMany }],
  });
  const AssocChild = Backbone.AssociatedModel.extend({});
  const AssocParent = Backbone.AssociatedModel.extend({
    relations: [{ key: 'primary', relatedModel: AssocChild, type: Backbone.One }],
  });

  const relationalVM = kb.viewModel(new RelParent({ id: 'rel', children: [] }));
  const associationsVM = kb.viewModel(new AssocParent({ id: 'assoc', primary: null }));
  assert.strictEqual(relationalVM.children.valueType(), kb.TYPE_COLLECTION);
  assert.strictEqual(associationsVM.primary.valueType(), kb.TYPE_MODEL);
  kb.dispose(relationalVM);
  kb.dispose(associationsVM);
}

async function corePeer(context) {
  const { Backbone, kb, ko, load, underscore } = context;
  const config = JSON.parse(fs.readFileSync('case.json', 'utf8'));
  assert.strictEqual(Backbone.VERSION, config.backboneVersion);
  assert.strictEqual(ko.version, config.knockoutVersion);
  assert.strictEqual(underscore.VERSION, '1.13.8');
  assert.strictEqual(packageVersion('backbone'), config.backboneVersion);
  assert.strictEqual(packageVersion('knockout'), config.knockoutVersion);
  assert.strictEqual(packageVersion('underscore'), '1.13.8');
  verifyLegacyPublicCompatibility(context);

  const first = new Backbone.Model({ first: 'Ada', last: 'Lovelace' });
  const view = kb.viewModel(first, { keys: ['first', 'last'] });
  const labels = [];
  const label = ko.computed(() => `${view.first()} ${view.last()}`);
  const subscription = label.subscribe((value) => labels.push(value));
  assert.strictEqual(label(), 'Ada Lovelace');
  assert.strictEqual(listenerCount(first, 'change'), 1);

  first.set('first', 'Augusta');
  assert.strictEqual(label(), 'Augusta Lovelace');
  const replacement = new Backbone.Model({ first: 'Grace', last: 'Hopper' });
  view.model(replacement);
  assert.strictEqual(label(), 'Grace Hopper');
  assert.strictEqual(listenerCount(first, 'change'), 0);
  first.set('last', 'ignored');
  assert.strictEqual(label(), 'Grace Hopper');
  replacement.set('last', 'Murray Hopper');
  assert.strictEqual(label(), 'Grace Murray Hopper');
  assert.deepStrictEqual(labels, ['Augusta Lovelace', 'Grace Lovelace', 'Grace Hopper', 'Grace Murray Hopper']);

  view.dispose();
  assert.strictEqual(listenerCount(replacement, 'change'), 0);
  subscription.dispose();
  label.dispose();

  const loadedModelRef = await load('backbone-modelref');
  const ModelRef = loadedModelRef.default || loadedModelRef;
  assert.strictEqual(ModelRef.VERSION, '0.1.5');
  assert.strictEqual(Backbone.ModelRef, ModelRef);
  const collection = new Backbone.Collection();
  const reference = new ModelRef(collection, 7);
  const referencedView = kb.viewModel(reference, { keys: ['name'] });
  assert.strictEqual(referencedView.model(), null);
  assert.strictEqual(referencedView.name(), null);

  const loaded = new Backbone.Model({ id: 7, name: 'loaded' });
  collection.add(loaded);
  assert.strictEqual(referencedView.model(), loaded);
  assert.strictEqual(referencedView.name(), 'loaded');
  loaded.set('name', 'updated');
  assert.strictEqual(referencedView.name(), 'updated');

  collection.remove(loaded);
  assert.strictEqual(referencedView.model(), null);
  assert.strictEqual(referencedView.name(), null);
  const referencedReplacement = new Backbone.Model({ id: 7, name: 'replacement' });
  collection.add(referencedReplacement);
  assert.strictEqual(referencedView.model(), referencedReplacement);
  assert.strictEqual(referencedView.name(), 'replacement');
  assert.strictEqual(listenerCount(reference, 'loaded'), 1);
  assert.strictEqual(listenerCount(reference, 'unloaded'), 1);

  referencedView.dispose();
  assert.strictEqual(reference.ref_count, 1);
  assert.strictEqual(listenerCount(reference, 'loaded'), 0);
  assert.strictEqual(listenerCount(reference, 'unloaded'), 0);
  assert.strictEqual(listenerCount(referencedReplacement, 'change'), 0);
  reference.release();
  assert.strictEqual(reference.ref_count, 0);
  assert.strictEqual(listenerCount(collection, 'add'), 0);
  assert.strictEqual(listenerCount(collection, 'remove'), 0);
  assert.strictEqual(listenerCount(collection, 'reset'), 0);

  await relational(context);
  await associations(context);
  await orm(context);
}

async function explicitDefault({ Backbone, kb, load }) {
  let binds = 0;
  const adapter = {
    bind() {
      binds++;
      return () => undefined;
    },
    isAvailable: () => true,
    isModel: (model) => model instanceof Backbone.Model,
    useFunction: () => true,
  };
  kb.configure({ orm: 'default' });
  kb.registerORM('registered-after-default', adapter);
  assert.ok(kb.getRegisteredORMs().includes('registered-after-default'));
  await load('backbone-relational');

  const model = new Backbone.Model({ special: 'attribute' });
  model.special = () => 'function';
  const observable = kb.observable(model, 'special');
  assert.strictEqual(observable(), 'attribute');
  assert.strictEqual(binds, 0);
  kb.dispose(observable);
}

async function capture({ Backbone, kb }) {
  const calls = { bindA: 0, bindB: 0, unbindA: 0, unbindB: 0 };
  const adapterA = {
    bind() {
      calls.bindA++;
      return () => calls.unbindA++;
    },
    isAvailable: () => true,
    isModel: (model) => model instanceof Backbone.Model,
    useFunction: () => true,
  };
  const adapterB = {
    bind() {
      calls.bindB++;
      return () => calls.unbindB++;
    },
    isAvailable: () => true,
    isModel: (model) => model instanceof Backbone.Model,
    useFunction: () => false,
  };
  let functionValue = 'function-a';
  const model = new Backbone.Model({ special: 'attribute-b' });
  model.special = function special(value) {
    if (arguments.length) functionValue = value;
    return functionValue;
  };

  kb.configure({ orm: adapterA });
  const first = kb.observable(model, 'special');
  assert.strictEqual(first(), 'function-a');
  kb.configure({ orm: adapterB });
  model.trigger('change:special', model);
  assert.strictEqual(first(), 'function-a');
  first('function-write');
  assert.strictEqual(functionValue, 'function-write');
  assert.strictEqual(model.get('special'), 'attribute-b');

  const second = kb.observable(model, 'special');
  assert.strictEqual(second(), 'attribute-b');
  second('attribute-write');
  assert.strictEqual(model.get('special'), 'attribute-write');
  assert.strictEqual(functionValue, 'function-write');

  kb.dispose(first);
  kb.dispose(second);
  assert.deepStrictEqual(calls, { bindA: 1, bindB: 1, unbindA: 1, unbindB: 1 });
}

function verifyFalsyFactoryPrecedence({ Backbone, kb }) {
  const constructed = [];
  class CustomValue {
    constructor(value) {
      this.value = value;
      constructed.push(value);
    }
  }

  for (const value of [0, false, '']) {
    const vm = kb.viewModel(new Backbone.Model({ x: value }), { factories: { x: CustomValue } });
    assert.ok(vm.x() instanceof CustomValue);
    assert.strictEqual(vm.x().value, value);
    vm.dispose();
  }
  const nullVm = kb.viewModel(new Backbone.Model({ x: null }), { factories: { x: CustomValue } });
  assert.strictEqual(nullVm.x(), null);
  nullVm.dispose();
  assert.deepStrictEqual(constructed, [0, false, '']);
}

function verifyAdapterBoundaries({ Backbone, kb }) {
  const RelationModel = Backbone.Model.extend({
    relationshipKeys() {
      return ['children'];
    },
  });
  let binds = 0;
  let keys = 0;
  let unbinds = 0;
  const adapter = {
    bind(model, key, update) {
      binds++;
      model.on(`change:${key}`, update);
      return () => {
        unbinds++;
        model.off(`change:${key}`, update);
      };
    },
    isAvailable: () => true,
    isModel: (model) => model instanceof RelationModel,
    keys(model) {
      keys++;
      return model.relationshipKeys();
    },
    relationType: (_model, key) => (key === 'children' ? kb.TYPE_COLLECTION : null),
    useFunction: () => false,
  };

  kb.configure({ orm: adapter });
  const ordinary = kb.viewModel(new Backbone.Model({ name: 'ordinary' }));
  assert.strictEqual(ordinary.name(), 'ordinary');
  assert.strictEqual(keys, 0);
  ordinary.dispose();

  kb.registerORM('matrix-guarded-concrete', adapter);
  kb.configure({ orm: 'matrix-guarded-concrete' });
  const registeredOrdinary = kb.viewModel(new Backbone.Model({ name: 'registered ordinary' }));
  assert.strictEqual(registeredOrdinary.name(), 'registered ordinary');
  assert.strictEqual(keys, 0);
  registeredOrdinary.dispose();

  kb.registerORM('matrix-guarded-concrete-alias', adapter);
  kb.configure({ orm: undefined });

  const counters = { created: 0, disposed: 0 };
  const ChildViewModel = childViewModel(kb, counters);
  const parent = new RelationModel({ children: null });
  const vm = kb.viewModel(parent, { factories: { 'children.models': ChildViewModel } });
  assert.strictEqual(vm.children(), null);
  assert.strictEqual(vm.children.valueType(), kb.TYPE_COLLECTION);

  const firstCollection = new Backbone.Collection([new Backbone.Model({ id: 'ada', name: 'Ada' })]);
  parent.set('children', firstCollection);
  assert.strictEqual(vm.children().length, 1);
  assert.strictEqual(vm.children()[0].name(), 'Ada');
  assert.strictEqual(typeof vm.children.value().collection, 'function');

  const secondCollection = new Backbone.Collection([new Backbone.Model({ id: 'grace', name: 'Grace' })]);
  parent.set('children', secondCollection);
  assert.strictEqual(vm.children().length, 1);
  assert.strictEqual(vm.children()[0].name(), 'Grace');
  firstCollection.add(new Backbone.Model({ id: 'ignored', name: 'Ignored' }));
  assert.strictEqual(vm.children().length, 1);

  parent.set('children', null);
  assert.deepStrictEqual(vm.children(), []);
  secondCollection.add(new Backbone.Model({ id: 'also-ignored', name: 'Also ignored' }));
  assert.deepStrictEqual(vm.children(), []);
  assert.deepStrictEqual(counters, { created: 2, disposed: 0 });
  vm.dispose();
  assert.deepStrictEqual(counters, { created: 2, disposed: 2 });

  const scalar = kb.viewModel(new RelationModel({ children: 'scalar' }));
  assert.strictEqual(scalar.children(), 'scalar');
  assert.strictEqual(scalar.children.valueType(), kb.TYPE_SIMPLE);
  scalar.dispose();
  assert.strictEqual(binds, unbinds);

  const firstMatch = { isAvailable: () => true, isModel: (model) => model instanceof RelationModel };
  const secondMatch = { isAvailable: () => true, isModel: (model) => model instanceof RelationModel };
  kb.registerORM('matrix-ambiguous-a', firstMatch);
  kb.registerORM('matrix-ambiguous-b', secondMatch);
  kb.configure({ orm: undefined });
  assert.throws(
    () => kb.viewModel(new RelationModel({ children: null })),
    (error) => error.message.includes('matrix-ambiguous-a') && error.message.includes('matrix-ambiguous-b') && error.message.includes('configure')
  );
  kb.registerORM('matrix-ambiguous-a', null);
  kb.registerORM('matrix-ambiguous-b', null);
  kb.registerORM('matrix-guarded-concrete', null);
  kb.registerORM('matrix-guarded-concrete-alias', null);
  kb.configure({ orm: undefined });
}

async function boundaries(context) {
  verifyFalsyFactoryPrecedence(context);
  verifyAdapterBoundaries(context);
}

async function run(context) {
  const config = JSON.parse(fs.readFileSync('case.json', 'utf8'));
  assert.strictEqual(context.Backbone.VERSION, config.backboneVersion);
  if (config.scenario === 'relational') await relational(context);
  else if (config.scenario === 'associations') await associations(context);
  else if (config.scenario === 'orm') await orm(context);
  else if (config.scenario === 'mixed') await mixed(context);
  else if (config.scenario === 'default') await explicitDefault(context);
  else if (config.scenario === 'capture') await capture(context);
  else if (config.scenario === 'boundaries') await boundaries(context);
  else if (config.scenario === 'core-peer') await corePeer(context);
  else throw new Error(`Unknown scenario: ${config.scenario}`);
  console.log(`passed ${config.name}`);
}

module.exports = { run };
