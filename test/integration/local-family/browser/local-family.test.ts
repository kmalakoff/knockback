import kb from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ModelRef from 'backbone-modelref';
import ko from 'knockout';
import _ from 'underscore';

describe('local family browser application', () => {
  it('runs Knockback and ModelRef from local assets with one Backbone', () => {
    const browserGlobal = globalThis as typeof globalThis & {
      Backbone?: typeof Backbone;
      ko?: typeof ko;
      _?: typeof _;
    };
    assert.strictEqual(browserGlobal.Backbone, Backbone);
    assert.strictEqual(browserGlobal.ko, ko);
    assert.strictEqual(browserGlobal._, _);
    assert.strictEqual((Backbone as typeof Backbone & { ModelRef?: typeof ModelRef }).ModelRef, ModelRef);

    class Person extends Backbone.Model<{ id: number; name: string }> {}
    const people = new Backbone.Collection<Person>();
    const reference = new ModelRef<Person>(people, 7);
    const view = kb.viewModel(reference, { keys: ['name'] });
    const element = document.querySelector<HTMLElement>('#app');
    assert.ok(element);
    element.dataset.bind = 'text: name';
    ko.applyBindings(view, element);

    assert.strictEqual(element.textContent, '');
    const person = new Person({ id: 7, name: 'Ada' });
    people.add(person);
    assert.strictEqual(element.textContent, 'Ada');
    person.set('name', 'Grace');
    assert.strictEqual(element.textContent, 'Grace');

    ko.cleanNode(element);
    view.dispose();
    reference.release();
    const externalRequests = performance
      .getEntriesByType('resource')
      .map((entry) => entry.name)
      .filter((url) => new URL(url).origin !== location.origin);
    assert.deepStrictEqual(externalRequests, []);
  });
});
