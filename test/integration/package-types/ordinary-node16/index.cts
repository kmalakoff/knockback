const Backbone: typeof import('backbone') = require('backbone');
const kb: typeof import('@mcpeasy/knockback').default = require('@mcpeasy/knockback').default;

class Person extends Backbone.Model<{ name?: string }> {}

const person = new Person({ name: 'Ada' });
const viewModel = kb.viewModel(person);
const name: unknown = viewModel.name;

// @ts-expect-error shipped Backbone declarations must reject non-model values
const invalidModel: import('backbone').Model = 42;

void [invalidModel, name];
