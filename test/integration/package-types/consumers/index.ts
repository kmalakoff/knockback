import kb, { type CollectionCreator, type CollectionObservable, type CollectionObservableOptions, collectionObservable, type ObservableOptions, observable, type ReadableObservable, valueValidator, viewModel } from '@mcpeasy/knockback';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';
import ko from 'knockout';
import './callback-contract.ts';
import './presentation-contract.ts';
import './relationship-adapter-contract.ts';
import './v1-compatibility-contract.ts';

interface PersonAttributes {
  name?: string;
  rank?: number;
}

class Person extends Backbone.Model<PersonAttributes> {
  readonly modelKind = 'person';
}

class OtherModel extends Backbone.Model<{ code?: string }> {
  readonly modelKind = 'other';
}

class PersonView {
  readonly kind = 'person';
  readonly model: Person;

  constructor(model: Person) {
    this.model = model;
  }

  dispose(): void {}
}

class OtherView {
  readonly kind = 'other';
  readonly model: OtherModel;

  constructor(model: OtherModel) {
    this.model = model;
  }
}

const person = new Person({ name: 'Ada', rank: 1 });
const people = new Backbone.Collection<Person>([person]);
const callableCreator = (model: Person) => new PersonView(model);
const objectCreator = { create: (model: Person) => new PersonView(model) };

export const constructorItems = collectionObservable(people, PersonView);
const constructorItem: PersonView | undefined = constructorItems()[0];
void constructorItem;

export const callableItems = collectionObservable(people, callableCreator);
const callableItem: PersonView | undefined = callableItems()[0];
void callableItem;

export const objectItems = collectionObservable(people, { viewModel: objectCreator });
const objectItem: PersonView | { dispose(): void } | undefined = objectItems()[0];
void objectItem;

export const createItems = collectionObservable(people, { create: objectCreator.create });
const createItem: PersonView | { dispose(): void } | undefined = createItems()[0];
void createItem;

const checkedCreator: CollectionCreator<PersonView, Person> = callableCreator;
export const checkedItems = collectionObservable(people, checkedCreator);

const wrongCreator = (model: OtherModel) => new OtherView(model);
// @ts-expect-error an inferred creator for a sibling model cannot consume Person models
collectionObservable(people, wrongCreator);
// @ts-expect-error an options creator for a sibling model cannot consume Person models
collectionObservable(people, { viewModel: wrongCreator });
// @ts-expect-error inferred collection items are PersonView, not OtherView
const wrongResult: OtherView | undefined = callableItems()[0];
void wrongResult;

const callableRaw = Object.assign(callableCreator, { modelsOnly: true as const });
export const callableRawItems = collectionObservable(people, callableRaw);
const callableRawItem: Person | undefined = callableRawItems()[0];
void callableRawItem;

const callableViews = Object.assign(callableCreator, { modelsOnly: false as const });
export const callableViewItems = collectionObservable(people, callableViews);
const callableViewItem: PersonView | undefined = callableViewItems()[0];
void callableViewItem;

const inheritedRaw = Object.setPrototypeOf(callableCreator.bind(undefined), {
  modelsOnly: true as const,
}) as typeof callableCreator & { modelsOnly: true };
export const inheritedRawItems = collectionObservable(people, inheritedRaw);
const inheritedRawItem: Person | undefined = inheritedRawItems()[0];
void inheritedRawItem;

const objectRaw = { create: objectCreator.create, modelsOnly: true as const };
export const objectRawItems = collectionObservable(people, { viewModel: objectRaw });
const objectRawItem: Person | { dispose(): void } | undefined = objectRawItems()[0];
void objectRawItem;

const inheritedObjectRaw = Object.setPrototypeOf(
  { create: objectCreator.create },
  {
    modelsOnly: true as const,
  }
) as typeof objectCreator & { modelsOnly: true };
export const inheritedObjectRawItems = collectionObservable(people, { viewModel: inheritedObjectRaw });
const inheritedObjectRawItem: Person | { dispose(): void } | undefined = inheritedObjectRawItems()[0];
void inheritedObjectRawItem;

export const topLevelRawItems = collectionObservable(people, { modelsOnly: true });
const topLevelRawItem: Person | { dispose(): void } | undefined = topLevelRawItems()[0];
void topLevelRawItem;

export const topLevelViewItems = collectionObservable(people, { modelsOnly: false });
const topLevelViewItem: { dispose(): void } | undefined = topLevelViewItems()[0];
void topLevelViewItem;

export function topLevelWidenedItems(modelsOnly: boolean) {
  const items = collectionObservable(people, { modelsOnly });
  const item: Person | { dispose(): void } | undefined = items()[0];
  void item;
  return items;
}

const inheritedTopLevelOptions = Object.setPrototypeOf(
  { viewModel: callableCreator },
  {
    modelsOnly: true as const,
  }
) as { viewModel: typeof callableCreator; modelsOnly: true };
export const inheritedTopLevelItems = collectionObservable(people, inheritedTopLevelOptions);
const inheritedTopLevelItem: Person | PersonView | { dispose(): void } | undefined = inheritedTopLevelItems()[0];
void inheritedTopLevelItem;

export const ownUndefinedItems = collectionObservable(people, {
  viewModel: callableRaw,
  modelsOnly: undefined,
});
const ownUndefinedItem: Person | { dispose(): void } | undefined = ownUndefinedItems()[0];
void ownUndefinedItem;
// @ts-expect-error an own undefined modelsOnly value selects the default view path
ownUndefinedItems()[0]?.get('name');

export function optionalModeItems(options: { viewModel: typeof callableCreator; modelsOnly?: true }) {
  const items = collectionObservable(people, options);
  const item: Person | PersonView | { dispose(): void } | undefined = items()[0];
  void item;
  return items;
}

export const explicitItems = collectionObservable<PersonView>(people);
const explicitItem: PersonView | undefined = explicitItems()[0];
void explicitItem;

const explicitOptions: CollectionObservableOptions<PersonView, Person> = {
  viewModel: callableCreator,
  comparator: (left, right) => left.model.cid.localeCompare(right.model.cid),
  filters: (model) => model.has('name'),
};
export const explicitTypedItems = collectionObservable<PersonView, Person>(people, explicitOptions);
const explicitTypedItem: PersonView | undefined = explicitTypedItems()[0];
void explicitTypedItem;

const wrongComparatorOptions: CollectionObservableOptions<PersonView, Person> = {
  viewModel: callableCreator,
  // @ts-expect-error comparator values are the declared PersonView items
  comparator: (left: OtherView, right: OtherView) => left.model.cid.localeCompare(right.model.cid),
};
void wrongComparatorOptions;

const wrongFilterOptions: CollectionObservableOptions<PersonView, Person> = {
  viewModel: callableCreator,
  // @ts-expect-error filters consume the declared Person input model
  filters: (model: OtherModel) => model.has('code'),
};
void wrongFilterOptions;

function thirdArgumentOverridesRaw() {
  const items = collectionObservable(people, { modelsOnly: true }, { modelsOnly: false });
  // @ts-expect-error three-argument option merging is dynamic unless the result is caller-declared
  return items()[0].get('name');
}

function thirdArgumentOverridesViews() {
  const items = collectionObservable(people, { modelsOnly: false }, { modelsOnly: true });
  // @ts-expect-error three-argument option merging is dynamic unless the result is caller-declared
  return items()[0].dispose();
}

function rootFactoryOverridesRaw() {
  const items = collectionObservable(people, {
    modelsOnly: true,
    factories: { models: PersonView },
  });
  // @ts-expect-error a dynamic factory mapping makes the presented item unknown
  return items()[0].get('name');
}

function explicitUndefinedMode() {
  const items = collectionObservable(people, callableRaw, { modelsOnly: undefined });
  // @ts-expect-error a third argument prevents a direct creator result claim
  return items()[0].get('name');
}

export const uninferredAttribute = observable(person, 'name');
// @ts-expect-error model attributes are not presented unchanged through TypedValue
const inferredName: string | undefined = uninferredAttribute();
void inferredName;

export const explicitName = observable<string | undefined, Person>(person, 'name');
const optionalName: string | undefined = explicitName();
void optionalName;

const typedOptions: ObservableOptions<number, [prefix: string, offset: number]> = {
  key: 'rank',
  args: ['rank-', 2],
  read: (key, prefix, offset) => Number(person.get('rank')) + (typeof key === 'string' ? key.length : 0) + prefix.length + offset,
  write: (value) => person.set('rank', value),
};
export const optionsObservable = observable<number, Person, [string, number]>(person, typedOptions);
// @ts-expect-error the read argument tuple preserves its declared order
typedOptions.args = [2, 'rank-'];
// @ts-expect-error the write callback accepts the observable value type
typedOptions.write = (value: string) => value.length;

const unloadedReference = new ModelRef(people, 999);
export const unloadedName = observable<string | null, Person>(unloadedReference, 'name');
const maybeName: string | null = unloadedName();
void maybeName;

const text = ko.observable('Ada');
const readableText: ReadableObservable<string> = text;
const computedText: ReadableObservable<string> = ko.pureComputed(() => text());
export const validation = valueValidator(readableText, {
  missing: (value) => value.length === 0,
});
export const computedValidation = valueValidator(computedText, {
  missing: (value) => value.length === 0,
});

const callableSubscribable = Object.assign(() => 7, new ko.subscribable<number>());
Object.setPrototypeOf(callableSubscribable, ko.subscribable.fn);
// @ts-expect-error unwrapObservable does not invoke a callable that lacks KO observable identity
valueValidator(callableSubscribable, { finite: (value) => Number.isFinite(value) });

// @ts-expect-error validators must accept the supported observable's value type
valueValidator(readableText, { numeric: (value: number) => value < 0 });
// @ts-expect-error writable KO observables remain invariant in their value type
const widenedWritable: ko.Observable<string | number> = text;
void widenedWritable;

interface ExtendedPerson {
  name: ko.Observable<string | undefined>;
  summary: string;
}

export const extendedPerson = viewModel<ExtendedPerson, Person>(person, {
  extend(vm, model) {
    vm.summary = model?.get('name') ?? 'missing';
  },
});
export const returnedExtension = viewModel<ExtendedPerson, Person>(person, {
  extend: (_vm, model) => ({ summary: model?.get('name') ?? 'missing' }),
});
export const objectExtension = viewModel<ExtendedPerson, Person>(person, {
  extend: { summary: 'ready' },
});

// @ts-expect-error the model callback is Person, not a sibling model
viewModel<ExtendedPerson, Person>(person, {
  extend: (_vm, model: OtherModel | null) => ({ summary: model?.get('code') ?? '' }),
});

const collectionType: CollectionObservable<PersonView> = callableItems;
void collectionType;
void [thirdArgumentOverridesRaw, thirdArgumentOverridesViews, rootFactoryOverridesRaw, explicitUndefinedMode];
void kb;
