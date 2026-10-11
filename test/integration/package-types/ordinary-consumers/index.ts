import kb from '@mcpeasy/knockback';
import Backbone from 'backbone';

class Person extends Backbone.Model<{ name?: string }> {}

const person = new Person({ name: 'Ada' });
const viewModel = kb.viewModel(person);
const name: unknown = viewModel.name;

// @ts-expect-error shipped Backbone declarations must reject non-model values
const invalidModel: Backbone.Model = 42;

void [invalidModel, name];
