import kb from '@mcpeasy/knockback';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';

class Person extends Backbone.Model<{ name?: string }> {}

const person = new Person({ name: 'Ada' });
const reference = new ModelRef<Person>(new Backbone.Collection<Person>([person]), person.cid);
const referencedPerson: Person | null | undefined = reference.model();
const viewModel = kb.viewModel(reference);
const name: unknown = viewModel.name;

// @ts-expect-error ModelRef preserves its concrete model type
const invalidReference: ModelRef<Backbone.Model & { missing(): string }> = reference;

void [invalidReference, name, referencedPerson];
