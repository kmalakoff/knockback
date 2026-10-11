# TypeScript migration guide

This guide covers moving a Knockback 1.2.3 application to the current TypeScript codebase. It describes behavior that is already exercised through the package's public entries.

The final registry package name and release version have not been chosen. Examples use `@mcpeasy/knockback` because that is the current workspace package name, not as a publication promise. This guide omits install, version, and publishing commands because those decisions are still open.

## Start with the public TypeScript entry

Prefer named imports for new code. The default `kb` namespace remains available when it makes an incremental migration easier.

```ts
import kb, { observable, viewModel } from '@mcpeasy/knockback';
import Backbone from 'backbone';
import ko from 'knockout';

class Person extends Backbone.Model<{ name?: string }> {}

interface PersonView {
  name: ko.Observable<string | undefined>;
}

const person = new Person({ name: 'Ada' });
const name = observable<string | undefined, Person>(person, 'name');
const personView = viewModel<PersonView, Person>(person, { keys: ['name'] });

person.set('name', 'Grace');
personView.dispose();
name.dispose();
```

Use `dispose()` in new code. The legacy `destroy()` and `release()` instance methods and the root `kb.release()`, `kb.releaseKeys()`, and `kb.wasReleased()` helpers remain available for migrated code.

Legacy constructors also remain available, but they are constructors: use `new kb.ViewModel(model)`, not `kb.ViewModel(model)`. `ViewModel.extend` retains Backbone-style parent/child instance behavior and inherited statics:

```ts
const Parent = kb.ViewModel.extend(
  {
    parentLabel() {
      return this.model()?.get('name') ?? 'missing';
    },
  },
  { category: 'parent' as const, inheritedStatic: 'shared' as const }
);

const Child = Parent.extend(
  {
    childLabel() {
      return this.parentLabel().toUpperCase();
    },
  },
  { category: 'child' as const }
);

const child = new Child(person);
const category: 'child' = Child.category;
const inheritedStatic: 'shared' = Child.inheritedStatic;
const label: string = child.childLabel();
child.dispose();

void [category, inheritedStatic, label];
```

## Migrate option names incrementally

The camelCase forms are preferred, but the retained snake_case forms still have the same behavior. When both forms are present in one options object, the camelCase value wins.

| Scope | Preferred | Retained v1 name |
| --- | --- | --- |
| collection item creator | `viewModel` | `view_model` |
| raw collection items | `modelsOnly` | `models_only` |
| attribute sorting | `sortAttribute` | `sort_attribute` |
| reset compaction | `autoCompact` | `auto_compact` |
| static fallback values | `staticDefaults` | `static_defaults` |
| supplied event watcher | `eventWatcher` | `event_watcher` |
| injection constructor | `viewModel` | `view_model` |
| validation attachment | `noAttach` | `no_attach` |
| validation binding options | `validationOptions` | `validation_options` |

Validation results expose both `$errorCount`/`$error_count` and `$activeError`/`$active_error`. The `kb.localeManager` and `kb.locale_manager` namespace properties refer to the same locale manager.

These v1 function aliases are also retained:

| Preferred | Retained v1 alias |
| --- | --- |
| `collectionObservable` | `observableCollection` |
| `defaultObservable` | `observableDefault` |
| `formattedObservable` | `observableFormatted` |
| `localizedObservable` | `observableLocalized` |
| `triggeredObservable` | `observableTriggered` |

## Add ModelRef only when the application uses it

ModelRef is optional and is not pulled into a core-only application. Import it from its own package and keep Backbone, ModelRef, and Knockback in the same dependency graph so they share one Backbone instance.

```ts
import { viewModel } from '@mcpeasy/knockback';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';

class Person extends Backbone.Model<{ name?: string }> {}

const person = new Person({ name: 'Ada' });
const people = new Backbone.Collection<Person>([person]);
const reference = new ModelRef<Person>(people, person.cid);
const personView = viewModel(reference, { keys: ['name'] });

personView.dispose();
reference.release();
```

An unloaded reference presents `null` values, follows later load, unload, and replacement events, and keeps the same Knockback observable properties until disposal.

## Load relationship packages explicitly

Backbone Relational and Backbone Associations are external packages. Import the package the application uses; Knockback does not bundle or load either one.

```ts
import 'backbone-relational';
import 'backbone-associations';
import kb from '@mcpeasy/knockback';

kb.configure({ orm: undefined });
```

`orm: undefined` selects automatic mode. In that mode, the built-in adapters inspect each actual model: a Relational model uses the Relational adapter, an Associated model uses the Associations adapter, and an ordinary Backbone model uses neither. Both relationship packages can therefore be present without applying one package's relation rules to the other package's models.

Knockback captures an adapter when it attaches a model to an observable or view model. Changing `configure({ orm: ... })` affects later attachments; it does not change the adapter already owned by an existing observable.

Use `configure({ orm: 'default' })` when relation discovery must be disabled. A custom adapter for a narrower model type must provide an `isModel` type guard.

## Opt in to BackboneORM

Knockback does not auto-select BackboneORM from a model shape. Load it explicitly and select its registered adapter:

```ts
import kb from '@mcpeasy/knockback';
import BackboneORM from 'backbone-orm';

kb.configure({ orm: 'backbone-orm' });
BackboneORM.configure({ model_cache: { enabled: true, max: 100 } });
```

For a browser application, do not import the Node root entry. Before the application module is evaluated, load Underscore and Backbone as classic scripts, then load the packaged `backbone-orm/umd` entry. The import map must resolve `backbone` to that same global Backbone object. The public browser overlay validates those globals and installs itself during module evaluation:

```ts
import kb from '@mcpeasy/knockback';
import BackboneORM from 'backbone-orm/browser';

kb.configure({ orm: 'backbone-orm' });
BackboneORM.configure({ model_cache: { enabled: true, max: 20 } });
```

Do not call `installBrowserRuntime` after the default browser import. That import has already installed the overlay. The UMD runtime, browser overlay, Knockback, the application, and ModelRef when it is used must all resolve the same Backbone object. The root `backbone-orm` entry remains the native Node CJS/ESM entry and is not a browser fallback.

## Make injection explicit

Importing Knockback registers the Knockout `inject` binding handler. It does not scan the document for `kb-inject` attributes and does not wrap or replace `ko.applyBindings`.

Call `injectViewModels(root)` explicitly for a subtree that uses `kb-inject`. Ordinary `data-bind="inject: ..."` markup continues to run through the registered binding when the application calls `ko.applyBindings`. Expression, constructor, and `create` errors propagate to the caller; `afterBinding` does not run after one of those failures.

## Validate a local three-package checkout

The local family application is a prepared integration fixture, not a clean-clone bootstrap. Its dependencies must already be installed. The accepted Knockback build, ModelRef tarball and manifests, and sealed BackboneORM browser payload must also exist at the paths pinned by `accepted.json` and `scripts/refresh.ts`. The refresh command verifies and stages those inputs; it does not produce them.

On the managed macOS integration host, run refresh and tests from the family application through the repository resource guard:

```sh
cd test/integration/local-family
node ../../../scripts/test-safe.ts -- npm run refresh
node ../../../scripts/test-safe.ts -- npm run refresh:execute
node ../../../scripts/test-safe.ts -- npm test
```

The guard requires macOS, an available heavy-test slot, normal memory pressure, and a prepared `~/.config/migration-test-guard/config.json` limits file. It uses macOS `sysctl`, `ps`, and `footprint`; this guide makes no Windows or Linux claim for the guarded workflow. If the guard refuses a launch, stop rather than deleting its lock, retrying around it, or raising its limits.

`refresh` verifies the accepted Knockback, BackboneORM, and ModelRef inputs. `refresh:execute` stages those inputs and replaces the application's three package symlinks while preserving its single application-owned Backbone. This workflow validates a prepared local checkout; it is not a registry installation or publication procedure.

## Retired v1 scope

The Parse 1.5 integration is not part of the current migration target. The v1-era build, test, and generated distribution tooling is also retired; migrate application imports to the declared CJS, ESM, or browser UMD entries instead of carrying forward the old source-build workflow.

The package name and release version remain open release decisions. Keep the import specifier centralized in application code so it can be changed after those decisions are made, and do not infer a registry tag from the current workspace manifest.
