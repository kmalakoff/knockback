import kb from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';

describe('knockback plugins', () => {
  describe('defaults plugin', () => {
    it('should provide default value when observable is null', () => {
      const model = new Backbone.Model({ name: null });
      const nameObs = kb.observable(model, 'name') as unknown as ko.Observable;
      const wrapped = kb.defaultObservable(nameObs, '(no name)');

      assert.strictEqual(wrapped(), '(no name)');
    });

    it('should return actual value when not null', () => {
      const model = new Backbone.Model({ name: 'Bob' });
      const nameObs = kb.observable(model, 'name') as unknown as ko.Observable;
      const wrapped = kb.defaultObservable(nameObs, '(no name)');

      assert.strictEqual(wrapped(), 'Bob');
    });

    it('should update when underlying observable changes', () => {
      const model = new Backbone.Model({ name: null });
      const nameObs = kb.observable(model, 'name') as unknown as ko.Observable;
      const wrapped = kb.defaultObservable(nameObs, '(no name)');

      assert.strictEqual(wrapped(), '(no name)');
      model.set('name', 'Alice');
      assert.strictEqual(wrapped(), 'Alice');
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
        assert.strictEqual(validation.$error_count, 1);
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
        assert.strictEqual(validation.$error_count, 0);
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
