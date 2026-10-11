const globalKeys = ['kb', 'ViewModel', 'CollectionObservable', 'viewModel', 'collectionObservable', 'defaultObservable', 'statistics'];
let assert;
let kb;

before(async () => {
  const globalDescriptors = new Map(globalKeys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  if (typeof require === 'function') {
    assert = require('assert');
    kb = require('@mcpeasy/knockback');
  } else {
    assert = (await import('assert')).default;
    kb = (await import('@mcpeasy/knockback')).default;
  }
  for (const [key, descriptor] of globalDescriptors) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete globalThis[key];
  }
});

describe('exports .cjs', () => {
  it('loads the public CommonJS entry in Node and public root in browsers', () => {
    assert.strictEqual(typeof kb.viewModel, 'function');
  });
});
