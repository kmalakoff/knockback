const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const Backbone = require('backbone');
const ModelRef = require('backbone-modelref');
const kb = require('@mcpeasy/knockback').default;

const appRequire = createRequire(path.join(process.cwd(), 'package.json'));
const modelRefRequire = createRequire(appRequire.resolve('backbone-modelref/package.json'));
assert.strictEqual(fs.realpathSync(modelRefRequire.resolve('backbone')), fs.realpathSync(appRequire.resolve('backbone')));
assert.strictEqual(ModelRef, Backbone.ModelRef);

const model = new Backbone.Model({ id: 'cjs', name: 'CommonJS' });
const reference = new ModelRef(new Backbone.Collection([model]), 'cjs');
const viewModel = kb.viewModel(reference);
assert.strictEqual(viewModel.model(), model);
assert.strictEqual(viewModel.name(), 'CommonJS');
viewModel.dispose();
assert.strictEqual(viewModel.name, null);
reference.release();
assert.strictEqual(reference.ref_count, 0);

console.log(JSON.stringify({ format: 'cjs', modelRef: true, sharedBackbone: true, lifecycle: true }));
