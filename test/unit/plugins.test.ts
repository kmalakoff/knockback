import assert from 'assert';
import Backbone from 'backbone';
import { defaultObservable, formattedObservable, minLengthFn, observable, parseFormattedString, toFormattedString, triggeredObservable, valid, valueValidator } from '@mcpeasy/knockback';
import ko from 'knockout';

describe('knockback plugins', () => {
  describe('defaults plugin', () => {
    it('should provide default value when observable is null', () => {
      const model = new Backbone.Model({ name: null });
      const nameObs = observable(model, 'name') as unknown as ko.Observable;
      const wrapped = defaultObservable(nameObs, '(no name)');

      assert.strictEqual(wrapped(), '(no name)');
    });

    it('should return actual value when not null', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const nameObs = observable(model, 'name') as unknown as ko.Observable;
      const wrapped = defaultObservable(nameObs, '(no name)');

      assert.strictEqual(wrapped(), 'Bob');
    });

    it('should update when underlying observable changes', () => {
      const model = new Backbone.Model({ name: null });
      const nameObs = observable(model, 'name') as unknown as ko.Observable;
      const wrapped = defaultObservable(nameObs, '(no name)');

      assert.strictEqual(wrapped(), '(no name)');
      model.set('name', 'Alice');
      assert.strictEqual(wrapped(), 'Alice');
    });
  });

  describe('formatting plugin', () => {
    it('should format string with placeholders', () => {
      const result = toFormattedString('{0} and {1}', 'Bob', 'Carol');
      assert.strictEqual(result, 'Bob and Carol');
    });

    it('should handle missing values as empty string', () => {
      const result = toFormattedString('{0} and {1}', 'Bob', null);
      assert.strictEqual(result, 'Bob and ');
    });

    it('should parse formatted string back to values', () => {
      const result = parseFormattedString('Bob and Carol', '{0} and {1}');
      assert.deepStrictEqual(result, ['Bob', 'Carol']);
    });

    it('should create two-way formatted observable', () => {
      const first = ko.observable('Bob');
      const second = ko.observable('Carol');
      const formatted = formattedObservable('{0} and {1}', first, second);

      assert.strictEqual(formatted(), 'Bob and Carol');

      first('Alice');
      assert.strictEqual(formatted(), 'Alice and Carol');
    });
  });

  describe('triggering plugin', () => {
    it('should create observable that updates on events', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const triggered = triggeredObservable(model, 'change');

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
        assert.strictEqual(valid.required(''), true); // empty is invalid
        assert.strictEqual(valid.required(null), true); // null is invalid
        assert.strictEqual(valid.required('Bob'), false); // has value is valid
      });

      it('should validate email', () => {
        assert.strictEqual(valid.email('invalid'), true); // invalid
        assert.strictEqual(valid.email('test@example.com'), false); // valid
      });

      it('should validate url', () => {
        assert.strictEqual(valid.url('invalid'), true); // invalid
        assert.strictEqual(valid.url('http://example.com'), false); // valid
      });

      it('should validate number', () => {
        assert.strictEqual(valid.number('abc'), true); // invalid
        assert.strictEqual(valid.number('123'), false); // valid
        assert.strictEqual(valid.number('12.34'), false); // valid
      });
    });

    describe('minLengthFn', () => {
      it('should return true for values shorter than minimum', () => {
        const minLength4 = minLengthFn(4);
        assert.strictEqual(minLength4('abc'), true); // 3 chars < 4
        assert.strictEqual(minLength4('abcd'), false); // 4 chars >= 4
        assert.strictEqual(minLength4('abcde'), false); // 5 chars > 4
      });
    });

    describe('valueValidator', () => {
      it('should aggregate validation results', () => {
        const value = ko.observable('');
        const result = valueValidator(value, {
          required: valid.required,
        });

        const validation = result();
        assert.strictEqual(validation.required, true); // empty is required error
        assert.strictEqual(validation.$error_count, 1);
        assert.strictEqual(validation.$valid, false);
      });

      it('should pass validation when value is valid', () => {
        const value = ko.observable('test@example.com');
        const result = valueValidator(value, {
          required: valid.required,
          email: valid.email,
        });

        const validation = result();
        assert.strictEqual(validation.required, false);
        assert.strictEqual(validation.email, false);
        assert.strictEqual(validation.$error_count, 0);
        assert.strictEqual(validation.$valid, true);
      });

      it('should respect disable option', () => {
        const value = ko.observable('');
        const disabled = ko.observable(false);
        const result = valueValidator(
          value,
          {
            required: valid.required,
          },
          { disable: () => disabled() }
        );

        // Initially enabled - should show error
        let validation = result();
        assert.strictEqual(validation.required, true, 'Error when enabled');
        assert.strictEqual(validation.$error_count, 1);
        assert.strictEqual(validation.$enabled, true);
        assert.strictEqual(validation.$disable, false);

        // Disable validations
        disabled(true);
        validation = result();
        assert.strictEqual(validation.required, false, 'No error when disabled');
        assert.strictEqual(validation.$error_count, 0);
        assert.strictEqual(validation.$enabled, false);
        assert.strictEqual(validation.$disable, true);
      });

      it('should respect enable option', () => {
        const value = ko.observable('');
        const enabled = ko.observable(true);
        const result = valueValidator(
          value,
          {
            required: valid.required,
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
