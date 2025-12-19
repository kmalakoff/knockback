import assert from 'assert';
import Backbone from 'backbone';
import ko from 'knockout';
import kb, { LocalizedObservable, Statistics } from 'knockback';

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

  // Test localizer class
  class SimpleLocalizer extends LocalizedObservable {
    read(value: string): string {
      const localeManager = kb.locale_manager as MockLocaleManager;
      return localeManager.get(value);
    }
  }

  // Test localizer with write support
  class WriteableLocalizer extends LocalizedObservable {
    read(value: string): string {
      const localeManager = kb.locale_manager as MockLocaleManager;
      return localeManager.get(value);
    }

    write(localizedString: string, value: string): void {
      // For testing: reverse lookup (simplified)
      if (ko.isObservable(this.value)) {
        (this.value as ko.Observable<string>)(value);
      }
    }
  }

  let originalLocaleManager: unknown;

  beforeEach(() => {
    originalLocaleManager = kb.locale_manager;
    kb.locale_manager = new MockLocaleManager();
  });

  afterEach(() => {
    kb.locale_manager = originalLocaleManager;
  });

  describe('basic localized observable', () => {
    it('should create localized observable with custom read', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const obs = new SimpleLocalizer('greeting') as unknown as ko.Observable<string>;

      assert.strictEqual(obs(), 'Hello', 'Returns localized value');

      kb.release(obs);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });

    it('should update when locale changes', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const obs = new SimpleLocalizer('greeting') as unknown as ko.Observable<string>;
      const localeManager = kb.locale_manager as MockLocaleManager;

      assert.strictEqual(obs(), 'Hello', 'English greeting');

      localeManager.setLocale('es');
      assert.strictEqual(obs(), 'Hola', 'Spanish greeting after locale change');

      localeManager.setLocale('fr');
      assert.strictEqual(obs(), 'Bonjour', 'French greeting after locale change');

      kb.release(obs);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });
  });

  describe('observedValue', () => {
    it('should get and set observed value', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const obs = new SimpleLocalizer('greeting') as unknown as ko.Observable<string> & {
        observedValue: (value?: string) => string;
      };

      assert.strictEqual(obs(), 'Hello');
      assert.strictEqual(obs.observedValue(), 'greeting', 'Get observed value');

      obs.observedValue('farewell');
      assert.strictEqual(obs(), 'Goodbye', 'Updated after observedValue change');

      kb.release(obs);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });
  });

  describe('onChange callback', () => {
    it('should call onChange when locale changes', () => {
      const stats = new Statistics();
      (kb as unknown as { statistics: Statistics }).statistics = stats;

      const changes: string[] = [];
      const obs = new SimpleLocalizer('greeting', {
        onChange: (value: unknown) => changes.push(value as string),
      }) as unknown as ko.Observable<string>;

      const localeManager = kb.locale_manager as MockLocaleManager;

      assert.strictEqual(obs(), 'Hello');
      assert.strictEqual(changes.length, 0, 'No changes yet');

      localeManager.setLocale('es');
      assert.strictEqual(changes.length, 1, 'onChange called');
      assert.strictEqual(changes[0], 'Hola', 'Received new value');

      kb.release(obs);
      assert.strictEqual(stats.registeredStatsString('all released'), 'all released');
      (kb as unknown as { statistics: undefined }).statistics = undefined;
    });
  });
});
