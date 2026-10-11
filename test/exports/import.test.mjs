import kb from '@mcpeasy/knockback';
import assert from 'assert';

describe('exports .mjs', () => {
  it('loads the public ESM entry', () => {
    assert.strictEqual(typeof kb.viewModel, 'function');
  });
});
