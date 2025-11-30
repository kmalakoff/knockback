---
title: Core API
description: Knockback core API reference
---


## kb.observable

Creates a Knockout observable from a Backbone model attribute.

```javascript
kb.observable(model, key_or_options)
```

**Parameters:**
- `model` - Backbone.Model instance
- `key_or_options` - String key or options object

**Options:**
| Option | Type | Description |
|--------|------|-------------|
| `key` | string | Model attribute name |
| `read` | function | Custom read function |
| `write` | function | Custom write function |
| `default` | any | Default value |

**Example:**
```javascript
const name = kb.observable(model, 'name');
const formatted = kb.observable(model, {
  key: 'price',
  read: () => '$' + model.get('price')
});
```

---

## kb.viewModel

Creates a ViewModel with observables for model attributes.

```javascript
kb.viewModel(model, options)
```

**Options:**
| Option | Type | Description |
|--------|------|-------------|
| `keys` | array | Attributes to include |
| `excludes` | array | Attributes to exclude |
| `internals` | array | Internal attrs (id, cid) |
| `factories` | object | Custom factories for nested |

**Example:**
```javascript
const vm = kb.viewModel(model);
const vm = kb.viewModel(model, { keys: ['name', 'email'] });
```

---

## kb.collectionObservable

Creates an observable array from a Backbone Collection.

```javascript
kb.collectionObservable(collection, options)
```

**Options:**
| Option | Type | Description |
|--------|------|-------------|
| `view_model` | class | ViewModel for items |
| `sort_attribute` | string | Sort by attribute |
| `comparator` | function | Custom comparator |
| `filters` | function/array | Filter items |

**Example:**
```javascript
const items = kb.collectionObservable(collection);
const sorted = kb.collectionObservable(collection, {
  sort_attribute: 'name'
});
```

---

## kb.release

Releases a ViewModel and cleans up subscriptions.

```javascript
kb.release(viewmodel)
```

**Example:**
```javascript
const vm = kb.viewModel(model);
// When done
kb.release(vm);
```

---

## kb.releaseOnNodeRemove

Automatically releases when DOM node is removed.

```javascript
kb.releaseOnNodeRemove(viewmodel, node)
```

**Example:**
```javascript
kb.releaseOnNodeRemove(vm, document.getElementById('my-view'));
```

---

## kb.ViewModel

Base class for custom ViewModels.

```javascript
kb.ViewModel.extend(properties)
```

**Example:**
```javascript
const PersonVM = kb.ViewModel.extend({
  constructor(model) {
    kb.ViewModel.prototype.constructor.call(this, model);
    this.fullName = ko.computed(() =>
      this.firstName() + ' ' + this.lastName()
    );
  }
});
```

---

## kb.utils

Utility functions.

### kb.utils.wrappedModel

Gets the Backbone model from a ViewModel.

```javascript
const model = kb.utils.wrappedModel(viewModel);
```

### kb.utils.wrappedObservable

Gets the observable for an attribute.

```javascript
const obs = kb.utils.wrappedObservable(viewModel, 'name');
```
