---
title: Localization API
description: Knockback localization API reference
---


## kb.LocaleManager

Manages application locales and translations.

```javascript
const manager = new kb.LocaleManager()
```

### Methods

#### setLocale(locale)

Sets the current locale.

```javascript
kb.locale_manager.setLocale('es');
```

#### getLocale()

Gets the current locale.

```javascript
const locale = kb.locale_manager.getLocale(); // 'en'
```

#### get(key, args)

Gets a localized string.

```javascript
const greeting = kb.locale_manager.get('greeting');
const message = kb.locale_manager.get('welcome', ['Alice']);
```

---

## kb.localizedObservable

Creates an observable that updates when locale changes.

```javascript
kb.localizedObservable(key, args)
```

**Parameters:**
- `key` - Translation key
- `args` - Optional arguments for interpolation

**Example:**
```javascript
const greeting = kb.localizedObservable('greeting');
const itemCount = kb.localizedObservable('items', 5);
```

---

## kb.locale_manager

Global locale manager instance.

```javascript
// Set global manager
kb.locale_manager = new kb.LocaleManager();

// Use throughout app
kb.locale_manager.setLocale('fr');
```

---

## Custom Locale Manager

Extend for custom behavior:

```javascript
const MyLocaleManager = kb.LocaleManager.extend({
  constructor() {
    kb.LocaleManager.prototype.constructor.call(this);
    this.locales = {};
  },

  loadLocale(locale) {
    return fetch(`/locales/${locale}.json`)
      .then(r => r.json())
      .then(data => {
        this.locales[locale] = data;
      });
  }
});
```

---

## Translation Format

### Simple strings

```json
{
  "greeting": "Hello",
  "farewell": "Goodbye"
}
```

### With interpolation

```json
{
  "welcome": "Welcome, {0}!",
  "message": "{0} sent you {1} messages"
}
```

### Pluralization

```json
{
  "items": "{0} item | {0} items",
  "messages": "no messages | {0} message | {0} messages"
}
```
