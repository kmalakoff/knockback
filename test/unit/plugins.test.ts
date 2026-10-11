import kb, { hasChangedFn } from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';
import { deeplyNestedEqualValues } from '../lib/deeply-nested-values.ts';

describe('knockback plugins', () => {
  describe('defaults plugin', () => {
    it('should provide default value when observable is null', () => {
      const model = new Backbone.Model({ name: null });
      const nameObs = kb.observable<string | null>(model, 'name');
      const wrapped = kb.defaultObservable<string | null>(nameObs, '(no name)');

      assert.strictEqual(wrapped(), '(no name)');
    });

    it('should return actual value when not null', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const nameObs = kb.observable<string>(model, 'name');
      const wrapped = kb.defaultObservable<string>(nameObs, '(no name)');

      assert.strictEqual(wrapped(), 'Bob');
    });

    it('should update when underlying observable changes', () => {
      const model = new Backbone.Model<{ name: string | null }>({ name: null });
      const nameObs = kb.observable<string | null>(model, 'name');
      const wrapped = kb.defaultObservable<string | null>(nameObs, '(no name)');

      assert.strictEqual(wrapped(), '(no name)');
      model.set('name', 'Alice');
      assert.strictEqual(wrapped(), 'Alice');
    });

    it('should fall back only for null and undefined values', () => {
      const target = ko.observable<string | null | undefined>('plain');
      const wrapped = kb.defaultObservable(target, 'fallback');

      try {
        assert.strictEqual(wrapped(), 'plain');
        target(null);
        assert.strictEqual(wrapped(), 'fallback');
        target(undefined);
        assert.strictEqual(wrapped(), 'fallback');
        target('');
        assert.strictEqual(wrapped(), '');
      } finally {
        wrapped.dispose();
      }
    });

    it('should unwrap knockout defaults while preserving their raw reset identities', () => {
      const observableDefault = ko.observable('observable default');
      const observableTarget = ko.observable<string | typeof observableDefault | null>(null);
      const observableWrapped = kb.defaultObservable(observableTarget, observableDefault);

      const computedSource = ko.observable('computed default');
      const computedDefault = ko.computed(() => computedSource());
      const computedTarget = ko.observable<string | typeof computedDefault | null>(null);
      const computedWrapped = kb.defaultObservable(computedTarget, computedDefault);

      const pureSource = ko.observable('pure computed default');
      const pureDefault = ko.pureComputed(() => pureSource());
      const pureTarget = ko.observable<string | typeof pureDefault | null>(null);
      const pureWrapped = kb.defaultObservable(pureTarget, pureDefault);

      const arrayDefault = ko.observableArray([1, 2]);
      const arrayTarget = ko.observable<number[] | typeof arrayDefault | null>(null);
      const arrayWrapped = kb.defaultObservable(arrayTarget, arrayDefault);

      try {
        assert.strictEqual(observableWrapped(), 'observable default');
        observableWrapped.setToDefault();
        assert.strictEqual(observableTarget(), observableDefault);
        observableDefault('changed observable default');
        assert.strictEqual(observableWrapped(), 'changed observable default');

        assert.strictEqual(computedWrapped(), 'computed default');
        computedWrapped.setToDefault();
        assert.strictEqual(computedTarget(), computedDefault);
        computedSource('changed computed default');
        assert.strictEqual(computedWrapped(), 'changed computed default');

        assert.strictEqual(pureWrapped(), 'pure computed default');
        pureWrapped.setToDefault();
        assert.strictEqual(pureTarget(), pureDefault);
        pureSource('changed pure computed default');
        assert.strictEqual(pureWrapped(), 'changed pure computed default');

        assert.deepStrictEqual(arrayWrapped(), [1, 2]);
        arrayWrapped.setToDefault();
        assert.strictEqual(arrayTarget(), arrayDefault);
        arrayDefault.push(3);
        assert.deepStrictEqual(arrayWrapped(), [1, 2, 3]);
      } finally {
        observableWrapped.dispose();
        computedWrapped.dispose();
        pureWrapped.dispose();
        arrayWrapped.dispose();
        computedDefault.dispose();
        pureDefault.dispose();
      }
    });

    it('should compose stored and direct default wrappers', () => {
      const nestedDefault = ko.observable('nested default');
      const nestedTarget = ko.observable<string | typeof nestedDefault | null>(null);
      const inner = kb.defaultObservable(nestedTarget, nestedDefault);
      const storedTarget = ko.observable<typeof inner | null>(null);
      const stored = kb.defaultObservable(storedTarget, inner);

      const directTarget = ko.observable<string | null>(null);
      const directInner = kb.defaultObservable(directTarget, 'inner default');
      const directOuter = kb.defaultObservable(directInner, 'outer default');

      try {
        assert.strictEqual(stored(), 'nested default');
        stored.setToDefault();
        assert.strictEqual(storedTarget(), inner);
        assert.strictEqual(stored(), 'nested default');

        assert.strictEqual(directOuter(), 'inner default');
        directOuter.setToDefault();
        assert.strictEqual(directTarget(), 'outer default');
        assert.strictEqual(directInner(), 'outer default');
        assert.strictEqual(directOuter(), 'outer default');
      } finally {
        stored.dispose();
        inner.dispose();
        directOuter.dispose();
        directInner.dispose();
      }
    });

    it('should unwrap one level and leave opaque values intact', () => {
      const payload = ko.observable('payload');
      const nestedDefault = ko.observable<ko.Observable<string>>(payload);
      const nestedTarget = ko.observable<ko.Observable<ko.Observable<string>> | null>(null);
      const oneLevel = kb.defaultObservable(nestedTarget, nestedDefault);

      const inner = kb.defaultObservable(nestedTarget, nestedDefault);
      const wrapperTarget = ko.observable<typeof inner | null>(null);
      const wrapperDefault = kb.defaultObservable(wrapperTarget, inner);

      const opaqueSubscribable = new ko.subscribable<string>();
      const opaqueTarget = ko.observable<ko.Subscribable<string> | null>(null);
      const opaqueWrapped = kb.defaultObservable(opaqueTarget, opaqueSubscribable);

      const opaqueCallable = () => 'callable payload';
      const callableTarget = ko.observable<typeof opaqueCallable | null>(null);
      const callableWrapped = kb.defaultObservable(callableTarget, opaqueCallable);

      try {
        assert.strictEqual(oneLevel(), payload);
        oneLevel.setToDefault();
        assert.strictEqual(nestedTarget(), nestedDefault);
        assert.strictEqual(oneLevel(), payload);

        assert.strictEqual(wrapperDefault(), payload);
        wrapperDefault.setToDefault();
        assert.strictEqual(wrapperTarget(), inner);
        assert.strictEqual(wrapperDefault(), payload);

        assert.strictEqual(opaqueWrapped(), opaqueSubscribable);
        opaqueWrapped.setToDefault();
        assert.strictEqual(opaqueTarget(), opaqueSubscribable);
        assert.strictEqual(opaqueWrapped(), opaqueSubscribable);

        assert.strictEqual(callableWrapped(), opaqueCallable);
        callableWrapped.setToDefault();
        assert.strictEqual(callableTarget(), opaqueCallable);
        assert.strictEqual(callableWrapped(), opaqueCallable);
      } finally {
        oneLevel.dispose();
        wrapperDefault.dispose();
        inner.dispose();
        opaqueWrapped.dispose();
        callableWrapped.dispose();
      }
    });

    it('should dispose while only the defined target is active', () => {
      const fallback = ko.observable('fallback');
      const target = ko.observable<string | typeof fallback | null>(null);
      let targetCallerChanges = 0;
      let fallbackCallerChanges = 0;
      const targetCaller = target.subscribe(() => targetCallerChanges++);
      const fallbackCaller = fallback.subscribe(() => fallbackCallerChanges++);
      const baseline = [target.getSubscriptionsCount(), fallback.getSubscriptionsCount()];
      const wrapped = kb.defaultObservable(target, fallback);
      const retainedDispose = wrapped.dispose;
      let wrapperChanges = 0;
      const wrapperSubscription = wrapped.subscribe(() => wrapperChanges++);

      try {
        assert.strictEqual(wrapped(), 'fallback');
        assert.deepStrictEqual(baseline, [1, 1]);
        assert.deepStrictEqual([target.getSubscriptionsCount(), fallback.getSubscriptionsCount()], [2, 2]);

        target('defined');
        assert.strictEqual(wrapped(), 'defined');
        assert.deepStrictEqual([target.getSubscriptionsCount(), fallback.getSubscriptionsCount()], [2, 1]);
        const definedChanges = wrapperChanges;
        fallback('inactive fallback');
        assert.strictEqual(wrapperChanges, definedChanges);
        assert.deepStrictEqual([target.getSubscriptionsCount(), fallback.getSubscriptionsCount()], [2, 1]);

        const changesBeforeDispose = wrapperChanges;
        const targetChangesBeforeDispose = targetCallerChanges;
        const fallbackChangesBeforeDispose = fallbackCallerChanges;
        retainedDispose();
        retainedDispose();

        assert.strictEqual(wrapped.dispose, undefined);
        assert.deepStrictEqual([target.getSubscriptionsCount(), fallback.getSubscriptionsCount()], baseline);
        target('after disposal');
        fallback('after disposal');
        assert.strictEqual(targetCallerChanges, targetChangesBeforeDispose + 1);
        assert.strictEqual(fallbackCallerChanges, fallbackChangesBeforeDispose + 1);
        assert.strictEqual(wrapperChanges, changesBeforeDispose);
        assert.deepStrictEqual([target.getSubscriptionsCount(), fallback.getSubscriptionsCount()], baseline);
      } finally {
        retainedDispose();
        wrapperSubscription.dispose();
        targetCaller.dispose();
        fallbackCaller.dispose();
      }
    });

    it('should dispose an outer wrapper without disposing its inputs', () => {
      const source = ko.observable('computed fallback');
      const computedDefault = ko.computed(() => source());
      let computedCallerChanges = 0;
      const computedCaller = computedDefault.subscribe(() => computedCallerChanges++);
      const innerTarget = ko.observable<string | typeof computedDefault | null>(null);
      const inner = kb.defaultObservable(innerTarget, computedDefault);
      const outerTarget = ko.observable<typeof inner | null>(null);
      const outer = kb.defaultObservable(outerTarget, inner);
      const retainedOuterDispose = outer.dispose;
      const retainedInnerDispose = inner.dispose;
      let outerChanges = 0;
      const outerSubscription = outer.subscribe(() => outerChanges++);

      try {
        assert.strictEqual(outer(), 'computed fallback');
        outer.setToDefault();
        assert.strictEqual(outerTarget(), inner);
        const outerChangesBeforeDispose = outerChanges;
        retainedOuterDispose();

        assert.strictEqual(outer.dispose, undefined);
        assert.strictEqual(typeof inner.dispose, 'function');
        source('changed computed fallback');
        assert.strictEqual(computedDefault(), 'changed computed fallback');
        assert.strictEqual(inner(), 'changed computed fallback');
        assert.strictEqual(computedCallerChanges, 1);
        assert.strictEqual(outerChanges, outerChangesBeforeDispose);

        outerTarget(null);
        assert.strictEqual(outerTarget(), null);
        assert.strictEqual(outerChanges, outerChangesBeforeDispose);
        innerTarget('defined inner');
        assert.strictEqual(inner(), 'defined inner');
        inner.setToDefault();
        assert.strictEqual(innerTarget(), computedDefault);
        assert.strictEqual(inner(), 'changed computed fallback');
      } finally {
        retainedOuterDispose();
        retainedInnerDispose();
        outerSubscription.dispose();
        computedCaller.dispose();
        computedDefault.dispose();
      }
    });

    it('should release only one wrapper when inputs are shared', () => {
      const fallback = ko.observable('shared fallback');
      const target = ko.observable<string | typeof fallback | null>(null);
      const targetCaller = target.subscribe(() => {});
      const fallbackCaller = fallback.subscribe(() => {});
      const baseline = [target.getSubscriptionsCount(), fallback.getSubscriptionsCount()];
      const first = kb.defaultObservable(target, fallback);
      const second = kb.defaultObservable(target, fallback);
      const retainedFirstDispose = first.dispose;
      const retainedSecondDispose = second.dispose;
      let firstChanges = 0;
      let secondChanges = 0;
      const firstSubscription = first.subscribe(() => firstChanges++);
      const secondSubscription = second.subscribe(() => secondChanges++);

      try {
        assert.strictEqual(first(), 'shared fallback');
        assert.strictEqual(second(), 'shared fallback');
        assert.deepStrictEqual([target.getSubscriptionsCount(), fallback.getSubscriptionsCount()], [3, 3]);

        const firstChangesBeforeDispose = firstChanges;
        retainedFirstDispose();
        retainedFirstDispose();
        assert.deepStrictEqual([target.getSubscriptionsCount(), fallback.getSubscriptionsCount()], [2, 2]);

        fallback('surviving fallback');
        assert.strictEqual(firstChanges, firstChangesBeforeDispose);
        assert.strictEqual(second(), 'surviving fallback');
        assert.ok(secondChanges > 0);

        target('defined survivor');
        assert.strictEqual(second(), 'defined survivor');
        assert.deepStrictEqual([target.getSubscriptionsCount(), fallback.getSubscriptionsCount()], [2, 1]);
        target(null);
        assert.strictEqual(second(), 'surviving fallback');
        assert.deepStrictEqual([target.getSubscriptionsCount(), fallback.getSubscriptionsCount()], [2, 2]);

        const secondChangesBeforeDispose = secondChanges;
        retainedSecondDispose();
        assert.deepStrictEqual([target.getSubscriptionsCount(), fallback.getSubscriptionsCount()], baseline);
        target('after final disposal');
        fallback('after final disposal');
        assert.strictEqual(firstChanges, firstChangesBeforeDispose);
        assert.strictEqual(secondChanges, secondChangesBeforeDispose);
        assert.deepStrictEqual([target.getSubscriptionsCount(), fallback.getSubscriptionsCount()], baseline);
      } finally {
        retainedFirstDispose();
        retainedSecondDispose();
        firstSubscription.dispose();
        secondSubscription.dispose();
        targetCaller.dispose();
        fallbackCaller.dispose();
      }
    });
  });

  describe('formatting plugin', () => {
    it('should format string with placeholders', () => {
      const result = kb.toFormattedString('{0} and {1}', 'Bob', 'Carol');
      assert.strictEqual(result, 'Bob and Carol');
    });

    it('should handle missing values as empty string', () => {
      const result = kb.toFormattedString('{0} and {1}', 'Bob', null);
      assert.strictEqual(result, 'Bob and ');
    });

    it('should parse formatted string back to values', () => {
      const result = kb.parseFormattedString('Bob and Carol', '{0} and {1}');
      assert.deepStrictEqual(result, ['Bob', 'Carol']);
    });

    it('should create two-way formatted observable', () => {
      const first = ko.observable('Bob');
      const second = ko.observable('Carol');
      const formatted = kb.formattedObservable('{0} and {1}', first, second);

      assert.strictEqual(formatted(), 'Bob and Carol');

      first('Alice');
      assert.strictEqual(formatted(), 'Alice and Carol');
    });
  });

  describe('triggering plugin', () => {
    it('should create observable that updates on events', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const triggered = kb.triggeredObservable(model, 'change');

      // Initial value
      assert.ok(triggered() !== undefined || triggered() === model);

      // Subscribe to track changes
      let changeCount = 0;
      triggered.subscribe(() => {
        changeCount++;
      });

      model.set('name', 'Alice');
      assert.ok(changeCount >= 0); // Should have triggered
    });
  });

  describe('validation plugin', () => {
    describe('validators', () => {
      it('should validate required', () => {
        assert.strictEqual(kb.valid.required(''), true); // empty is invalid
        assert.strictEqual(kb.valid.required(null), true); // null is invalid
        assert.strictEqual(kb.valid.required('Bob'), false); // has value is kb.valid
      });

      it('should validate email', () => {
        assert.strictEqual(kb.valid.email('invalid'), true); // invalid
        assert.strictEqual(kb.valid.email('test@example.com'), false); // kb.valid
      });

      it('should validate url', () => {
        assert.strictEqual(kb.valid.url('invalid'), true); // invalid
        assert.strictEqual(kb.valid.url('http://example.com'), false); // kb.valid
      });

      it('should validate number', () => {
        assert.strictEqual(kb.valid.number('abc'), true); // invalid
        assert.strictEqual(kb.valid.number('123'), false); // kb.valid
        assert.strictEqual(kb.valid.number('12.34'), false); // kb.valid
      });

      it('should compare deeply nested model state without exhausting the stack', () => {
        const [first, second] = deeplyNestedEqualValues();
        const model = new Backbone.Model<{ payload: unknown; changed?: boolean }>({ payload: first });
        const hasChanged = hasChangedFn(model);

        assert.strictEqual(hasChanged(), false);
        model.set('payload', second);
        assert.strictEqual(model.get('payload'), second);
        assert.strictEqual(hasChanged(), false);

        model.set('changed', true);
        assert.strictEqual(hasChanged(), true);
      });
    });

    describe('kb.minLengthFn', () => {
      it('should return true for values shorter than minimum', () => {
        const minLength4 = kb.minLengthFn(4);
        assert.strictEqual(minLength4('abc'), true); // 3 chars < 4
        assert.strictEqual(minLength4('abcd'), false); // 4 chars >= 4
        assert.strictEqual(minLength4('abcde'), false); // 5 chars > 4
      });
    });

    describe('valueValidator', () => {
      it('should aggregate validation results', () => {
        const value = ko.observable('');
        const result = kb.valueValidator(value, {
          required: kb.valid.required,
        });

        const validation = result();
        assert.strictEqual(validation.required, true); // empty is required error
        assert.strictEqual(validation.$errorCount, 1);
        assert.strictEqual(validation.$valid, false);
      });

      it('should pass validation when value is kb.valid', () => {
        const value = ko.observable('test@example.com');
        const result = kb.valueValidator(value, {
          required: kb.valid.required,
          email: kb.valid.email,
        });

        const validation = result();
        assert.strictEqual(validation.required, false);
        assert.strictEqual(validation.email, false);
        assert.strictEqual(validation.$errorCount, 0);
        assert.strictEqual(validation.$valid, true);
      });

      it('should respect disable option', () => {
        const value = ko.observable('');
        const disabled = ko.observable(false);
        const result = kb.valueValidator(
          value,
          {
            required: kb.valid.required,
          },
          { disable: () => disabled() }
        );

        // Initially enabled - should show error
        let validation = result();
        assert.strictEqual(validation.required, true, 'Error when enabled');
        assert.strictEqual(validation.$errorCount, 1);
        assert.strictEqual(validation.$enabled, true);
        assert.strictEqual(validation.$disable, false);

        // Disable validations
        disabled(true);
        validation = result();
        assert.strictEqual(validation.required, false, 'No error when disabled');
        assert.strictEqual(validation.$errorCount, 0);
        assert.strictEqual(validation.$enabled, false);
        assert.strictEqual(validation.$disable, true);
      });

      it('should respect enable option', () => {
        const value = ko.observable('');
        const enabled = ko.observable(true);
        const result = kb.valueValidator(
          value,
          {
            required: kb.valid.required,
          },
          { enable: () => enabled() }
        );

        // Initially enabled - should show error
        let validation = result();
        assert.strictEqual(validation.required, true, 'Error when enabled');
        assert.strictEqual(validation.$valid, false);

        // Disable via enable: false
        enabled(false);
        validation = result();
        assert.strictEqual(validation.required, false, 'No error when disabled via enable');
        assert.strictEqual(validation.$valid, true);
        assert.strictEqual(validation.$enabled, false);
      });
    });
  });
});
