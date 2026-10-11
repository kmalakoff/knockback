import kb from '@mcpeasy/knockback';
import assert from 'assert';

describe('exports .ts', () => {
  it('loads the public tooling entry', () => {
    assert.strictEqual(typeof kb.viewModel, 'function');
  });
});
