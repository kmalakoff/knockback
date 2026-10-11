import assert from 'node:assert';
import { createRequire } from 'node:module';
import kb from '@mcpeasy/knockback';
import Backbone from 'backbone';

const require = createRequire(import.meta.url);
assert.throws(() => require.resolve('backbone-modelref'), { code: 'MODULE_NOT_FOUND' });

const model = new Backbone.Model({ name: 'Ada' });
const viewModel = kb.viewModel(model);
assert.strictEqual(viewModel.name(), 'Ada');
model.set('name', 'Grace');
assert.strictEqual(viewModel.name(), 'Grace');
viewModel.dispose();
assert.strictEqual(viewModel.name, null);

console.log(JSON.stringify({ format: 'esm', modelRef: false, lifecycle: true }));
