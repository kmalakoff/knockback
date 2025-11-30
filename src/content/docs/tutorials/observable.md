---
title: kb.Observable
description: Deep dive into kb.observable
---


`kb.observable` is the foundation of Knockback - it creates a two-way binding between a Backbone model attribute and a Knockout observable.

## Basic Usage

```javascript
const model = new Backbone.Model({ name: 'Bob' });
const nameObservable = kb.observable(model, 'name');

// Read
console.log(nameObservable()); // 'Bob'

// Write
nameObservable('Alice');
console.log(model.get('name')); // 'Alice'
```

## Options

### key

Specify which model attribute to observe:

```javascript
const name = kb.observable(model, { key: 'name' });
```

### read / write

Custom read/write functions. Instead of a simple `model.get()` or `model.set()`, you can provide custom methods:

```javascript
const fullName = kb.observable(model, {
  key: 'name',
  read() {
    return this.model().get('firstName') + ' ' + this.model().get('lastName');
  },
  write(value) {
    const parts = value.split(' ');
    this.model().set({
      firstName: parts[0],
      lastName: parts[1]
    });
  }
});
```

:::note
Just like in Knockout.js, if you need access to the owning view model, it is provided as `this` in read and write methods when you pass it as the third parameter: `kb.observable(model, options, owningViewModel)`
:::

### localizer

For localized attributes, you can provide a kb.LocalizedObservable derived class:

```javascript
const localizedName = kb.observable(model, {
  key: 'name',
  localizer: MyLocalizer
});
```

See the [Localization tutorial](/tutorials/localization/) for details.

### default

Provide a default value when the attribute is undefined:

```javascript
const name = kb.observable(model, {
  key: 'name',
  default: 'Unknown'
});
```

## Formatting

Transform values for display:

```javascript
const price = kb.observable(model, {
  key: 'price',
  read() {
    return '$' + this.model().get('price').toFixed(2);
  },
  write(value) {
    this.model().set('price', parseFloat(value.replace('$', '')));
  }
});
```

## With Computed Properties

Combine with Knockout computed:

```javascript
const firstName = kb.observable(model, 'firstName');
const lastName = kb.observable(model, 'lastName');

const fullName = ko.computed({
  read() {
    return firstName() + ' ' + lastName();
  },
  write(value) {
    const parts = value.split(' ');
    firstName(parts[0]);
    lastName(parts[1] || '');
  }
});
```

## HTML Binding

```html
<div>
  <label>Name:</label>
  <input type="text" data-bind="value: name" />
  <p>Hello, <span data-bind="text: name"></span>!</p>
</div>
```

```javascript
const viewModel = {
  name: kb.observable(model, 'name')
};

ko.applyBindings(viewModel);
```

## Best Practices

1. **Use kb.observable for optimized ViewModels** - Creating by hand gives you control over which observables are created
2. **Use kb.viewModel for rapid prototyping** - Automatically creates observables for all attributes
3. **Release when done** - Call `kb.release()` to prevent memory leaks
4. **Keep formatting in the observable** - Not in the view
