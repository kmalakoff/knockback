import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';
import _ from 'underscore';

describe('local browser package artifacts', () => {
  it('shares the published package globals without external requests', () => {
    if (typeof window === 'undefined') return;

    const browserGlobal = globalThis as typeof globalThis & {
      Backbone?: typeof Backbone;
      ko?: typeof ko;
      _?: typeof _;
    };
    const externalRequests = performance
      .getEntriesByType('resource')
      .map((entry) => entry.name)
      .filter((url) => new URL(url).origin !== location.origin);

    assert.strictEqual(browserGlobal.Backbone, Backbone);
    assert.strictEqual(browserGlobal.ko, ko);
    assert.strictEqual(browserGlobal._, _);
    assert.strictEqual((Backbone as typeof Backbone & { VERSION: string }).VERSION, '1.6.1');
    assert.strictEqual(ko.version, '3.5.1');
    assert.strictEqual(_.VERSION, '1.13.8');
    assert.deepStrictEqual(externalRequests, []);
  });
});
