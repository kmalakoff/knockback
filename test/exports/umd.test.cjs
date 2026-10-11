const globalKeys = ['kb', 'ViewModel', 'CollectionObservable', 'viewModel', 'collectionObservable', 'defaultObservable', 'statistics'];
let assert;
let kb;
let umd;

before(async () => {
  const globalDescriptors = new Map(globalKeys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  if (typeof require === 'function') {
    assert = require('assert');
    umd = require('@mcpeasy/knockback/umd');
  } else {
    assert = (await import('assert')).default;
    umd = await import('@mcpeasy/knockback/umd');
  }
  kb = typeof window !== 'undefined' ? window.mcpeasyKnockback : umd.default || umd;
  for (const [key, descriptor] of globalDescriptors) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete globalThis[key];
  }
});

describe('exports umd', () => {
  it('loads the public UMD subpath and browser global', () => {
    if (typeof window === 'undefined') assert.strictEqual(typeof umd.viewModel, 'function');
    assert.strictEqual(typeof kb.viewModel, 'function');
  });
});
