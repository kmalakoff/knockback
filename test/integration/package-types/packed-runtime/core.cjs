const assert = require('node:assert');
const Backbone = require('backbone');
const kb = require('@mcpeasy/knockback').default;

assert.throws(() => require.resolve('backbone-modelref'), { code: 'MODULE_NOT_FOUND' });

const model = new Backbone.Model({ name: 'Ada' });
const viewModel = kb.viewModel(model);
assert.strictEqual(viewModel.name(), 'Ada');
model.set('name', 'Grace');
assert.strictEqual(viewModel.name(), 'Grace');
viewModel.dispose();
assert.strictEqual(viewModel.name, null);

console.log(JSON.stringify({ format: 'cjs', modelRef: false, lifecycle: true }));
