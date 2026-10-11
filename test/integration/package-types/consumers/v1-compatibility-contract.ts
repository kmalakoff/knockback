import kb, {
  CollectionObservable,
  type CollectionObservableOptions,
  DefaultObservable,
  EventWatcher,
  Factory,
  FormattedObservable,
  Inject,
  ignore,
  injectViewModels,
  LocalizedObservable,
  Observable,
  peek,
  release,
  releaseKeys,
  TriggeredObservable,
  Validation,
  type ValidationOptions,
  type ValidationResult,
  ViewModel,
  valueValidator,
  wasReleased,
} from '@mcpeasy/knockback';
import Backbone from 'backbone';
import ko from 'knockout';

class Person extends Backbone.Model<{ name?: string; rank?: number }> {}

class PersonView {
  readonly name: ko.Observable<string | undefined>;

  constructor(model: Person) {
    this.name = ko.observable(model.get('name'));
  }
}

const person = new Person({ name: 'Ada', rank: 1 });
const people = new Backbone.Collection<Person>([person]);
const watcher = new EventWatcher(person);
const backboneIdentity: typeof Backbone = kb.Backbone;
const modelIdentity: typeof Backbone.Model = kb.Model;
const collectionIdentity: typeof Backbone.Collection = kb.Collection;
const eventsIdentity: typeof Backbone.Events = kb.Events;
const knockoutIdentity: typeof ko = kb.ko;
const modulesBackboneIdentity: typeof Backbone = kb.modules.backbone;
const modulesKnockoutIdentity: typeof ko = kb.modules.knockout;

class FactoryView {}

class InjectedView {}

const parentFactory = new Factory();
parentFactory.addPathMapping('parent', FactoryView);
const childFactory = new kb.Factory(parentFactory);
childFactory.addPathMapping('legacy', { view_model: FactoryView });
const inheritedFactoryCreator = childFactory.creatorForPath(person, 'parent');
const legacyFactoryCreator = childFactory.creatorForPath(person, 'legacy');
const ordered: number = kb.compare(1, 2);
const ignored: number = ignore(
  function (this: { base: number }, amount: number) {
    return this.base + amount;
  },
  { base: 1 },
  [2]
);
const peeked: string = peek(ko.observable('Ada'));
const injectableElement = document.createElement('div');
const injected: unknown = Inject.inject({ view_model: InjectedView }, {}, injectableElement);
const injectedViews = injectViewModels(injectableElement);

const options: CollectionObservableOptions<PersonView, Person> = {
  auto_compact: true,
  models_only: false,
  sort_attribute: 'rank',
  view_model: PersonView,
};

export const legacyView = new ViewModel<{ name: ko.Observable<string | undefined> }, Person>(person, {
  event_watcher: watcher,
  static_defaults: { missing: 'fallback' },
});
export const legacyValue = new Observable<string | undefined, Person>(person, 'name', { event_watcher: watcher });
export const legacyCollection = new CollectionObservable<PersonView, Person>(people, options);
const nestedLegacyModeOptions = {
  modelsOnly: false,
  options: { models_only: true },
  viewModel: PersonView,
};
export const nestedLegacyMode = kb.collectionObservable<PersonView | Person, Person>(people, nestedLegacyModeOptions);
const nestedCamelModeOptions = {
  models_only: true,
  options: { modelsOnly: false },
  viewModel: PersonView,
};
export const nestedCamelMode = kb.collectionObservable<PersonView | Person, Person>(people, nestedCamelModeOptions);
const nestedLegacyItem: PersonView | Person | undefined = nestedLegacyMode()[0];
const nestedCamelItem: PersonView | Person | undefined = nestedCamelMode()[0];
const nestedLegacySortOptions = {
  models_only: true,
  sortAttribute: 'rank',
  options: { sort_attribute: 'legacyRank' },
};
export const nestedLegacySort = kb.collectionObservable<Person, Person>(people, nestedLegacySortOptions);
const nestedCamelSortOptions = {
  models_only: true,
  sort_attribute: 'legacyRank',
  options: { sortAttribute: 'rank' },
};
export const nestedCamelSort = kb.collectionObservable<Person, Person>(people, nestedCamelSortOptions);
const nestedLegacySortItem: Person | undefined = nestedLegacySort()[0];
const nestedCamelSortItem: Person | undefined = nestedCamelSort()[0];
export const legacyDefault: DefaultObservable<string, string | null> = new DefaultObservable(ko.observable<string | null>(null), 'fallback');
const observableFallback = ko.observable('observable fallback');
const observableDefaultTarget = ko.observable<string | typeof observableFallback | null>(null);
export const observableDefault: DefaultObservable<string, string | typeof observableFallback | null> = new DefaultObservable(observableDefaultTarget, observableFallback);
const observableDefaultRead: string = observableDefault();
observableDefault(observableFallback);
// @ts-expect-error the constructor unwraps an observable default by one level when reading
const rawObservableDefault: typeof observableFallback = observableDefault();

const nestedTarget = ko.observable<string | null>(null);
export const nestedDefaultInner: DefaultObservable<string, string | null> = new DefaultObservable(nestedTarget, 'inner fallback');
export const nestedDefaultOuter: DefaultObservable<string, string | null> = new DefaultObservable(nestedDefaultInner, 'outer fallback');
const nestedDefaultRead: string = nestedDefaultOuter();
nestedDefaultOuter(null);
// @ts-expect-error a nested constructor preserves the inner wrapper's raw write type
nestedDefaultOuter(observableFallback);
// @ts-expect-error a nested constructor default must be writable by the inner wrapper
new DefaultObservable(nestedDefaultInner, 42);
export const legacyFormatted = new FormattedObservable('{0}', ko.observable('Ada'));
export const legacyTriggered = new TriggeredObservable(person, 'change:name');
const validationNamespace = new Validation();
const defaultValidationNamespace = new kb.Validation();

const localeManager = new Backbone.Model() as Backbone.Model & {
  getLocale(): string;
  setLocale(locale: string): void;
};
localeManager.getLocale = () => 'en';
localeManager.setLocale = () => undefined;
kb.locale_manager = localeManager;
const TypedLocalizer = LocalizedObservable.extend({
  read(value: unknown) {
    return String(value);
  },
});
const localizedValue = new TypedLocalizer('Ada');

const legacyCollectionAlias = kb.observableCollection(people, { models_only: true });
const legacyDefaultAlias = kb.observableDefault(ko.observable<string | null>(null), 'fallback');
const legacyFormattedAlias = kb.observableFormatted('{0}', ko.observable('Ada'));
const legacyLocalizedAlias = kb.observableLocalized('Ada', { read: String });
const legacyTriggeredAlias = kb.observableTriggered(person, 'change:name');
const legacyEmitter = kb.emitterObservable(person, {});

// @ts-expect-error the published v1 ViewModel contract requires construction with new
ViewModel(person);

legacyView.destroy();
legacyValue.release();
legacyCollection.destroy();
nestedLegacyMode.dispose();
nestedCamelMode.dispose();
nestedLegacySort.dispose();
nestedCamelSort.dispose();
legacyDefault.release();
observableDefault.release();
nestedDefaultOuter.release();
nestedDefaultInner.release();
legacyFormatted.destroy();
legacyTriggered.release();
localizedValue.dispose();
legacyCollectionAlias.dispose();
legacyDefaultAlias.dispose();
legacyFormattedAlias.dispose();
legacyLocalizedAlias.dispose();
legacyTriggeredAlias.dispose();
legacyEmitter.dispose();
watcher.destroy();

const Extended = ViewModel.extend(
  {
    label() {
      return this.model()?.get('name') ?? 'missing';
    },
  },
  { category: 'person' as const }
);
export const extended = new Extended(person);
const category: 'person' = Extended.category;
const label: string = extended.label();

const Parent = ViewModel.extend(
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
export const parentExtended = new Parent(person);
export const childExtended = new Child(person);
const parentCategory: 'parent' = Parent.category;
const childCategory: 'child' = Child.category;
const inheritedStatic: 'shared' = Child.inheritedStatic;
const parentLabel: string = childExtended.parentLabel();
const childLabel: string = childExtended.childLabel();
const parentInstance: InstanceType<typeof Parent> = childExtended;
// @ts-expect-error a parent instance does not have child-only behavior
const childInstance: InstanceType<typeof Child> = parentExtended;

const validationOptions: ValidationOptions = { no_attach: true, priorities: ['required'] };
export const validation = valueValidator(ko.observable(''), { required: (value) => !value }, validationOptions);
const validationResult: ValidationResult = validation();
const errorCount: number = validationResult.$error_count;
const activeError: string | undefined = validationResult.$active_error;

const owner: { child: typeof legacyValue | null } = { child: legacyValue };
releaseKeys(owner);
release(extended);
release(parentExtended);
release(childExtended);
const released: boolean | undefined = wasReleased(extended);

const defaultLegacyView = new kb.ViewModel(person);
const defaultLegacyValue = new kb.Observable(person, 'name');
const defaultLegacyCollection = new kb.CollectionObservable(people, { models_only: true });
kb.releaseKeys({ defaultLegacyCollection, defaultLegacyValue, defaultLegacyView });

void [
  nestedLegacyItem,
  nestedCamelItem,
  nestedLegacySortItem,
  nestedCamelSortItem,
  activeError,
  backboneIdentity,
  category,
  childCategory,
  childInstance,
  childLabel,
  collectionIdentity,
  defaultValidationNamespace,
  errorCount,
  eventsIdentity,
  inheritedStatic,
  knockoutIdentity,
  modulesBackboneIdentity,
  modulesKnockoutIdentity,
  inheritedFactoryCreator,
  legacyFactoryCreator,
  ordered,
  ignored,
  peeked,
  injected,
  injectedViews,
  label,
  modelIdentity,
  nestedDefaultRead,
  observableDefaultRead,
  parentCategory,
  parentInstance,
  parentLabel,
  rawObservableDefault,
  released,
  validationNamespace,
];
