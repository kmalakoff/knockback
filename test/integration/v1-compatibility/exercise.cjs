'use strict';

const assert = require('assert');
const path = require('path');
const { createRequire } = require('module');

const entry = process.env.KB_COMPAT_ENTRY;
const specifier = process.env.KB_COMPAT_SPECIFIER;
const group = process.env.KB_COMPAT_GROUP;
const packageRoot = process.env.KB_COMPAT_PACKAGE_ROOT;
if ((!entry && !specifier) || !group || !packageRoot) throw new Error('KB_COMPAT_ENTRY or KB_COMPAT_SPECIFIER, KB_COMPAT_GROUP, and KB_COMPAT_PACKAGE_ROOT are required');

const packageRequire = createRequire(path.join(packageRoot, 'package.json'));
const kb = packageRequire(specifier || entry);
const Backbone = packageRequire('backbone');
const ko = packageRequire('knockout');
const _ = packageRequire('underscore');

function listenerCount(target) {
  if (!target || !target._events) return 0;
  return Object.values(target._events).reduce((count, listeners) => count + (Array.isArray(listeners) ? listeners.length : 1), 0);
}

function itemId(item) {
  const value = item?.id;
  return typeof value === 'function' ? value() : value;
}

function release(value) {
  if (typeof kb.release === 'function') kb.release(value);
  else if (typeof kb.dispose === 'function') kb.dispose(value);
  else value?.dispose?.();
}

function disposeDirect(value) {
  if (typeof value?.destroy === 'function') value.destroy();
  else value?.dispose?.();
}

function check(name, callback) {
  try {
    return { name, observed: callback(), ok: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.stack || `${error.name}: ${error.message}` : String(error),
      name,
      ok: false,
    };
  }
}

const groups = {
  'namespace-dependencies'() {
    return [
      check('legacy dependency properties preserve the loaded package identities', () => {
        assert.strictEqual(kb.Backbone, Backbone);
        assert.strictEqual(kb.Model, Backbone.Model);
        assert.strictEqual(kb.Collection, Backbone.Collection);
        assert.strictEqual(kb.Events, Backbone.Events);
        assert.strictEqual(kb.ko, ko);
        assert.strictEqual(kb._, _);
        assert.strictEqual(kb.modules.backbone, Backbone);
        assert.strictEqual(kb.modules.knockout, ko);
        assert.strictEqual(kb.modules.underscore, _);

        const model = new kb.Model({ name: 'Ada' });
        const collection = new kb.Collection([model]);
        const emitter = Object.assign({}, kb.Events);
        let events = 0;
        emitter.on('ready', () => events++);
        emitter.trigger('ready');
        const view = kb.viewModel(model);
        assert.strictEqual(view.name(), 'Ada');
        assert.strictEqual(collection.at(0), model);
        assert.strictEqual(events, 1);
        assert.strictEqual(kb.ko.unwrap(view.name), 'Ada');
        assert.deepStrictEqual(kb._.pluck([{ id: 1 }, { id: 2 }], 'id'), [1, 2]);
        release(view);
        return { events, model: 'Ada', collectionIdentity: true, moduleIdentities: true };
      }),
    ];
  },

  'factory-aliases'() {
    return [
      check('legacy observable factory aliases preserve values, writes, events, and cleanup', () => {
        assert.strictEqual(kb.observableCollection, kb.collectionObservable);
        assert.strictEqual(kb.observableDefault, kb.defaultObservable);
        assert.strictEqual(kb.observableFormatted, kb.formattedObservable);
        assert.strictEqual(kb.observableLocalized, kb.localizedObservable);
        assert.strictEqual(kb.observableTriggered, kb.triggeredObservable);

        const collection = new Backbone.Collection([new Backbone.Model({ id: 1 })]);
        const collectionValue = kb.observableCollection(collection, { models_only: true });
        const target = ko.observable(null);
        const defaultValue = kb.observableDefault(target, 'fallback');
        const first = ko.observable('Ada');
        const last = ko.observable('Lovelace');
        const formatted = kb.observableFormatted('{0} {1}', first, last);
        const emitter = new Backbone.Model();
        const triggered = kb.observableTriggered(emitter, 'ready');
        const watcher = kb.emitterObservable(emitter, {});
        let notifications = 0;
        triggered.subscribe(() => notifications++);
        emitter.trigger('ready');

        assert.strictEqual(collectionValue()[0], collection.at(0));
        assert.strictEqual(defaultValue(), 'fallback');
        defaultValue('value');
        assert.strictEqual(target(), 'value');
        assert.strictEqual(formatted(), 'Ada Lovelace');
        formatted('Grace Hopper');
        assert.deepStrictEqual([first(), last()], ['Grace', 'Hopper']);
        assert.strictEqual(notifications, 1);
        assert.strictEqual(watcher.emitter(), emitter);

        disposeDirect(collectionValue);
        disposeDirect(defaultValue);
        disposeDirect(formatted);
        disposeDirect(triggered);
        disposeDirect(watcher);
        assert.strictEqual(listenerCount(collection), 0);
        assert.strictEqual(listenerCount(emitter), 0);
        return { defaultTarget: 'value', formatted: 'Grace Hopper', notifications, releasedListeners: true };
      }),
    ];
  },

  'factory-core-helpers'() {
    return [
      check('Factory resolves parent, direct, bulk, and legacy wrapped creators', () => {
        assert.strictEqual(typeof kb.Factory, 'function');
        function ParentView() {}
        function DirectView() {}
        function LegacyView() {}
        const parent = new kb.Factory();
        parent.addPathMapping('parent', ParentView);
        const factory = new kb.Factory(parent);
        factory.addPathMapping('direct', DirectView);
        factory.addPathMapping('legacy', { view_model: LegacyView });
        factory.addPathMappings({ child: DirectView }, 'nested');
        assert.strictEqual(factory.hasPath('parent'), true);
        assert.strictEqual(factory.hasPath('missing'), undefined);
        assert.strictEqual(factory.creatorForPath(null, 'parent'), ParentView);
        assert.strictEqual(factory.creatorForPath(null, 'direct'), DirectView);
        assert.strictEqual(factory.creatorForPath(null, 'legacy'), LegacyView);
        assert.strictEqual(factory.creatorForPath(null, 'nested.child'), DirectView);
        assert.strictEqual(factory.creatorForPath(null, 'missing'), null);
        return { bulk: true, direct: true, legacyWrapper: true, missing: null, missingPath: 'undefined', parent: true };
      }),
      check('compare preserves published scalar ordering', () => {
        assert.strictEqual(kb.compare(1, 1), 0);
        assert.strictEqual(kb.compare(1, 2), -1);
        assert.strictEqual(kb.compare(2, 1), 1);
        assert.ok(kb.compare('Ada', 'Grace') < 0);
        assert.ok(kb.compare('Grace', 'Ada') > 0);
        return { equal: 0, greater: 1, less: -1, stringsOrdered: true };
      }),
      check('ignore and peek preserve values without capturing dependencies', () => {
        const source = ko.observable(1);
        const target = { base: 7 };
        const ignored = kb.ignore(
          function (left, right) {
            return this.base + left + right.length + source();
          },
          target,
          [2, 'abc']
        );
        let ignoreEvaluations = 0;
        const ignoredOuter = ko.computed(() => {
          ignoreEvaluations++;
          return kb.ignore(() => source());
        });
        let peekEvaluations = 0;
        const peekOuter = ko.computed(() => {
          peekEvaluations++;
          return kb.peek(source);
        });
        assert.strictEqual(ignored, 13);
        assert.strictEqual(ignoredOuter(), 1);
        assert.strictEqual(peekOuter(), 1);
        source(2);
        assert.strictEqual(ignoreEvaluations, 1);
        assert.strictEqual(peekEvaluations, 1);
        assert.strictEqual(ignoredOuter(), 1);
        assert.strictEqual(peekOuter(), 1);
        assert.strictEqual(kb.peek('plain'), 'plain');
        ignoredOuter.dispose();
        peekOuter.dispose();
        return { ignored, ignoreEvaluations, peekEvaluations, plain: 'plain' };
      }),
    ];
  },

  'legacy-nested-options'() {
    return [
      check('nested options merge legacy names into view and collection behavior', () => {
        const model = new Backbone.Model({ id: 1, rank: 2 });
        const view = kb.viewModel(model, {
          statics: ['missing'],
          options: { static_defaults: { missing: 'fallback' } },
        });
        assert.strictEqual(view.missing, 'fallback');

        const first = model;
        const second = new Backbone.Model({ id: 2, rank: 1 });
        const collectionValue = kb.collectionObservable(new Backbone.Collection([first, second]), {
          options: { models_only: true, sort_attribute: 'rank' },
        });
        assert.deepStrictEqual(collectionValue().map(itemId), [2, 1]);
        assert.strictEqual(collectionValue()[0], second);
        disposeDirect(view);
        disposeDirect(collectionValue);
        return { missing: 'fallback', ids: [2, 1], rawModels: true };
      }),
    ];
  },

  'nested-alias-conflicts'() {
    const published = kb.VERSION === '1.2.3';
    const modeCases = [
      {
        name: 'nested legacy models_only overrides outer camel modelsOnly',
        options: Object.freeze({ modelsOnly: false, options: Object.freeze({ models_only: true }) }),
        rawModels: true,
      },
      {
        name: 'nested camel modelsOnly overrides outer legacy only in candidate',
        options: Object.freeze({ models_only: true, options: Object.freeze({ modelsOnly: false }) }),
        rawModels: published,
      },
    ];
    const sortCases = [
      {
        name: 'nested legacy sort_attribute overrides outer camel sortAttribute',
        options: Object.freeze({ models_only: true, sortAttribute: 'rank', options: Object.freeze({ sort_attribute: 'legacyRank' }) }),
        selected: 'legacyRank',
      },
      {
        name: 'nested camel sortAttribute overrides outer legacy only in candidate',
        options: Object.freeze({ models_only: true, sort_attribute: 'legacyRank', options: Object.freeze({ sortAttribute: 'rank' }) }),
        selected: published ? 'legacyRank' : 'rank',
      },
    ];
    return [
      ...modeCases.map((scenario) => check(scenario.name, () => {
        const first = new Backbone.Model({ id: 1, name: 'Ada' });
        const second = new Backbone.Model({ id: 2, name: 'Grace' });
        const collection = new Backbone.Collection([first]);
        const input = JSON.stringify(scenario.options);
        const observable = kb.collectionObservable(collection, scenario.options);
        const notifications = [];
        const subscription = observable.subscribe((items) => notifications.push(items.map(itemId)));
        let observation;
        try {
          const item = observable()[0];
          assert.strictEqual(item === first, scenario.rawModels, 'selected collection item mode');
          assert.strictEqual(observable.hasViewModels(), !scenario.rawModels);
          if (!scenario.rawModels) {
            assert.ok(item.model() === first, 'nested option creates the view for the exact model');
            assert.strictEqual(item.name(), 'Ada');
            first.set('name', 'Lovelace');
            assert.strictEqual(item.name(), 'Lovelace');
          }
          collection.add(second);
          assert.deepStrictEqual(observable().map(itemId), [1, 2]);
          assert.strictEqual(observable()[1] === second, scenario.rawModels);
          collection.remove(first);
          assert.deepStrictEqual(observable().map(itemId), [2]);
          assert.deepStrictEqual(notifications, [[1, 2], [2]]);
          assert.strictEqual(JSON.stringify(scenario.options), input);
          observation = { ids: [2], notifications, rawModels: item === first, unchangedInput: true };
        } finally {
          subscription.dispose();
          disposeDirect(observable);
          collection.reset([]);
        }
        assert.strictEqual(listenerCount(collection), 0);
        assert.strictEqual(listenerCount(first), 0);
        assert.strictEqual(listenerCount(second), 0);
        return { ...observation, releasedListeners: true };
      })),
      ...sortCases.map((scenario) => check(scenario.name, () => {
        const first = new Backbone.Model({ id: 1, rank: 2, legacyRank: 0 });
        const second = new Backbone.Model({ id: 2, rank: 1, legacyRank: 1 });
        const collection = new Backbone.Collection([first, second]);
        const input = JSON.stringify(scenario.options);
        const observable = kb.collectionObservable(collection, scenario.options);
        const notifications = [];
        const subscription = observable.subscribe((items) => notifications.push(items.map(itemId)));
        let observation;
        try {
          const initial = observable().map(itemId);
          assert.deepStrictEqual(initial, scenario.selected === 'rank' ? [2, 1] : [1, 2]);
          assert.ok(observable().every((item) => item === first || item === second), 'sort retains exact raw model owners');
          first.set('rank', 0);
          const afterCamelFieldChange = observable().map(itemId);
          assert.deepStrictEqual(afterCamelFieldChange, [1, 2]);
          second.set('legacyRank', -1);
          const afterLegacyFieldChange = observable().map(itemId);
          assert.deepStrictEqual(afterLegacyFieldChange, scenario.selected === 'rank' ? [1, 2] : [2, 1]);
          assert.deepStrictEqual(notifications, scenario.selected === 'rank' ? [[1, 2], [1, 2]] : [[1, 2], [2, 1]]);
          assert.strictEqual(JSON.stringify(scenario.options), input);
          observation = { initial, afterCamelFieldChange, afterLegacyFieldChange, notifications, unchangedInput: true };
        } finally {
          subscription.dispose();
          disposeDirect(observable);
          collection.reset([]);
        }
        assert.strictEqual(listenerCount(collection), 0);
        assert.strictEqual(listenerCount(first), 0);
        assert.strictEqual(listenerCount(second), 0);
        return { ...observation, releasedListeners: true };
      })),
    ];
  },

  'localized-constructor'() {
    return [
      check('LocalizedObservable.extend reacts, writes, and releases through locale_manager', () => {
        assert.strictEqual(typeof kb.LocalizedObservable, 'function');
        assert.strictEqual(typeof kb.LocalizedObservable.extend, 'function');
        const original = kb.locale_manager;
        const localeManager = Object.assign({ locale: 'en' }, Backbone.Events);
        kb.locale_manager = localeManager;
        const Localizer = kb.LocalizedObservable.extend({
          constructor: function (value, options, viewModel) {
            return kb.LocalizedObservable.prototype.constructor.call(this, value, options, viewModel);
          },
          read(value) {
            return `${localeManager.locale}:${value.name}`;
          },
          write(localized, value) {
            value.name = String(localized).split(':')[1];
          },
        });
        const source = ko.observable({ name: 'Ada' });
        const localized = new Localizer(source);
        let notifications = 0;
        localized.subscribe(() => notifications++);
        assert.strictEqual(localized(), 'en:Ada');
        localeManager.locale = 'fr';
        localeManager.trigger('change');
        assert.strictEqual(localized(), 'fr:Ada');
        localized('fr:Grace');
        assert.strictEqual(source().name, 'Grace');
        disposeDirect(localized);
        const before = notifications;
        localeManager.locale = 'es';
        localeManager.trigger('change');
        assert.strictEqual(notifications, before);
        kb.locale_manager = original;
        return { notifications: before, releasedListeners: true, source: 'Grace', value: 'fr:Grace' };
      }),
    ];
  },

  'validation-constructor'() {
    return [
      check('Validation preserves its published empty-instance constructor contract', () => {
        assert.strictEqual(typeof kb.Validation, 'function');
        const first = new kb.Validation();
        const second = new kb.Validation();
        assert.ok(first instanceof kb.Validation);
        assert.ok(second instanceof kb.Validation);
        assert.notStrictEqual(first, second);
        assert.deepStrictEqual(Object.keys(first), []);
        return { independent: true, keys: [] };
      }),
    ];
  },

  constructors() {
    return [
      check('ViewModel constructor tracks model changes', () => {
        assert.strictEqual(typeof kb.ViewModel, 'function');
        const model = new Backbone.Model({ name: 'Ada' });
        const view = new kb.ViewModel(model);
        assert.strictEqual(view.name(), 'Ada');
        model.set('name', 'Grace');
        assert.strictEqual(view.name(), 'Grace');
        disposeDirect(view);
        return { name: 'Grace', releasedListeners: listenerCount(model) };
      }),
      check('Observable constructor reads, writes, notifies, and releases', () => {
        assert.strictEqual(typeof kb.Observable, 'function');
        const model = new Backbone.Model({ name: 'Ada' });
        const listenersBefore = listenerCount(model);
        const observable = new kb.Observable(model, 'name');
        let notifications = 0;
        observable.subscribe(() => notifications++);
        assert.strictEqual(observable(), 'Ada');
        model.set('name', 'Grace');
        assert.strictEqual(observable(), 'Grace');
        observable('Hopper');
        assert.strictEqual(model.get('name'), 'Hopper');
        assert.ok(notifications >= 2);
        disposeDirect(observable);
        assert.strictEqual(listenerCount(model), listenersBefore);
        return { modelValue: 'Hopper', notifications, releasedListeners: true };
      }),
      check('CollectionObservable constructor returns reactive raw models', () => {
        assert.strictEqual(typeof kb.CollectionObservable, 'function');
        const first = new Backbone.Model({ id: 1 });
        const second = new Backbone.Model({ id: 2 });
        const collection = new Backbone.Collection([first]);
        const observable = new kb.CollectionObservable(collection, { models_only: true });
        assert.ok(observable().length === 1 && observable()[0] === first, 'constructor did not preserve the first model identity');
        collection.add(second);
        assert.ok(observable().length === 2 && observable()[0] === first && observable()[1] === second, 'constructor did not preserve added model identities');
        collection.remove(first);
        assert.ok(observable().length === 1 && observable()[0] === second, 'constructor did not preserve the remaining model identity');
        disposeDirect(observable);
        assert.strictEqual(listenerCount(collection), 0);
        return { ids: [2], releasedListeners: true };
      }),
      check('DefaultObservable constructor preserves two-way default behavior', () => {
        assert.strictEqual(typeof kb.DefaultObservable, 'function');
        const target = ko.observable(null);
        const observable = new kb.DefaultObservable(target, 'fallback');
        assert.strictEqual(observable(), 'fallback');
        observable('Ada');
        assert.strictEqual(target(), 'Ada');
        observable.setToDefault();
        assert.strictEqual(target(), 'fallback');
        disposeDirect(observable);
        return { defaultValue: 'fallback', targetValue: 'fallback' };
      }),
      check('FormattedObservable constructor reads and writes all arguments', () => {
        assert.strictEqual(typeof kb.FormattedObservable, 'function');
        const first = ko.observable('Ada');
        const last = ko.observable('Lovelace');
        const observable = new kb.FormattedObservable('{0} {1}', first, last);
        assert.strictEqual(observable(), 'Ada Lovelace');
        observable('Grace Hopper');
        assert.deepStrictEqual([first(), last(), observable()], ['Grace', 'Hopper', 'Grace Hopper']);
        disposeDirect(observable);
        return { formatted: 'Grace Hopper', parts: ['Grace', 'Hopper'] };
      }),
      check('TriggeredObservable constructor notifies and unbinds', () => {
        assert.strictEqual(typeof kb.TriggeredObservable, 'function');
        const emitter = new Backbone.Model();
        const listenersBefore = listenerCount(emitter);
        const observable = new kb.TriggeredObservable(emitter, 'refresh');
        let notifications = 0;
        observable.subscribe(() => notifications++);
        observable();
        emitter.trigger('refresh');
        assert.strictEqual(notifications, 1);
        disposeDirect(observable);
        assert.strictEqual(listenerCount(emitter), listenersBefore);
        emitter.trigger('refresh');
        assert.strictEqual(notifications, 1);
        return { notifications, releasedListeners: true };
      }),
    ];
  },

  'disposal-ownership'() {
    return [
      check('top-level cleanup stops events and restores model listeners', () => {
        const model = new Backbone.Model({ name: 'Ada' });
        const listenersBefore = listenerCount(model);
        const view = kb.viewModel(model);
        let notifications = 0;
        view.name.subscribe(() => notifications++);
        model.set('name', 'Grace');
        assert.strictEqual(notifications, 1);
        release(view);
        assert.strictEqual(listenerCount(model), listenersBefore);
        model.set('name', 'Hopper');
        assert.strictEqual(notifications, 1);
        release(view);
        assert.strictEqual(listenerCount(model), listenersBefore);
        return { notifications, releasedListeners: true };
      }),
    ];
  },

  'disposal-aliases'() {
    return [
      check('release performs idempotent listener cleanup', () => {
        assert.strictEqual(typeof kb.release, 'function');
        const model = new Backbone.Model({ name: 'Ada' });
        const view = kb.viewModel(model);
        kb.release(view);
        assert.strictEqual(listenerCount(model), 0);
        kb.release(view);
        assert.strictEqual(listenerCount(model), 0);
        return { releasedListeners: true, repeatSafe: true };
      }),
      check('wasReleased reports state after cleanup', () => {
        assert.strictEqual(typeof kb.wasReleased, 'function');
        const view = kb.viewModel(new Backbone.Model({ name: 'Ada' }));
        assert.strictEqual(kb.wasReleased(view), undefined);
        release(view);
        assert.strictEqual(kb.wasReleased(view), true);
        return { after: true, before: undefined };
      }),
      check('instance destroy performs listener cleanup', () => {
        const model = new Backbone.Model({ name: 'Ada' });
        const view = kb.viewModel(model);
        assert.strictEqual(typeof view.destroy, 'function');
        view.destroy();
        assert.strictEqual(listenerCount(model), 0);
        return { releasedListeners: true };
      }),
      check('releaseKeys clears children and cleans each owner once', () => {
        assert.strictEqual(typeof kb.releaseKeys, 'function');
        let releases = 0;
        const first = { release: () => releases++ };
        const second = { destroy: () => releases++ };
        const owner = { first, second };
        kb.releaseKeys(owner);
        assert.deepStrictEqual(owner, { first: null, second: null });
        assert.strictEqual(releases, 2);
        kb.releaseKeys(owner);
        assert.strictEqual(releases, 2);
        return { releases, valuesCleared: true };
      }),
    ];
  },

  'snake-models-only'() {
    return [
      check('models_only returns model identities through add and remove', () => {
        const first = new Backbone.Model({ id: 1 });
        const second = new Backbone.Model({ id: 2 });
        const collection = new Backbone.Collection([first]);
        const observable = kb.collectionObservable(collection, { models_only: true });
        assert.ok(observable().length === 1 && observable()[0] === first, 'models_only did not preserve the first model identity');
        collection.add(second);
        assert.ok(observable().length === 2 && observable()[0] === first && observable()[1] === second, 'models_only did not preserve added model identities');
        collection.remove(first);
        assert.ok(observable().length === 1 && observable()[0] === second, 'models_only did not preserve the remaining model identity');
        disposeDirect(observable);
        assert.strictEqual(listenerCount(collection), 0);
        return { ids: [2], rawModels: true };
      }),
    ];
  },

  'snake-view-model'() {
    return [
      check('view_model constructs the requested item type', () => {
        function LegacyView(model) {
          this.kind = 'legacy';
          this.name = ko.observable(model.get('name'));
          this.dispose = () => this.name.dispose?.();
        }
        const collection = new Backbone.Collection([{ id: 1, name: 'Ada' }]);
        const observable = kb.collectionObservable(collection, { view_model: LegacyView });
        assert.strictEqual(observable()[0].kind, 'legacy');
        assert.strictEqual(observable()[0].name(), 'Ada');
        disposeDirect(observable);
        return { itemKind: 'legacy', itemName: 'Ada' };
      }),
    ];
  },

  'snake-sort-attribute'() {
    return [
      check('sort_attribute orders and resorts after a matching change', () => {
        const first = new Backbone.Model({ id: 1, rank: 2 });
        const second = new Backbone.Model({ id: 2, rank: 1 });
        const third = new Backbone.Model({ id: 3, rank: 0 });
        const collection = new Backbone.Collection([first, second]);
        const observable = kb.collectionObservable(collection, { models_only: true, sort_attribute: 'rank' });
        assert.deepStrictEqual(observable().map(itemId), [2, 1]);
        collection.add(third);
        assert.deepStrictEqual(observable().map(itemId), [3, 2, 1]);
        first.set('rank', -1);
        assert.deepStrictEqual(observable().map(itemId), [1, 3, 2]);
        disposeDirect(observable);
        return { ids: [1, 3, 2], resorted: true };
      }),
    ];
  },

  'snake-static-defaults'() {
    return [
      check('static_defaults fills missing static values', () => {
        const model = new Backbone.Model({ present: 'value' });
        const view = kb.viewModel(model, {
          static_defaults: { missing: 'fallback' },
          statics: ['present', 'missing'],
        });
        assert.strictEqual(view.present, 'value');
        assert.strictEqual(view.missing, 'fallback');
        disposeDirect(view);
        return { missing: 'fallback', present: 'value' };
      }),
    ];
  },

  'snake-auto-compact'() {
    return [
      check('auto_compact recreates view models after collection reset', () => {
        let creations = 0;
        let releases = 0;
        function LegacyView(model) {
          creations++;
          this.model = model;
          this.destroy = () => releases++;
        }
        const model = new Backbone.Model({ id: 1 });
        const collection = new Backbone.Collection([model]);
        const observable = kb.collectionObservable(collection, { auto_compact: true, view_model: LegacyView });
        const before = observable()[0];
        collection.reset([model]);
        const after = observable()[0];
        assert.notStrictEqual(after, before);
        assert.strictEqual(creations, 2);
        assert.strictEqual(releases, 1);
        disposeDirect(observable);
        return { creations, recreated: true, releasedOnReset: 1 };
      }),
    ];
  },

  'snake-event-watcher'() {
    return [
      check('event_watcher routes model events through the supplied watcher', () => {
        assert.strictEqual(typeof kb.EventWatcher, 'function');
        const model = new Backbone.Model({ name: 'Ada' });
        const watcher = new kb.EventWatcher(model);
        const observable = new kb.Observable(model, 'name', { event_watcher: watcher });
        let notifications = 0;
        observable.subscribe(() => notifications++);
        model.set('name', 'Grace');
        assert.strictEqual(observable(), 'Grace');
        assert.strictEqual(notifications, 1);
        disposeDirect(observable);
        disposeDirect(watcher);
        assert.strictEqual(listenerCount(model), 0);
        return { notifications, releasedListeners: true, value: 'Grace' };
      }),
    ];
  },

  validation() {
    return [
      check('valueValidator publishes reactive snake_case result fields', () => {
        const value = ko.observable('');
        const validator = kb.valueValidator(value, {
          required: (current) => !current,
          tooShort: (current) => current.length < 3,
        });
        assert.deepStrictEqual(
          {
            active: validator().$active_error,
            count: validator().$error_count,
            valid: validator().$valid,
          },
          { active: 'required', count: 2, valid: false }
        );
        value('Ada');
        assert.deepStrictEqual({ count: validator().$error_count, valid: validator().$valid }, { count: 0, valid: true });
        validator.dispose();
        return { initialActive: 'required', initialCount: 2, validAfterChange: true };
      }),
      check('inputValidator consumes validation_options and reacts to changes', () => {
        assert.strictEqual(typeof kb.inputValidator, 'function');
        const view = { disabled: ko.observable(true), name: ko.observable('') };
        const attributes = {
          'data-bind': 'value: name, validation_options: { disable: disabled }',
          name: 'name',
          required: '',
          type: 'text',
        };
        const element = {
          getAttribute: (name) => (Object.hasOwn(attributes, name) ? attributes[name] : null),
          hasAttribute: (name) => Object.hasOwn(attributes, name),
        };
        const validator = kb.inputValidator(view, element);
        assert.ok(validator);
        assert.strictEqual(view.$name, validator);
        assert.deepStrictEqual({ count: validator().$error_count, enabled: validator().$enabled, valid: validator().$valid }, { count: 0, enabled: false, valid: true });
        view.disabled(false);
        assert.strictEqual(validator().$active_error, 'required');
        assert.strictEqual(validator().$error_count, 1);
        view.name('Ada');
        assert.strictEqual(validator().$valid, true);
        validator.dispose();
        return { attached: true, disabledWasValid: true, enabledActive: 'required', validAfterChange: true };
      }),
      check('hasChangedFn detects changes after its first snapshot', () => {
        assert.strictEqual(typeof kb.hasChangedFn, 'function');
        const model = new Backbone.Model({ name: 'Ada' });
        const hasChanged = kb.hasChangedFn(model);
        assert.strictEqual(hasChanged(), false);
        model.set('name', 'Hopper');
        assert.strictEqual(hasChanged(), true);
        return { changed: true, initial: false };
      }),
      check('minLengthFn accepts complete values and rejects short values', () => {
        assert.strictEqual(typeof kb.minLengthFn, 'function');
        assert.strictEqual(kb.minLengthFn(4)('Ada'), true);
        assert.strictEqual(kb.minLengthFn(4)('Grace'), false);
        return { completeRejected: false, shortRejected: true };
      }),
      check('uniqueValueFn detects another model with the same value', () => {
        assert.strictEqual(typeof kb.uniqueValueFn, 'function');
        const model = new Backbone.Model({ name: 'Hopper' });
        const collection = new Backbone.Collection([model, new Backbone.Model({ name: 'Grace' })]);
        assert.strictEqual(kb.uniqueValueFn(model, 'name', collection)('Grace'), true);
        assert.strictEqual(kb.uniqueValueFn(model, 'name', collection)('Hopper'), false);
        return { duplicateRejected: true, ownValueRejected: false };
      }),
      check('untilTrueFn latches truth and resets when its model changes', () => {
        assert.strictEqual(typeof kb.untilTrueFn, 'function');
        const reset = ko.observable('first');
        const untilTrue = kb.untilTrueFn('pending', (value) => (value > 0 ? `ready:${value}` : ''), reset);
        assert.strictEqual(untilTrue(0), 'pending');
        assert.strictEqual(untilTrue(2), 'ready:2');
        assert.strictEqual(untilTrue(0), '');
        reset('second');
        assert.strictEqual(untilTrue(0), 'pending');
        return { afterReset: 'pending', latchedFalseValue: '', ready: 'ready:2' };
      }),
      check('untilFalseFn latches falsity and resets when its model changes', () => {
        assert.strictEqual(typeof kb.untilFalseFn, 'function');
        const reset = ko.observable('first');
        const untilFalse = kb.untilFalseFn('pending', (value) => (value > 0 ? `positive:${value}` : ''), reset);
        assert.strictEqual(untilFalse(2), 'pending');
        assert.strictEqual(untilFalse(0), '');
        assert.strictEqual(untilFalse(2), 'positive:2');
        reset('second');
        assert.strictEqual(untilFalse(2), 'pending');
        return { afterReset: 'pending', latchedTrueValue: 'positive:2', ready: '' };
      }),
    ];
  },

  'candidate-alias-conflicts'() {
    return [
      check('camel viewModel and sortAttribute win when both aliases are supplied', () => {
        function CurrentView(model) {
          this.kind = 'current';
          this.id = ko.observable(model.id);
        }
        function LegacyView() {
          this.kind = 'legacy';
        }
        const first = new Backbone.Model({ id: 1, legacyRank: 0, rank: 2 });
        const second = new Backbone.Model({ id: 2, legacyRank: 1, rank: 1 });
        const collection = new Backbone.Collection([first, second]);
        const observable = kb.collectionObservable(collection, {
          sortAttribute: 'rank',
          sort_attribute: 'legacyRank',
          viewModel: CurrentView,
          view_model: LegacyView,
        });
        assert.deepStrictEqual(
          observable().map((view) => [view.kind, view.id()]),
          [
            ['current', 2],
            ['current', 1],
          ]
        );
        disposeDirect(observable);
        return { ids: [2, 1], kind: 'current' };
      }),
      check('camel modelsOnly false wins over models_only true', () => {
        const model = new Backbone.Model({ id: 1 });
        const observable = kb.collectionObservable(new Backbone.Collection([model]), {
          modelsOnly: false,
          models_only: true,
        });
        assert.notStrictEqual(observable()[0], model);
        assert.strictEqual(observable()[0].id(), 1);
        disposeDirect(observable);
        return { modelsOnly: false, viewModelCreated: true };
      }),
      check('camel staticDefaults wins over static_defaults', () => {
        const view = kb.viewModel(new Backbone.Model(), {
          staticDefaults: { missing: 'current' },
          static_defaults: { missing: 'legacy' },
          statics: ['missing'],
        });
        assert.strictEqual(view.missing, 'current');
        disposeDirect(view);
        return { missing: 'current' };
      }),
      check('camel autoCompact false wins over auto_compact true', () => {
        const model = new Backbone.Model({ id: 1 });
        const collection = new Backbone.Collection([model]);
        const observable = kb.collectionObservable(collection, { autoCompact: false, auto_compact: true });
        const before = observable()[0];
        collection.reset([model]);
        assert.strictEqual(observable()[0], before);
        disposeDirect(observable);
        return { reused: true };
      }),
      check('camel eventWatcher wins and borrowed watchers remain owned by the caller', () => {
        const model = new Backbone.Model({ name: 'Ada' });
        const otherModel = new Backbone.Model({ name: 'Other' });
        const current = new kb.EventWatcher(model);
        const legacy = new kb.EventWatcher(otherModel);
        const observable = kb.observable(model, 'name', { eventWatcher: current, event_watcher: legacy });
        model.set('name', 'Grace');
        assert.strictEqual(observable(), 'Grace');
        disposeDirect(observable);
        assert.strictEqual(kb.wasReleased(current), undefined);
        assert.strictEqual(legacy.emitter(), otherModel);
        disposeDirect(current);
        disposeDirect(legacy);
        assert.strictEqual(kb.wasReleased(current), true);
        assert.strictEqual(listenerCount(model), 0);
        assert.strictEqual(listenerCount(otherModel), 0);
        return { borrowedOwnerSurvived: true, camelSelected: true, releasedListeners: true };
      }),
    ];
  },

  'candidate-validation-corrections'() {
    return [
      check('no_attach prevents attachment while preserving validator behavior', () => {
        const view = { name: ko.observable('') };
        const attributes = { 'data-bind': 'value: name', name: 'name', required: '', type: 'text' };
        const element = {
          getAttribute: (name) => (Object.hasOwn(attributes, name) ? attributes[name] : null),
          hasAttribute: (name) => Object.hasOwn(attributes, name),
        };
        const validator = kb.inputValidator(view, element, { no_attach: true });
        assert.ok(validator);
        assert.strictEqual(view.$name, undefined);
        assert.strictEqual(validator().$active_error, 'required');
        view.name('Ada');
        assert.strictEqual(validator().$valid, true);
        validator.dispose();
        return { attached: false, validAfterChange: true };
      }),
      check('camel noAttach wins over no_attach when both are supplied', () => {
        const view = { name: ko.observable('') };
        const attributes = { 'data-bind': 'value: name', name: 'name', required: '', type: 'text' };
        const element = {
          getAttribute: (name) => (Object.hasOwn(attributes, name) ? attributes[name] : null),
          hasAttribute: (name) => Object.hasOwn(attributes, name),
        };
        const validator = kb.inputValidator(view, element, { noAttach: false, no_attach: true });
        assert.ok(validator);
        assert.strictEqual(view.$name, validator);
        validator.dispose();
        return { attached: true };
      }),
      check('validation priorities select the requested active error', () => {
        const value = ko.observable('');
        const validator = kb.valueValidator(
          value,
          {
            tooShort: (current) => current.length < 3,
            required: (current) => !current,
          },
          { priorities: ['required', 'tooShort'] }
        );
        assert.strictEqual(validator().$activeError, 'required');
        assert.strictEqual(validator().$active_error, 'required');
        validator.dispose();
        return { active: 'required' };
      }),
    ];
  },

  'view-model-extend'() {
    return [
      check('ViewModel.extend preserves prototype, static, and reactive behavior', () => {
        assert.strictEqual(typeof kb.ViewModel.extend, 'function');
        const Extended = kb.ViewModel.extend(
          {
            label() {
              return `Name: ${this.name()}`;
            },
          },
          { category: 'contact' }
        );
        const model = new Backbone.Model({ name: 'Ada' });
        const view = new Extended(model);
        assert.ok(view instanceof Extended);
        assert.ok(view instanceof kb.ViewModel);
        assert.strictEqual(Extended.category, 'contact');
        assert.strictEqual(view.label(), 'Name: Ada');
        model.set('name', 'Grace');
        assert.strictEqual(view.label(), 'Name: Grace');
        disposeDirect(view);
        assert.strictEqual(listenerCount(model), 0);
        return { category: 'contact', label: 'Name: Grace', releasedListeners: true };
      }),
      check('ViewModel.extend custom constructor can call the published super', () => {
        assert.strictEqual(typeof kb.ViewModel.extend, 'function');
        let constructorCalls = 0;
        const Extended = kb.ViewModel.extend({
          constructor: function (model) {
            constructorCalls++;
            kb.ViewModel.prototype.constructor.call(this, model, { internals: ['secret'] });
            this.reveal = () => this._secret();
            return this;
          },
        });
        const model = new Backbone.Model({ secret: 'one' });
        const view = new Extended(model);
        assert.strictEqual(constructorCalls, 1);
        assert.strictEqual(view.reveal(), 'one');
        model.set('secret', 'two');
        assert.strictEqual(view.reveal(), 'two');
        disposeDirect(view);
        assert.strictEqual(listenerCount(model), 0);
        return { constructorCalls, secret: 'two' };
      }),
      check('ViewModel.extend preserves parent and child instance and static behavior', () => {
        const Parent = kb.ViewModel.extend(
          {
            parentLabel() {
              return `Parent: ${this.name()}`;
            },
          },
          { category: 'parent', inheritedStatic: 'shared' }
        );
        const Child = Parent.extend(
          {
            childLabel() {
              return `Child: ${this.name()}`;
            },
          },
          { category: 'child' }
        );
        const parentModel = new Backbone.Model({ name: 'Ada' });
        const childModel = new Backbone.Model({ name: 'Grace' });
        const parent = new Parent(parentModel);
        const child = new Child(childModel);
        assert.ok(parent instanceof Parent);
        assert.ok(!(parent instanceof Child));
        assert.ok(child instanceof Child);
        assert.ok(child instanceof Parent);
        assert.ok(child instanceof kb.ViewModel);
        assert.strictEqual(Parent.category, 'parent');
        assert.strictEqual(Child.category, 'child');
        assert.strictEqual(Child.inheritedStatic, 'shared');
        assert.strictEqual(parent.parentLabel(), 'Parent: Ada');
        assert.strictEqual(child.parentLabel(), 'Parent: Grace');
        assert.strictEqual(child.childLabel(), 'Child: Grace');
        childModel.set('name', 'Hopper');
        assert.strictEqual(child.parentLabel(), 'Parent: Hopper');
        assert.strictEqual(child.childLabel(), 'Child: Hopper');
        disposeDirect(parent);
        disposeDirect(child);
        assert.strictEqual(listenerCount(parentModel), 0);
        assert.strictEqual(listenerCount(childModel), 0);
        return { child: 'Child: Hopper', childCategory: 'child', inheritedStatic: 'shared', parent: 'Parent: Ada', releasedListeners: true };
      }),
    ];
  },
};

if (!Object.hasOwn(groups, group)) throw new Error(`Unknown compatibility group: ${group}`);
const result = {
  dependencies: {
    backbone: Backbone.VERSION,
    knockout: ko.version,
    underscore: _.VERSION,
  },
  group,
  identity: {
    backbone: kb.Backbone === Backbone,
    collection: kb.Collection === Backbone.Collection,
    events: kb.Events === Backbone.Events,
    knockout: kb.ko === ko,
    model: kb.Model === Backbone.Model,
    underscore: kb._ === _,
  },
  results: groups[group](),
  version: kb.VERSION,
};
process.stdout.write(`KB_COMPAT_RESULT ${JSON.stringify(result)}\n`);
