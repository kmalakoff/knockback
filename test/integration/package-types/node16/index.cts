import Backbone = require('backbone');
import kbPackage = require('@mcpeasy/knockback');
import ko = require('knockout');

const kb = kbPackage.default;

class Person extends Backbone.Model<{ name?: string }> {
  readonly modelKind = 'person';
}

class PersonView {
  readonly model: Person;

  constructor(model: Person) {
    this.model = model;
  }

  dispose(): void {}
}

class OtherModel extends Backbone.Model<{ code?: string }> {
  readonly modelKind = 'other';
}

const person = new Person({ name: 'Ada' });
const people = new Backbone.Collection<Person>([person]);
const creator = (model: Person) => new PersonView(model);

const views = kb.collectionObservable(people, creator);
const view: PersonView | undefined = views()[0];
void view;

const rawCreator = Object.assign(creator, { modelsOnly: true as const });
const models = kb.collectionObservable(people, rawCreator);
const model: Person | undefined = models()[0];
void model;

const name = kb.observable<string | undefined, Person>(person, 'name');
const currentName: string | undefined = name();
void currentName;

const validation = kb.valueValidator(
  ko.pureComputed(() => person.get('name') ?? ''),
  {
    missing: (value) => value.length === 0,
  }
);

const legacyView = new kb.ViewModel(person);
const legacyValue = new kb.Observable<string | undefined, Person>(person, 'name');
const legacyCollection = new kb.CollectionObservable<Person, Person>(people, { models_only: true });
const observableFallback = ko.observable('observable fallback');
const observableDefaultTarget = ko.observable<string | typeof observableFallback | null>(null);
const observableDefault = new kb.DefaultObservable(observableDefaultTarget, observableFallback);
const observableDefaultRead: string = observableDefault();
const nestedDefaultTarget = ko.observable<string | null>(null);
const nestedDefaultInner = new kb.DefaultObservable(nestedDefaultTarget, 'inner fallback');
const nestedDefaultOuter = new kb.DefaultObservable(nestedDefaultInner, 'outer fallback');
const nestedDefaultRead: string = nestedDefaultOuter();
nestedDefaultOuter(null);
// @ts-expect-error the default constructor unwraps an observable fallback when reading
const rawObservableDefault: typeof observableFallback = observableDefault();
// @ts-expect-error a nested default constructor preserves the inner write type
nestedDefaultOuter(observableFallback);
// @ts-expect-error ViewModel is a constructor, not a callable factory
kb.ViewModel(person);
legacyView.destroy();
legacyValue.release();
legacyCollection.destroy();
observableDefault.release();
nestedDefaultOuter.release();
nestedDefaultInner.release();
kb.releaseKeys({ legacyView, legacyValue });
const released: boolean | undefined = kb.wasReleased(legacyView);

const wrongCreator = (model: OtherModel) => model.get('code');
// @ts-expect-error Node16 CommonJS resolution preserves the input model contract
kb.collectionObservable(people, wrongCreator);

void [legacyCollection, models, name, nestedDefaultRead, observableDefaultRead, rawObservableDefault, released, validation, views];
