import assert from 'node:assert';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import kb from '@mcpeasy/knockback';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';

const appRequire = createRequire(import.meta.url);
const modelRefRequire = createRequire(appRequire.resolve('backbone-modelref/package.json'));
assert.strictEqual(fs.realpathSync(modelRefRequire.resolve('backbone')), fs.realpathSync(appRequire.resolve('backbone')));
assert.strictEqual(ModelRef, Backbone.ModelRef);

const model = new Backbone.Model({ id: 'esm', name: 'ESM' });
const reference = new ModelRef(new Backbone.Collection([model]), 'esm');
const viewModel = kb.viewModel(reference);
assert.strictEqual(viewModel.model(), model);
assert.strictEqual(viewModel.name(), 'ESM');
viewModel.dispose();
assert.strictEqual(viewModel.name, null);
reference.release();
assert.strictEqual(reference.ref_count, 0);

console.log(JSON.stringify({ format: 'esm', modelRef: true, sharedBackbone: true, lifecycle: true }));
