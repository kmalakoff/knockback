import kb from '@mcpeasy/knockback';
import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';

describe('Localization plugin', () => {
  // Mock locale manager
  class MockLocaleManager extends Backbone.Model {
    locale: string;

    constructor() {
      super();
      this.locale = 'en';
    }

    getLocale(): string {
      return this.locale;
    }

    setLocale(locale: string): void {
      this.locale = locale;
      this.trigger('change', this);
    }

    get(key: string): string {
      const translations: Record<string, Record<string, string>> = {
        en: { greeting: 'Hello', farewell: 'Goodbye' },
        es: { greeting: 'Hola', farewell: 'Adiós' },
        fr: { greeting: 'Bonjour', farewell: 'Au revoir' },
      };
      return translations[this.locale]?.[key] || key;
    }
  }

  let originalLocaleManager: unknown;

  beforeEach(() => {
    originalLocaleManager = kb.getLocaleManager();
    kb.setLocaleManager(new MockLocaleManager() as ReturnType<typeof kb.getLocaleManager>);
  });

  afterEach(() => {
    kb.setLocaleManager(originalLocaleManager as ReturnType<typeof kb.getLocaleManager>);
  });

  describe('basic localized observable', () => {
    it('should create localized observable with custom read', () => {
      const obs = kb.localizedObservable('greeting', {
        read: (value: unknown) => {
          const localeManager = kb.getLocaleManager() as MockLocaleManager;
          return localeManager.get(value as string);
        },
      });

      assert.strictEqual(obs(), 'Hello', 'Returns localized value');

      kb.release(obs);
    });

    it('should update when locale changes', () => {
      const obs = kb.localizedObservable('greeting', {
        read: (value: unknown) => {
          const localeManager = kb.getLocaleManager() as MockLocaleManager;
          return localeManager.get(value as string);
        },
      });
      const localeManager = kb.getLocaleManager() as MockLocaleManager;

      assert.strictEqual(obs(), 'Hello', 'English greeting');

      localeManager.setLocale('es');
      assert.strictEqual(obs(), 'Hola', 'Spanish greeting after locale change');

      localeManager.setLocale('fr');
      assert.strictEqual(obs(), 'Bonjour', 'French greeting after locale change');

      kb.release(obs);
    });
  });

  describe('observedValue', () => {
    it('should get and set observed value', () => {
      const obs = kb.localizedObservable('greeting', {
        read: (value: unknown) => {
          const localeManager = kb.getLocaleManager() as MockLocaleManager;
          return localeManager.get(value as string);
        },
      });

      assert.strictEqual(obs(), 'Hello');
      assert.strictEqual(obs.observedValue(), 'greeting', 'Get observed value');

      obs.observedValue('farewell');
      assert.strictEqual(obs(), 'Goodbye', 'Updated after observedValue change');

      kb.release(obs);
    });
  });

  describe('onChange callback', () => {
    it('should call onChange when locale changes', () => {
      const changes: string[] = [];
      const obs = kb.localizedObservable('greeting', {
        read: (value: unknown) => {
          const localeManager = kb.getLocaleManager() as MockLocaleManager;
          return localeManager.get(value as string);
        },
        onChange: (value: unknown) => changes.push(value as string),
      });

      const localeManager = kb.getLocaleManager() as MockLocaleManager;

      assert.strictEqual(obs(), 'Hello');
      assert.strictEqual(changes.length, 0, 'No changes yet');

      localeManager.setLocale('es');
      assert.strictEqual(changes.length, 1, 'onChange called');
      assert.strictEqual(changes[0], 'Hola', 'Received new value');

      kb.release(obs);
    });
  });

  describe('with write support', () => {
    it('should support write function', () => {
      const valueStore = ko.observable('greeting');

      const obs = kb.localizedObservable(valueStore, {
        read: (value: unknown) => {
          const localeManager = kb.getLocaleManager() as MockLocaleManager;
          return localeManager.get(value as string);
        },
        write: (_localizedString: unknown, _value: unknown) => {
          // For testing: just update the underlying observable
          valueStore('farewell');
        },
      });

      assert.strictEqual(obs(), 'Hello', 'Initial value');

      // Write to the observable
      obs('test');
      assert.strictEqual(obs(), 'Goodbye', 'Value changed after write');

      kb.release(obs);
    });
  });
});
