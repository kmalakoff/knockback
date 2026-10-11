import kb, { type CollectionObservable, collectionObservable, type ObservableOptions, observable, type ViewModel } from '@mcpeasy/knockback';
import Backbone from 'backbone';

class Person extends Backbone.Model<{ child?: Person; name?: string; rank?: number }> {}

class PersonView {
  readonly model: Person;
  constructor(model: Person) {
    this.model = model;
  }
  dispose(): void {}
}

const person = new Person({ name: 'Ada', rank: 1 });
const parent = new Person({ child: person });
const people = new Backbone.Collection<Person>([person]);

const inferredRawModel = observable(parent, { key: 'child', read: () => person });
// @ts-expect-error a raw model callback does not prove the presented getter type
inferredRawModel().get('name');

const inferredRawCollection = observable(parent, { key: 'child', read: () => people });
// @ts-expect-error a raw collection callback does not prove the presented getter type
inferredRawCollection().get(person.cid);

// @ts-expect-error a narrow raw write callback cannot accept an unknown public write contract
observable(person, { key: 'name', write: (value: number) => person.set('name', String(value)) });

const unknownWrite = observable(person, {
  key: 'name',
  write: (value: unknown) => person.set('name', String(value)),
});
// @ts-expect-error a write callback does not establish the presented getter type
unknownWrite().toFixed(0);

const scalarOptions: ObservableOptions<number, [], number, number> = {
  key: 'rank',
  read: () => Number(person.get('rank')),
  write: (value) => person.set('rank', value),
};
export const scalar = observable<number, Person, [], number, number>(person, scalarOptions);
const scalarValue: number = scalar();
scalar(2);
void scalarValue;

type PresentedPerson = ViewModel<Record<string, unknown>, Person>;
const wrappedOptions: ObservableOptions<PresentedPerson, [], Person, Person> = {
  key: 'child',
  read: () => person,
  write: (value) => parent.set('child', value),
};
export const wrapped = observable<PresentedPerson, Person, [], Person, Person>(parent, wrappedOptions);
const presented: PresentedPerson = wrapped();
wrapped(presented);

export const constructorItems = collectionObservable(people, PersonView);
const constructorItem: PersonView | undefined = constructorItems()[0];
void constructorItem;

const arrowObject = (model: Person) => new PersonView(model);
export const arrowObjectItems = collectionObservable(people, arrowObject);
const arrowObjectItem: PersonView | undefined = arrowObjectItems()[0];
void arrowObjectItem;

function ordinaryObject(model: Person): PersonView {
  return new PersonView(model);
}
export const ordinaryObjectItems = collectionObservable(people, ordinaryObject);
const ordinaryObjectItem: PersonView | undefined = ordinaryObjectItems()[0];
void ordinaryObjectItem;

const createObject = { create: (model: Person) => new PersonView(model) };
export const createObjectItems = collectionObservable<PersonView, Person>(people, { viewModel: createObject });

const arrowNull = (_model: Person): null => null;
const arrowNullItems = collectionObservable(people, arrowNull);
// @ts-expect-error falsy output selects a runtime fallback and cannot infer null presentation
const nullItem: null | undefined = arrowNullItems()[0];
void nullItem;

function ordinaryUndefined(_model: Person): undefined {
  return undefined;
}
const ordinaryUndefinedItems = collectionObservable(people, ordinaryUndefined);
// @ts-expect-error constructor dispatch discards the ordinary function's undefined return
const undefinedItem: undefined = ordinaryUndefinedItems()[0];
void undefinedItem;

const arrowString = (_model: Person): string => 'invalid-owner';
const arrowStringItems = collectionObservable(people, arrowString);
// @ts-expect-error a primitive callable result is not a retained presentation contract
arrowStringItems()[0]?.toUpperCase();

function ordinaryString(_model: Person): string {
  return 'discarded';
}
const ordinaryStringItems = collectionObservable(people, ordinaryString);
// @ts-expect-error constructor dispatch discards the ordinary function's primitive return
ordinaryStringItems()[0]?.toUpperCase();

const rawCreator = Object.assign(arrowObject, { modelsOnly: true as const });
const rawItems = collectionObservable(people, rawCreator);
const rawItem: Person | undefined = rawItems()[0];
void rawItem;

const widenedCreator = Object.assign(arrowObject, { modelsOnly: true as boolean });
const widenedItems = collectionObservable(people, widenedCreator);
const widenedItem: Person | PersonView | undefined = widenedItems()[0];
void widenedItem;

const explicitLegacy: CollectionObservable<PersonView> = collectionObservable<PersonView>(people, ordinaryObject);
void [explicitLegacy, kb];
