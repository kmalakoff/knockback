import type kbNamespace from '@mcpeasy/knockback';
import type { ObservableValue, ORM } from '@mcpeasy/knockback';
import type BackboneModule from 'backbone';
import type ModelRef from 'backbone-modelref';
import type knockout from 'knockout';
import type underscore from 'underscore';
import { CORE_PEER_COMBINATIONS, CORE_PEER_VERSIONS, type CorePeerCombination, RELATIONSHIP_VERSIONS } from './cases.ts';

interface BrowserCase {
  backbonePath: string;
  backboneVersion: string;
  name: string;
  plugin: 'associations' | 'orm' | 'relational';
  pluginBrowserPath?: string;
  pluginPath: string;
  pluginVersion: string;
}

interface BrowserModelConstructor {
  new (attributes?: object): BackboneModule.Model;
  prototype: BackboneModule.Model;
}

interface BrowserORM {
  sync(modelType: BrowserModelConstructor): BackboneModule.Model['sync'];
}

type BrowserBackbone = typeof BackboneModule & {
  VERSION: string;
  AssociatedModel?: typeof BackboneModule.Model;
  RelationalModel?: typeof BackboneModule.Model;
  Relational?: { store: unknown };
  Store?: new () => unknown;
  HasOne?: unknown;
  HasMany?: unknown;
  One?: unknown;
  Many?: unknown;
  ModelRef?: typeof ModelRef;
};

interface FixtureRelationModel extends BackboneModule.Model {
  relationshipKeys(): string[];
}

interface BrowserGlobals extends Window {
  Backbone: BrowserBackbone;
  BackboneORM?: BrowserORM;
  _: typeof underscore;
  backboneModelref?: typeof ModelRef;
  kb?: typeof kbNamespace;
  mcpeasyKnockback?: typeof kbNamespace | { default: typeof kbNamespace };
  ko: typeof knockout;
  relationshipErrors?: string[];
  __relationshipBrowserORM?: BrowserORM;
}

interface InstalledVersions {
  associations: string;
  backbone: string;
  knockout: string;
  modelRef: string;
  orm: string;
  relational: string;
  underscore: string;
}

const cases: BrowserCase[] = [
  ...(['1.6.1', '1.2.3'] as const).flatMap((backboneVersion) => {
    const backbonePath = backboneVersion === '1.6.1' ? '/node_modules/backbone/backbone.js' : '/node_modules/backbone-legacy/backbone.js';
    return [
      {
        backbonePath,
        backboneVersion,
        name: `relational-${backboneVersion}`,
        plugin: 'relational' as const,
        pluginPath: '/node_modules/backbone-relational/backbone-relational.js',
        pluginVersion: '0.10.0',
      },
      {
        backbonePath,
        backboneVersion,
        name: `associations-${backboneVersion}`,
        plugin: 'associations' as const,
        pluginPath: '/node_modules/backbone-associations/backbone-associations.js',
        pluginVersion: '0.6.2',
      },
      {
        backbonePath,
        backboneVersion,
        name: `orm-${backboneVersion}`,
        plugin: 'orm' as const,
        pluginBrowserPath: '/__browser-modules/orm.js',
        pluginPath: '/__browser-artifacts/orm.js',
        pluginVersion: '0.7.14',
      },
    ];
  }),
];

function check(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function listenerCount(target: object, eventName: string): number {
  const events: unknown = Reflect.get(target, '_events');
  if (!events || typeof events !== 'object') return 0;
  const listeners: unknown = Reflect.get(events, eventName);
  if (!listeners) return 0;
  return Array.isArray(listeners) ? listeners.length : 1;
}

function loadScript(frame: BrowserGlobals, source: string, module = false): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = frame.document.createElement('script');
    if (module) script.type = 'module';
    const timer = setTimeout(() => reject(new Error(`Timed out loading browser fixture: ${source}`)), 4_000);
    script.src = source;
    script.onload = () => {
      clearTimeout(timer);
      resolve();
    };
    script.onerror = () => {
      clearTimeout(timer);
      reject(new Error(`Could not load browser fixture: ${source}`));
    };
    frame.document.head.append(script);
  });
}

async function packageVersion(packageName: string): Promise<string> {
  const response = await fetch(`/node_modules/${packageName}/package.json`);
  check(response.ok, `Could not read ${packageName} package metadata`);
  return ((await response.json()) as { version: string }).version;
}

function exerciseAdapterBoundaries(frame: BrowserGlobals, kb: typeof kbNamespace): void {
  const { Backbone } = frame;
  const constructed: unknown[] = [];
  class CustomValue {
    value: unknown;

    constructor(value: unknown) {
      this.value = value;
      constructed.push(value);
    }
  }

  for (const value of [0, false, '']) {
    const vm = kb.viewModel<{ x: ObservableValue<unknown> }>(new Backbone.Model({ x: value }), {
      factories: { x: CustomValue },
    });
    const presented = vm.x();
    check(presented instanceof CustomValue && presented.value === value, 'Explicit factories must take precedence for falsy values');
    vm.dispose();
  }
  const nullVm = kb.viewModel<{ x: ObservableValue<unknown> }>(new Backbone.Model({ x: null }), {
    factories: { x: CustomValue },
  });
  check(nullVm.x() === null, 'A null ordinary attribute must remain null');
  nullVm.dispose();
  check(JSON.stringify(constructed) === JSON.stringify([0, false, '']), 'A falsy explicit factory was not constructed exactly once');

  const RelationModel: new (attributes?: object) => FixtureRelationModel = Backbone.Model.extend({
    relationshipKeys() {
      return ['children'];
    },
  });
  let binds = 0;
  let keys = 0;
  let unbinds = 0;
  const adapter: ORM<FixtureRelationModel> = {
    bind(model, key, update) {
      binds++;
      model.on(`change:${key}`, update);
      return () => {
        unbinds++;
        model.off(`change:${key}`, update);
      };
    },
    isAvailable: () => true,
    isModel: (model): model is FixtureRelationModel => model instanceof RelationModel,
    keys(model) {
      keys++;
      return model.relationshipKeys();
    },
    relationType: (_model, key) => (key === 'children' ? kb.TYPE_COLLECTION : null),
    useFunction: () => false,
  };
  kb.configure({ orm: adapter });

  const ordinary = kb.viewModel<{ name: ObservableValue<unknown> }>(new Backbone.Model({ name: 'ordinary' }));
  check(ordinary.name() === 'ordinary' && keys === 0, 'A concrete adapter received an ordinary Backbone model');
  ordinary.dispose();

  const counters = { created: 0, disposed: 0 };
  class ChildViewModel {
    disposed = false;
    name: () => unknown;

    constructor(model: BackboneModule.Model) {
      this.name = () => model.get('name');
      counters.created++;
    }

    dispose(): void {
      if (this.disposed) return;
      this.disposed = true;
      counters.disposed++;
    }
  }

  const parent = new RelationModel({ children: null });
  const vm = kb.viewModel<{ children: ObservableValue<unknown> }>(parent, {
    factories: { 'children.models': ChildViewModel },
  });
  check(vm.children() === null && vm.children.valueType() === kb.TYPE_COLLECTION, 'A null collection relationship lost its declared type');

  const first = new Backbone.Collection([new Backbone.Model({ name: 'Ada' })]);
  parent.set('children', first);
  const firstChildren = vm.children();
  check(Array.isArray(firstChildren), 'A loaded relationship did not present an array');
  const firstChild: unknown = firstChildren[0];
  const readValue: unknown = Reflect.get(vm.children, 'value');
  check(typeof readValue === 'function', 'The relationship observable did not expose its current value');
  const presentedCollection: unknown = readValue.call(vm.children);
  check(
    firstChild instanceof ChildViewModel && firstChild.name() === 'Ada' && presentedCollection !== null && (typeof presentedCollection === 'object' || typeof presentedCollection === 'function') && typeof Reflect.get(presentedCollection, 'collection') === 'function',
    'A null relationship did not become a collection observable'
  );

  const second = new Backbone.Collection([new Backbone.Model({ name: 'Grace' })]);
  parent.set('children', second);
  const secondChildren = vm.children();
  check(Array.isArray(secondChildren), 'A replaced relationship did not present an array');
  const secondChild: unknown = secondChildren[0];
  check(secondChildren.length === 1 && secondChild instanceof ChildViewModel && secondChild.name() === 'Grace', 'A loaded relationship did not replace its collection');
  first.add(new Backbone.Model({ name: 'Ignored' }));
  const afterReplacedAdd = vm.children();
  check(Array.isArray(afterReplacedAdd) && afterReplacedAdd.length === 1, 'A replaced collection remained bound');

  parent.set('children', null);
  second.add(new Backbone.Model({ name: 'Also ignored' }));
  const unloadedChildren = vm.children();
  check(Array.isArray(unloadedChildren) && unloadedChildren.length === 0, 'An unloaded collection remained bound');
  check(JSON.stringify(counters) === JSON.stringify({ created: 2, disposed: 0 }), 'Collection children were disposed before their owner');
  vm.dispose();
  check(JSON.stringify(counters) === JSON.stringify({ created: 2, disposed: 2 }), 'Collection children were not disposed exactly once with their owner');

  const scalar = kb.viewModel<{ children: ObservableValue<unknown> }>(new RelationModel({ children: 'scalar' }));
  check(scalar.children() === 'scalar' && scalar.children.valueType() === kb.TYPE_SIMPLE, 'A scalar was fabricated into a collection relationship');
  scalar.dispose();
  check(binds === unbinds, 'Concrete adapter bindings were not released');

  kb.registerORM('browser-ambiguous-a', {
    isAvailable: () => true,
    isModel: (model): model is FixtureRelationModel => model instanceof RelationModel,
  });
  kb.registerORM('browser-ambiguous-b', {
    isAvailable: () => true,
    isModel: (model): model is FixtureRelationModel => model instanceof RelationModel,
  });
  kb.configure({ orm: undefined });
  let ambiguity = '';
  try {
    kb.viewModel(new RelationModel({ children: null }));
  } catch (error) {
    ambiguity = error instanceof Error ? error.message : String(error);
  }
  check(ambiguity.includes('browser-ambiguous-a') && ambiguity.includes('browser-ambiguous-b') && ambiguity.includes('configure'), 'Automatic adapter ambiguity did not identify the candidates and explicit-choice remedy');
  kb.registerORM('browser-ambiguous-a', null);
  kb.registerORM('browser-ambiguous-b', null);
  kb.configure({ orm: undefined });
}

function exercise(frame: BrowserGlobals, testCase: BrowserCase): void {
  const { Backbone, BackboneORM } = frame;
  const loaded = frame.mcpeasyKnockback;
  const kb = (loaded && 'default' in loaded ? loaded.default : undefined) || frame.kb || loaded;
  check(Backbone.VERSION === testCase.backboneVersion, `Expected Backbone ${testCase.backboneVersion}, received ${Backbone.VERSION}`);
  check(kb && 'ViewModel' in kb && kb.ViewModel, `The local UMD candidate did not initialize: ${(frame.relationshipErrors || []).join('; ') || 'no browser error reported'}`);

  let PrimaryChild: BrowserModelConstructor;
  let MemberChild: BrowserModelConstructor;
  let Parent: BrowserModelConstructor;
  if (testCase.plugin === 'relational') {
    const RelationalModel = Backbone.RelationalModel;
    check(RelationalModel && RelationalModel.prototype instanceof Backbone.Model, 'Backbone.Relational did not patch the fixture Backbone');
    check(Backbone.Relational && Backbone.Store, 'Backbone.Relational did not expose its store constructor');
    Backbone.Relational.store = new Backbone.Store();
    PrimaryChild = RelationalModel.extend({});
    MemberChild = RelationalModel.extend({});
    Parent = RelationalModel.extend({
      relations: [
        { key: 'primary', relatedModel: PrimaryChild, type: Backbone.HasOne },
        { key: 'children', relatedModel: MemberChild, type: Backbone.HasMany },
      ],
    });
  } else if (testCase.plugin === 'associations') {
    const AssociatedModel = Backbone.AssociatedModel;
    check(AssociatedModel && AssociatedModel.prototype instanceof Backbone.Model, 'Backbone.Associations did not patch the fixture Backbone');
    PrimaryChild = AssociatedModel.extend({});
    MemberChild = AssociatedModel.extend({});
    Parent = AssociatedModel.extend({
      relations: [
        { key: 'primary', relatedModel: PrimaryChild, type: Backbone.One },
        { key: 'children', relatedModel: MemberChild, type: Backbone.Many },
      ],
    });
  } else {
    check(BackboneORM, 'BackboneORM did not initialize from its published browser artifact');
    check(frame.__relationshipBrowserORM === BackboneORM, 'The public browser overlay did not retain the UMD runtime');
    kb.configure({ orm: 'backbone-orm' });
    PrimaryChild = Backbone.Model.extend({
      model_name: 'BrowserPrimaryChild',
      schema: { id: [{ manual: true }] },
    });
    MemberChild = Backbone.Model.extend({
      model_name: 'BrowserMemberChild',
      schema: { id: [{ manual: true }] },
    });
    Parent = Backbone.Model.extend({
      model_name: 'BrowserParent',
      schema: {
        id: [{ manual: true }],
        primary: () => ['belongsTo', PrimaryChild],
        children: () => ['hasMany', MemberChild],
      },
    });
    PrimaryChild.prototype.sync = BackboneORM.sync(PrimaryChild);
    MemberChild.prototype.sync = BackboneORM.sync(MemberChild);
    Parent.prototype.sync = BackboneORM.sync(Parent);
  }

  const counters = { created: 0, disposed: 0 };
  class ChildViewModel {
    disposed = false;
    name: () => unknown;

    constructor(model: BackboneModule.Model) {
      this.name = () => model.get('name');
      counters.created++;
    }

    dispose(): void {
      if (this.disposed) return;
      this.disposed = true;
      counters.disposed++;
    }
  }

  const parent = new Parent({ id: 'parent', primary: null, children: [] });
  const vm = kb.viewModel<{ children: ObservableValue<unknown>; primary: ObservableValue<unknown> }>(parent, {
    factories: { primary: ChildViewModel, 'children.models': ChildViewModel },
  });
  check(vm.primary() === null, 'Null HasOne must remain null');
  check(vm.primary.valueType() === kb.TYPE_MODEL, 'Null HasOne must retain model type');
  const initialChildren = vm.children();
  check(Array.isArray(initialChildren) && initialChildren.length === 0, 'Empty HasMany must remain an empty collection');
  check(vm.children.valueType() === kb.TYPE_COLLECTION, 'Empty HasMany must retain collection type');

  parent.set({ primary: new PrimaryChild({ id: 'primary', name: 'Primary' }) });
  check(vm.primary() instanceof ChildViewModel, 'HasOne did not create the configured child view model');
  parent.set({ primary: null });
  const member = new MemberChild({ id: 'member', name: 'Member' });
  const children: unknown = parent.get('children');
  check(children instanceof Backbone.Collection, 'HasMany did not create a collection on the shared Backbone');
  children.add(member);
  const presentedChildren = vm.children();
  check(Array.isArray(presentedChildren) && presentedChildren[0] instanceof ChildViewModel, 'HasMany did not create the configured child view model');
  children.remove(member);
  check(counters.disposed === 1, 'HasOne did not release its child or HasMany disposed its store-owned child prematurely');
  vm.dispose();
  check(JSON.stringify(counters) === JSON.stringify({ created: 2, disposed: 2 }), 'The owning view model did not dispose the cached HasMany child exactly once');

  if (testCase.name === 'relational-1.6.1') exerciseAdapterBoundaries(frame, kb);
}

async function installedVersions(testCase: CorePeerCombination): Promise<InstalledVersions> {
  const response = await fetch(`/__core-peer/${testCase.name}/versions.json`);
  check(response.ok, `Could not read installed versions for ${testCase.name}`);
  return response.json() as Promise<InstalledVersions>;
}

function exerciseCorePeer(frame: BrowserGlobals, testCase: CorePeerCombination): void {
  const { Backbone, ko } = frame;
  const loadedNamespace = frame.mcpeasyKnockback;
  const kb = (loadedNamespace && 'default' in loadedNamespace ? loadedNamespace.default : undefined) || frame.kb || loadedNamespace;
  check(kb && 'ViewModel' in kb && kb.ViewModel, 'The core peer cell did not initialize Knockback');
  check(Backbone.VERSION === testCase.backboneVersion, `Expected Backbone ${testCase.backboneVersion}, received ${Backbone.VERSION}`);
  check(ko.version === testCase.knockoutVersion, `Expected Knockout ${testCase.knockoutVersion}, received ${ko.version}`);
  check(frame._.VERSION === CORE_PEER_VERSIONS.underscore, `Expected Underscore ${CORE_PEER_VERSIONS.underscore}, received ${frame._.VERSION}`);
  check(kb.Backbone === Backbone, 'The legacy namespace does not expose the cell Backbone identity');
  check(kb.Model === Backbone.Model && kb.Collection === Backbone.Collection && kb.Events === Backbone.Events, 'The legacy Backbone constructors do not preserve the cell identity');
  check(kb.ko === ko && kb._ === frame._, 'The legacy dependency properties do not preserve the cell identities');
  check(kb.modules.backbone === Backbone && kb.modules.knockout === ko && kb.modules.underscore === frame._, 'The legacy modules identities differ from the cell dependencies');

  class LegacyFactoryView {}
  const parentFactory = new kb.Factory();
  parentFactory.addPathMapping('parent', LegacyFactoryView);
  const childFactory = new kb.Factory(parentFactory);
  childFactory.addPathMapping('legacy', { view_model: LegacyFactoryView });
  check(childFactory.creatorForPath(null, 'parent') === LegacyFactoryView, 'Factory lost a parent creator');
  check(childFactory.creatorForPath(null, 'legacy') === LegacyFactoryView, 'Factory did not unwrap view_model');
  check(childFactory.creatorForPath(null, 'missing') === null, 'Factory changed its missing creator result');
  check(kb.compare(1, 2) === -1 && kb.compare(2, 1) === 1, 'The legacy scalar comparator changed ordering');

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
  check(ignored() === 'one' && peeked() === 'one', 'The legacy helper reads changed their values');
  helperSource('two');
  check(ignoreEvaluations === 1 && peekEvaluations === 1, 'The legacy helpers captured a dependency');
  ignored.dispose();
  peeked.dispose();

  const injectNode = frame.document.createElement('div');
  frame.document.body.append(injectNode);
  let injectedDisposals = 0;
  class InjectedViewModel {
    parent: unknown;

    constructor(parent: unknown) {
      this.parent = parent;
    }

    dispose(): void {
      injectedDisposals++;
    }
  }
  const injectParent = { name: 'parent' };
  const injected = kb.Inject.inject({ view_model: InjectedViewModel }, injectParent, injectNode);
  check(injected instanceof InjectedViewModel && injected.parent === injectParent, 'Inject did not construct view_model with its parent');
  ko.removeNode(injectNode);
  check(injectedDisposals === 1, 'Inject did not release its constructed view model once');
  check(typeof ko.bindingHandlers.inject?.init === 'function', 'The public inject binding was not registered');

  const legacyModel = new Backbone.Model({ name: 'Ada' });
  const watcher = new kb.EventWatcher(legacyModel);
  const legacyView = new kb.ViewModel<{ name: ObservableValue<unknown>; missing: string }>(legacyModel, {
    event_watcher: watcher,
    statics: ['missing'],
    static_defaults: { missing: 'fallback' },
  });
  const legacyValue = new kb.Observable(legacyModel, 'name', { event_watcher: watcher });
  check(legacyView.name() === 'Ada' && legacyView.missing === 'fallback' && legacyValue() === 'Ada', 'Legacy constructors or snake options failed');
  legacyModel.set('name', 'Grace');
  check(legacyView.name() === 'Grace' && legacyValue() === 'Grace', 'Legacy constructors did not react to model changes');

  const rankedFirst = new Backbone.Model({ id: 1, rank: 2 });
  const rankedSecond = new Backbone.Model({ id: 2, rank: 1 });
  const rankedCollection = new Backbone.Collection([rankedFirst, rankedSecond]);
  const legacyCollection = new kb.CollectionObservable(rankedCollection, { models_only: true, sort_attribute: 'rank' });
  check(legacyCollection()[0] === rankedSecond && legacyCollection()[1] === rankedFirst, 'Legacy collection constructor options failed');
  check(kb.observableCollection === kb.collectionObservable && kb.observableDefault === kb.defaultObservable, 'Legacy collection/default factory aliases differ');
  check(kb.observableFormatted === kb.formattedObservable && kb.observableLocalized === kb.localizedObservable, 'Legacy formatting/localization factory aliases differ');
  check(kb.observableTriggered === kb.triggeredObservable, 'Legacy triggering factory alias differs');

  const Parent = kb.ViewModel.extend(
    {
      parentLabel() {
        const name = this.name;
        check(typeof name === 'function', 'The parent subclass did not expose its name observable');
        const value: unknown = name();
        check(typeof value === 'string', 'The parent subclass did not read its string name');
        return value;
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
  check(child instanceof Child && child instanceof Parent && child instanceof kb.ViewModel, 'ViewModel.extend lost parent or child instance behavior');
  check(Child.inheritedStatic === 'shared' && Child.category === 'child' && child.childLabel() === 'HOPPER', 'ViewModel.extend lost static or prototype behavior');

  child.dispose();
  legacyCollection.dispose();
  legacyValue.dispose();
  legacyView.dispose();
  watcher.dispose();
  check(listenerCount(legacyModel, 'change') === 0 && listenerCount(childModel, 'change') === 0, 'Legacy constructor cleanup left model listeners');

  const first = new Backbone.Model({ first: 'Ada', last: 'Lovelace' });
  const view = kb.viewModel<{ first: ObservableValue<string>; last: ObservableValue<string> }>(first, { keys: ['first', 'last'] });
  const input = frame.document.createElement('input');
  input.setAttribute('data-bind', 'value: first');
  frame.document.body.append(input);
  ko.applyBindings(view, input);
  const labels: string[] = [];
  const label = ko.computed(() => `${view.first()} ${view.last()}`);
  const subscription = label.subscribe((value: string) => labels.push(value));
  check(label() === 'Ada Lovelace' && input.value === 'Ada', 'Initial model values did not reach the computed or binding');

  input.value = 'Augusta';
  const changeEvent = frame.document.createEvent('Event');
  changeEvent.initEvent('change', true, true);
  input.dispatchEvent(changeEvent);
  check(first.get('first') === 'Augusta' && label() === 'Augusta Lovelace', 'The Knockout binding did not update the Backbone model');
  const replacement = new Backbone.Model({ first: 'Grace', last: 'Hopper' });
  view.model(replacement);
  check(label() === 'Grace Hopper' && input.value === 'Grace', 'Model replacement did not update the binding and computed');
  first.set('last', 'ignored');
  check(label() === 'Grace Hopper', 'The replaced model remained bound');
  replacement.set('last', 'Murray Hopper');
  check(label() === 'Grace Murray Hopper', 'The replacement model did not update the computed');
  check(JSON.stringify(labels) === JSON.stringify(['Augusta Lovelace', 'Grace Lovelace', 'Grace Hopper', 'Grace Murray Hopper']), 'Computed notifications differed from the core lifecycle');

  ko.removeNode(input);
  view.dispose();
  check(listenerCount(first, 'change') === 0 && listenerCount(replacement, 'change') === 0, 'Ordinary model bindings survived disposal');
  subscription.dispose();
  label.dispose();

  const ModelRef = frame.backboneModelref;
  check(ModelRef?.VERSION === CORE_PEER_VERSIONS.modelRef, 'The accepted ModelRef UMD artifact did not initialize');
  check(Backbone.ModelRef === ModelRef, 'ModelRef did not install on the shared Backbone identity');
  const collection = new Backbone.Collection();
  const reference = new ModelRef(collection, 7);
  const referencedView = kb.viewModel<{ name: ObservableValue<unknown> }>(reference, { keys: ['name'] });
  check(referencedView.model() === null && referencedView.name() === null, 'An unloaded ModelRef did not initialize empty');
  const loaded = new Backbone.Model({ id: 7, name: 'loaded' });
  collection.add(loaded);
  check(referencedView.model() === loaded && referencedView.name() === 'loaded', 'ModelRef load did not update the view');
  loaded.set('name', 'updated');
  check(referencedView.name() === 'updated', 'ModelRef model updates did not reach the view');
  collection.remove(loaded);
  check(referencedView.model() === null && referencedView.name() === null, 'ModelRef unload did not clear the view');
  const referencedReplacement = new Backbone.Model({
    id: 7,
    name: 'replacement',
  });
  collection.add(referencedReplacement);
  check(referencedView.model() === referencedReplacement && referencedView.name() === 'replacement', 'ModelRef replacement did not update the view');
  referencedView.dispose();
  check(reference.ref_count === 1, 'View disposal did not release its ModelRef ownership');
  check(listenerCount(reference, 'loaded') === 0 && listenerCount(reference, 'unloaded') === 0, 'View disposal left ModelRef listeners');
  check(listenerCount(referencedReplacement, 'change') === 0, 'View disposal left replacement-model listeners');
  reference.release();
  check(Number(reference.ref_count) === 0, 'The caller could not release final ModelRef ownership');
  check(listenerCount(collection, 'add') === 0 && listenerCount(collection, 'remove') === 0 && listenerCount(collection, 'reset') === 0, 'ModelRef disposal left collection listeners');

  const base = {
    backbonePath: '',
    backboneVersion: testCase.backboneVersion,
    pluginPath: '',
    pluginVersion: '',
  };
  exercise(frame, {
    ...base,
    name: `${testCase.name}-relational`,
    plugin: 'relational',
  });
  exercise(frame, {
    ...base,
    name: `${testCase.name}-associations`,
    plugin: 'associations',
  });
  exercise(frame, { ...base, name: `${testCase.name}-orm`, plugin: 'orm' });
}

const describeBrowser = typeof document === 'undefined' ? describe.skip : describe;

describeBrowser('published relationship browser artifacts', function () {
  this.timeout(10_000);

  for (const testCase of cases) {
    it(testCase.name, async () => {
      const iframe = document.createElement('iframe');
      const frameReady = new Promise<void>((resolve) => {
        iframe.onload = () => resolve();
      });
      iframe.srcdoc = '<!doctype html><html><head></head><body></body></html>';
      document.body.append(iframe);
      try {
        await frameReady;
        const frame = iframe.contentWindow as BrowserGlobals | null;
        check(frame, 'Could not create an isolated browser fixture');
        Reflect.deleteProperty(frame, 'define');
        Reflect.deleteProperty(frame, 'exports');
        Reflect.deleteProperty(frame, 'module');
        frame.relationshipErrors = [];
        frame.addEventListener('error', (event) => frame.relationshipErrors?.push(event.message));
        await loadScript(frame, '/node_modules/underscore/underscore-umd.js');
        await loadScript(frame, testCase.backbonePath);
        const backboneIdentity = frame.Backbone;
        await loadScript(frame, '/node_modules/knockout/build/output/knockout-latest.js');
        await loadScript(frame, testCase.pluginPath);
        if (testCase.pluginBrowserPath) await loadScript(frame, testCase.pluginBrowserPath, true);
        check(frame.Backbone === backboneIdentity, 'The relationship plugin replaced the shared Backbone identity');
        await loadScript(frame, '/__relationship-fixtures/knockback.js');
        check(frame.Backbone === backboneIdentity, 'The Knockback candidate replaced the shared Backbone identity');

        const packageName = testCase.plugin === 'relational' ? 'backbone-relational' : testCase.plugin === 'associations' ? 'backbone-associations' : 'backbone-orm';
        check((await packageVersion(packageName)) === testCase.pluginVersion, `Unexpected ${packageName} package version`);
        exercise(frame, testCase);
      } finally {
        iframe.remove();
      }
    });
  }
});

describeBrowser('advertised core peer browser matrix', function () {
  this.timeout(20_000);

  for (const testCase of CORE_PEER_COMBINATIONS) {
    it(testCase.name, async () => {
      const iframe = document.createElement('iframe');
      const frameReady = new Promise<void>((resolve) => {
        iframe.onload = () => resolve();
      });
      iframe.srcdoc = '<!doctype html><html><head></head><body></body></html>';
      document.body.append(iframe);
      try {
        await frameReady;
        const frame = iframe.contentWindow as BrowserGlobals | null;
        check(frame, 'Could not create an isolated core peer browser cell');
        Reflect.deleteProperty(frame, 'define');
        Reflect.deleteProperty(frame, 'exports');
        Reflect.deleteProperty(frame, 'module');
        const prefix = `/__core-peer/${testCase.name}`;
        await loadScript(frame, `${prefix}/underscore.js`);
        await loadScript(frame, `${prefix}/backbone.js`);
        const backboneIdentity = frame.Backbone;
        await loadScript(frame, `${prefix}/knockout.js`);
        await loadScript(frame, `${prefix}/modelref.js`);
        check(frame.Backbone === backboneIdentity, 'ModelRef replaced the shared Backbone identity');
        await loadScript(frame, `${prefix}/relational.js`);
        check(frame.Backbone === backboneIdentity, 'Backbone.Relational replaced the shared Backbone identity');
        await loadScript(frame, `${prefix}/associations.js`);
        check(frame.Backbone === backboneIdentity, 'Backbone.Associations replaced the shared Backbone identity');
        await loadScript(frame, `${prefix}/orm.js`);
        await loadScript(frame, '/__browser-modules/orm.js', true);
        check(frame.Backbone === backboneIdentity, 'BackboneORM replaced the shared Backbone identity');
        await loadScript(frame, `${prefix}/knockback.js`);
        check(frame.Backbone === backboneIdentity, 'Knockback replaced the shared Backbone identity');

        const versions = await installedVersions(testCase);
        check(versions.backbone === testCase.backboneVersion, 'The browser cell did not install the requested Backbone');
        check(versions.knockout === testCase.knockoutVersion, 'The browser cell did not install the requested Knockout');
        check(versions.underscore === CORE_PEER_VERSIONS.underscore, 'The browser cell did not install the reviewed Underscore');
        check(versions.modelRef === CORE_PEER_VERSIONS.modelRef, 'The browser cell did not install the accepted ModelRef');
        check(versions.relational === RELATIONSHIP_VERSIONS.relational, 'The browser cell did not install the reviewed Relational release');
        check(versions.associations === RELATIONSHIP_VERSIONS.associations, 'The browser cell did not install the reviewed Associations release');
        check(versions.orm === RELATIONSHIP_VERSIONS.orm, 'The browser cell did not install the reviewed ORM release');
        exerciseCorePeer(frame, testCase);
      } finally {
        iframe.remove();
      }
    });
  }
});
