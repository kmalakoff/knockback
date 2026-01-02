import kb from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';

describe('observable advanced', () => {
  describe('custom read and write', () => {
    it('should support custom read function', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const model = new Backbone.Model({ name: 'Ringo', number: '555-555-5556' });

      const nameObs = kb.observable(model, {
        key: 'name',
        read: () => `First: ${model.get('name')}`,
      });

      assert.strictEqual(nameObs(), 'First: Ringo', 'Custom read applied');

      model.set('name', 'Starr');
      assert.strictEqual(nameObs(), 'First: Starr', 'Custom read updates with model');

      nameObs.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });

    it('should support custom read and write functions', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const model = new Backbone.Model({ number: '555-555-5556' });

      const numberObs = kb.observable(model, {
        key: 'number',
        read: () => `#: ${model.get('number')}`,
        write: (value: string) => model.set({ number: value.substring(3) }),
      });

      assert.strictEqual(numberObs(), '#: 555-555-5556', 'Custom read applied');

      numberObs('#: 9222-222-222');
      assert.strictEqual(model.get('number'), '9222-222-222', 'Custom write applied');
      assert.strictEqual(numberObs(), '#: 9222-222-222', 'Read reflects write');

      numberObs.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('ko.computed integration', () => {
    it('should work as source for ko.computed', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const model = new Backbone.Model({ name: 'Ringo' });
      const nameObs = kb.observable(model, 'name');

      const formattedName = ko.computed({
        read: nameObs,
        write: (value: string) => nameObs(value.trim()),
      });

      assert.strictEqual(nameObs(), 'Ringo');
      assert.strictEqual(formattedName(), 'Ringo');

      formattedName(' John ');
      assert.strictEqual(nameObs(), 'John', 'Write trimmed value');
      assert.strictEqual(formattedName(), 'John');

      nameObs.dispose();
      formattedName.dispose();

      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('model observable', () => {
    it('should make model changes observable via .model()', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const model = new Backbone.Model({ id: 1, name: 'Bob' });
      const obs = kb.observable<string>(model, 'name');

      let count = 0;
      ko.computed(() => {
        obs.model();
        count++;
      });

      assert.strictEqual(count, 1, 'Initial evaluation');

      obs.model(null);
      assert.strictEqual(count, 2, 'Model set to null');

      obs.model(model);
      assert.strictEqual(count, 3, 'Model restored');

      obs.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('dependency tracking', () => {
    it('should not create dependencies when writing inside ko.computed', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const model = new Backbone.Model({ id: 1, name: 'Initial' });
      const obs = kb.observable(model, 'name');

      let countManual = 0;
      ko.computed(() => {
        obs('Manual'); // Writing should not create dependency
        countManual++;
      });

      let observableCount = 0;
      ko.computed(() => {
        obs(); // Reading should create dependency
        observableCount++;
      });

      assert.strictEqual(countManual, 1, 'Manual write computed ran once');
      assert.strictEqual(observableCount, 1, 'Observable read computed ran once');

      obs('Update');
      assert.strictEqual(countManual, 1, 'Manual write computed did not re-run');
      assert.strictEqual(observableCount, 2, 'Observable read computed re-ran');

      obs.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('this binding', () => {
    it('should bind this correctly in read/write callbacks', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const model = new Backbone.Model({ number: 33 });

      class TestViewModel {
        // biome-ignore lint/suspicious/noExplicitAny: Test class with dynamic properties
        [key: string]: any;
        number: kb.Observable<number>;
        formatted_number: kb.Observable<string>;

        constructor(m: Backbone.Model) {
          this.number = kb.observable<number>(m, 'number');
          this.formatted_number = kb.observable<string>(
            m,
            {
              key: 'number',
              read: () => `#: ${this.number()}`,
              write: (value: string) => this.number(parseInt(value.substring(3), 10)),
            },
            {},
            this
          );
        }
      }

      const vm = new TestViewModel(model);
      assert.strictEqual(vm.formatted_number(), `#: ${vm.number()}`);

      vm.formatted_number('#: 42');
      assert.strictEqual(vm.number(), 42);

      kb.dispose(vm);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('model swapping', () => {
    it('should stop updating from old model after swap', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const values: string[] = [];
      const m1 = new Backbone.Model({ n: 'm1' });
      const m2 = new Backbone.Model({ n: 'm2' });

      const obs = kb.observable<string>(m1, 'n');

      obs.subscribe((nv: string) => values.push(nv));

      m1.set({ n: 'm1_2' });
      assert.deepStrictEqual(values, ['m1_2'], 'Received m1 update');

      obs.model(m2);
      assert.deepStrictEqual(values, ['m1_2', 'm2'], 'Received m2 value on swap');

      m1.set({ n: 'm1_3' });
      assert.deepStrictEqual(values, ['m1_2', 'm2'], 'No update from old model');

      m2.set({ n: 'm2_2' });
      assert.deepStrictEqual(values, ['m1_2', 'm2', 'm2_2'], 'Received m2 update');

      m1.set({ n: 'm1_4' });
      assert.deepStrictEqual(values, ['m1_2', 'm2', 'm2_2'], 'Still no update from old model');

      obs.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });

  describe('read args', () => {
    it('should pass args to read function', () => {
      const stats = new kb.Statistics();
      kb.setStatistics(stats);

      const receivedArgs: unknown[] = [];
      const model = new Backbone.Model({ name: 'Ringo' });

      const obs = kb.observable(model, {
        key: 'name',
        read: (_key: string, arg1: string, arg2: number) => {
          receivedArgs.push(arg1, arg2);
          return model.get('name');
        },
        args: ['name', 1],
      });

      // Force evaluation
      obs();

      assert.ok(receivedArgs.includes('name'), 'Received string arg');
      assert.ok(receivedArgs.includes(1), 'Received number arg');

      obs.dispose();
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      kb.setStatistics(null);
    });
  });
});
