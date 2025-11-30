---
title: Nested Models
description: Working with nested and relational models
---


Knockback handles nested Backbone models and relations.

## Basic Nested Models

When a model contains another model:

```javascript
const address = new Backbone.Model({
  street: '123 Main St',
  city: 'Boston'
});

const person = new Backbone.Model({
  name: 'Bob',
  address: address
});

const viewModel = kb.viewModel(person, {
  factories: {
    'address': kb.ViewModel
  }
});

// Access nested properties
console.log(viewModel.address().street()); // '123 Main St'
```

## Using Backbone-Relational

With [Backbone-Relational](http://backbonerelational.org/):

```javascript
const Person = Backbone.RelationalModel.extend({
  relations: [{
    type: Backbone.HasOne,
    key: 'address',
    relatedModel: Address
  }, {
    type: Backbone.HasMany,
    key: 'friends',
    relatedModel: Person,
    collectionType: PersonCollection
  }]
});

const viewModel = kb.viewModel(person, {
  factories: {
    'address': kb.ViewModel,
    'friends': kb.CollectionObservable
  }
});
```

## Backbone Associations

With [Backbone Associations](http://dhruvaray.github.io/backbone-associations/):

```javascript
const Person = Backbone.AssociatedModel.extend({
  relations: [{
    type: Backbone.One,
    key: 'address',
    relatedModel: Address
  }, {
    type: Backbone.Many,
    key: 'phones',
    relatedModel: Phone
  }]
});
```

## HTML Binding

```html
<div data-bind="with: person">
  <h2 data-bind="text: name"></h2>

  <!-- Nested model -->
  <div data-bind="with: address">
    <p data-bind="text: street"></p>
    <p data-bind="text: city"></p>
  </div>

  <!-- Nested collection -->
  <ul data-bind="foreach: friends">
    <li data-bind="text: name"></li>
  </ul>
</div>
```

## Deep Paths

Access deeply nested attributes:

```javascript
const viewModel = kb.viewModel(person, {
  keys: ['name', 'address.street', 'address.city']
});

// Creates flattened observables
viewModel.name();          // 'Bob'
viewModel.address_street(); // '123 Main St'
```

## Factory Functions

Use factory functions for dynamic ViewModel creation:

```javascript
const viewModel = kb.viewModel(person, {
  factories: {
    'address': (model) => {
      if (model.get('type') === 'business') {
        return new BusinessAddressViewModel(model);
      }
      return new AddressViewModel(model);
    }
  }
});
```

## Paths for Collections

For nested collections:

```javascript
const company = new Backbone.Model({
  name: 'Acme Inc',
  departments: new Backbone.Collection([...])
});

const employees = kb.collectionObservable(company, {
  path: 'departments'
});
```

## Best Practices

1. **Define relations clearly** - Use Backbone-Relational or Associations
2. **Specify factories** - Ensure proper ViewModel types
3. **Watch memory** - Release nested ViewModels
4. **Use paths** - For deep attribute access
