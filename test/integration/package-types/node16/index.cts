const Backbone: typeof import('backbone') = require('backbone');
const kb: typeof import('@mcpeasy/knockback').default = require('@mcpeasy/knockback').default;
const ko: typeof import('knockout') = require('knockout');

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

const wrongCreator = (model: OtherModel) => model.get('code');
// @ts-expect-error Node16 CommonJS resolution preserves the input model contract
kb.collectionObservable(people, wrongCreator);

void [models, name, validation, views];
