---
title: Localization
description: Internationalization with Knockback
---


Knockback provides built-in support for internationalization (i18n).

## Locale Manager

Create a locale manager with your translations:

```javascript
const LocaleManager = kb.LocaleManager.extend({
  constructor() {
    kb.LocaleManager.prototype.constructor.call(this);

    this.locales = {
      'en': {
        greeting: 'Hello',
        farewell: 'Goodbye',
        items: '{0} item | {0} items'
      },
      'es': {
        greeting: 'Hola',
        farewell: 'Adiós',
        items: '{0} artículo | {0} artículos'
      },
      'fr': {
        greeting: 'Bonjour',
        farewell: 'Au revoir',
        items: '{0} article | {0} articles'
      }
    };
  }
});

const localeManager = new LocaleManager();
kb.locale_manager = localeManager;
```

## Localized Observables

Create observables that update when locale changes:

```javascript
const viewModel = {
  greeting: kb.localizedObservable('greeting'),
  farewell: kb.localizedObservable('farewell')
};

ko.applyBindings(viewModel);

// Change locale - views update automatically!
localeManager.setLocale('es');
```

```html
<p data-bind="text: greeting"></p>
<p data-bind="text: farewell"></p>
```

## Changing Locale

```javascript
// Get current locale
console.log(localeManager.getLocale()); // 'en'

// Change locale
localeManager.setLocale('fr');

// All localized observables update automatically!
```

## Locale Selector

```html
<select data-bind="value: currentLocale">
  <option value="en">English</option>
  <option value="es">Español</option>
  <option value="fr">Français</option>
</select>
```

```javascript
const viewModel = {
  currentLocale: ko.observable('en'),
  greeting: kb.localizedObservable('greeting')
};

viewModel.currentLocale.subscribe((locale) => {
  kb.locale_manager.setLocale(locale);
});

ko.applyBindings(viewModel);
```

## Pluralization

Handle singular/plural forms:

```javascript
const locales = {
  'en': {
    items: '{0} item | {0} items'
  }
};

const itemCount = kb.localizedObservable('items', 5);
// => "5 items"

itemCount(1);
// => "1 item"
```

## With Parameters

```javascript
const locales = {
  'en': {
    welcome: 'Welcome, {0}!'
  }
};

const welcomeMessage = kb.localizedObservable('welcome', ['Alice']);
// => "Welcome, Alice!"
```

## Best Practices

1. **Organize translations** - Keep locale files separate
2. **Use keys, not text** - `'greeting'` not `'Hello'`
3. **Handle missing translations** - Provide fallbacks
4. **Test all locales** - Ensure no missing keys

## Loading Translations

```javascript
// Load from JSON files
async function loadLocale(locale) {
  const response = await fetch(`/locales/${locale}.json`);
  const translations = await response.json();
  localeManager.locales[locale] = translations;
}
```
