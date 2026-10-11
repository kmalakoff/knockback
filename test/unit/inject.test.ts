import kb, { Inject, injectViewModels } from '@mcpeasy/knockback';
import assert from 'assert';
import ko from 'knockout';

const describeBrowser = typeof document === 'undefined' ? describe.skip : describe;
const errorContractKey = '__kbInjectErrorContract';

interface ErrorContract {
  ThrowingViewModel?: new () => unknown;
  afterBinding: () => void;
  create?: () => never;
  evaluate?: () => never;
}

function exposeErrorContract(contract: ErrorContract): void {
  (globalThis as Record<string, unknown>)[errorContractKey] = contract;
}

function clearErrorContract(): void {
  delete (globalThis as Record<string, unknown>)[errorContractKey];
}

describeBrowser('Inject', () => {
  afterEach(clearErrorContract);

  it('constructs and releases a legacy view_model through the public package', () => {
    const element = document.createElement('div');
    document.body.append(element);
    let disposals = 0;

    class LegacyViewModel {
      label = 'legacy';
      parent: unknown;

      constructor(parent: unknown, receivedElement: Element) {
        this.parent = parent;
        assert.strictEqual(receivedElement, element);
      }

      dispose(): void {
        disposals++;
      }
    }

    const parent = { label: 'parent' };
    const result = Inject.inject({ view_model: LegacyViewModel }, parent, element);
    assert.ok(result instanceof LegacyViewModel);
    assert.strictEqual(result.parent, parent);
    assert.strictEqual(result.label, 'legacy');
    ko.removeNode(element);
    assert.strictEqual(disposals, 1);
  });

  it('uses viewModel when both constructor aliases are supplied', () => {
    const element = document.createElement('div');
    document.body.append(element);
    const constructed: string[] = [];

    class CurrentViewModel {
      constructor() {
        constructed.push('current');
      }

      dispose(): void {}
    }

    class LegacyViewModel {
      constructor() {
        constructed.push('legacy');
      }

      dispose(): void {}
    }

    const result = kb.Inject.inject({ viewModel: CurrentViewModel, view_model: LegacyViewModel }, {}, element);
    assert.ok(result instanceof CurrentViewModel);
    assert.deepStrictEqual(constructed, ['current']);
    ko.removeNode(element);
  });

  it('binds kb-inject values and lifecycle hooks once', () => {
    const root = document.createElement('div');
    root.innerHTML = `<section kb-inject="message: 'Hello', options: { beforeBinding: function(vm) { vm.before = vm.message; }, afterBinding: function(vm) { vm.after = vm.message; } }"><span data-bind="text: message"></span></section>`;
    document.body.append(root);

    const results = injectViewModels(root);
    assert.strictEqual(results.length, 1);
    const result = results[0];
    assert.strictEqual(result.view_model, result.viewModel);
    assert.deepStrictEqual(result.view_model, { after: 'Hello', before: 'Hello', message: 'Hello' });
    assert.strictEqual(result.el.querySelector('span')?.textContent, 'Hello');
    assert.deepStrictEqual(injectViewModels(root), []);
    ko.removeNode(root);
  });

  it('propagates expression errors without calling afterBinding', () => {
    const error = new Error('expression failed');
    let afterBindingCalls = 0;
    exposeErrorContract({
      afterBinding: () => afterBindingCalls++,
      evaluate: () => {
        throw error;
      },
    });
    const root = document.createElement('div');
    root.innerHTML = `<section kb-inject="options: { afterBinding: globalThis.${errorContractKey}.afterBinding }, value: globalThis.${errorContractKey}.evaluate()"></section>`;
    document.body.append(root);

    try {
      assert.throws(
        () => injectViewModels(root),
        (thrown) => thrown === error
      );
      assert.strictEqual(afterBindingCalls, 0);
    } finally {
      ko.removeNode(root);
    }
  });

  it('propagates view_model constructor errors without calling afterBinding', () => {
    const error = new Error('constructor failed');
    let afterBindingCalls = 0;
    class ThrowingViewModel {
      constructor() {
        throw error;
      }
    }
    exposeErrorContract({
      ThrowingViewModel,
      afterBinding: () => afterBindingCalls++,
    });
    const root = document.createElement('div');
    root.innerHTML = `<section kb-inject="view_model: globalThis.${errorContractKey}.ThrowingViewModel, options: { afterBinding: globalThis.${errorContractKey}.afterBinding }"></section>`;
    document.body.append(root);

    try {
      assert.throws(
        () => injectViewModels(root),
        (thrown) => thrown === error
      );
      assert.strictEqual(afterBindingCalls, 0);
    } finally {
      ko.removeNode(root);
    }
  });

  it('propagates create errors without calling afterBinding', () => {
    const error = new Error('create failed');
    let afterBindingCalls = 0;
    exposeErrorContract({
      afterBinding: () => afterBindingCalls++,
      create: () => {
        throw error;
      },
    });
    const root = document.createElement('div');
    root.innerHTML = `<section kb-inject="create: globalThis.${errorContractKey}.create, options: { afterBinding: globalThis.${errorContractKey}.afterBinding }"></section>`;
    document.body.append(root);

    try {
      assert.throws(
        () => injectViewModels(root),
        (thrown) => thrown === error
      );
      assert.strictEqual(afterBindingCalls, 0);
    } finally {
      ko.removeNode(root);
    }
  });

  it('registers the public inject binding and applies injected values', () => {
    assert.strictEqual(kb.Inject, Inject);
    assert.strictEqual(kb.injectViewModels, injectViewModels);
    assert.strictEqual(typeof ko.bindingHandlers.inject?.init, 'function');

    const element = document.createElement('div');
    element.setAttribute('data-bind', "inject: { message: 'bound' }");
    element.innerHTML = '<span data-bind="text: message"></span>';
    document.body.append(element);
    const viewModel: Record<string, unknown> = {};
    ko.applyBindings(viewModel, element);
    assert.strictEqual(viewModel.message, 'bound');
    assert.strictEqual(element.querySelector('span')?.textContent, 'bound');
    ko.removeNode(element);
  });
});
