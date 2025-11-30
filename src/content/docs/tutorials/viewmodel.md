---
title: kb.ViewModel
description: Creating ViewModels with Knockback
---


`kb.viewModel` creates a complete ViewModel from a Backbone model, with observables for all attributes.

## Basic Usage

```javascript
const model = new Backbone.Model({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
});

const viewModel = kb.viewModel(model);

// All attributes become observables
console.log(viewModel.firstName()); // 'John'
console.log(viewModel.lastName());  // 'Doe'
```

## Options

### keys

Only include specific attributes:

```javascript
const viewModel = kb.viewModel(model, {
  keys: ['firstName', 'lastName']
});
// email is NOT included
```

### excludes

Exclude specific attributes:

```javascript
const viewModel = kb.viewModel(model, {
  excludes: ['password', 'ssn']
});
```

### internals

Include internal Backbone properties:

```javascript
const viewModel = kb.viewModel(model, {
  internals: ['id', 'cid']
});
```

### factories

Custom factories for nested models:

```javascript
const viewModel = kb.viewModel(model, {
  factories: {
    'address': kb.ViewModel,
    'contacts': kb.CollectionObservable
  }
});
```

## Custom ViewModels

Extend kb.ViewModel for reusable logic:

```javascript
const PersonViewModel = kb.ViewModel.extend({
  constructor(model) {
    kb.ViewModel.prototype.constructor.call(this, model, {
      keys: ['firstName', 'lastName', 'age']
    });

    // Add computed properties
    this.fullName = ko.computed(() => {
      return this.firstName() + ' ' + this.lastName();
    });

    this.isAdult = ko.computed(() => {
      return this.age() >= 18;
    });
  }
});

const viewModel = new PersonViewModel(personModel);
```

## Using Classes (ES6)

```javascript
class PersonViewModel extends kb.ViewModel {
  constructor(model) {
    super(model, {
      keys: ['firstName', 'lastName', 'age']
    });

    this.fullName = ko.computed(() =>
      `${this.firstName()} ${this.lastName()}`
    );
  }
}
```

## Accessing the Model

```javascript
const viewModel = kb.viewModel(model);

// Get the underlying model
const model = viewModel.model();

// Or use kb.utils
const model = kb.utils.wrappedModel(viewModel);
```

## HTML Example

```html
<form data-bind="submit: save">
  <input data-bind="value: firstName" placeholder="First Name" />
  <input data-bind="value: lastName" placeholder="Last Name" />
  <input data-bind="value: email" type="email" />
  <button type="submit">Save</button>
</form>
```

```javascript
const viewModel = kb.viewModel(model);
viewModel.save = function() {
  this.model().save();
};

ko.applyBindings(viewModel);
```

## Memory Management

Always release ViewModels:

```javascript
const viewModel = kb.viewModel(model);

// When done
kb.release(viewModel);
```
