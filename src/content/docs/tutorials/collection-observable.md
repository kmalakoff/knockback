---
title: kb.CollectionObservable
description: Working with Backbone collections in Knockback
---


`kb.collectionObservable` creates an observable array from a Backbone Collection, with automatic syncing.

## Basic Usage

```javascript
const collection = new Backbone.Collection([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]);

const people = kb.collectionObservable(collection);

// Access items (each is a ViewModel)
console.log(people()[0].name()); // 'Alice'
console.log(people().length);     // 2
```

## Automatic Sync

The observable array updates automatically:

```javascript
// Add to collection → observable updates
collection.add({ id: 3, name: 'Charlie' });
console.log(people().length); // 3

// Remove from collection → observable updates
collection.remove(collection.at(0));
console.log(people().length); // 2

// Reset collection → observable updates
collection.reset([{ id: 4, name: 'Diana' }]);
console.log(people().length); // 1
```

## Custom ViewModels

Use a custom ViewModel for each item:

```javascript
const PersonViewModel = kb.ViewModel.extend({
  constructor(model) {
    kb.ViewModel.prototype.constructor.call(this, model);

    this.fullName = ko.computed(() =>
      this.firstName() + ' ' + this.lastName()
    );
  }
});

const people = kb.collectionObservable(collection, {
  view_model: PersonViewModel
});
```

## Sorting

### Sort by attribute

```javascript
const sortedPeople = kb.collectionObservable(collection, {
  sort_attribute: 'name'
});
```

### Custom comparator

```javascript
const sortedPeople = kb.collectionObservable(collection, {
  comparator: (a, b) => {
    return a.model().get('age') - b.model().get('age');
  }
});
```

## Filtering

```javascript
const adults = kb.collectionObservable(collection, {
  filters: (model) => model.get('age') >= 18
});
```

## HTML Binding

```html
<ul data-bind="foreach: people">
  <li>
    <span data-bind="text: name"></span>
    (<span data-bind="text: age"></span> years old)
    <button data-bind="click: $parent.removePerson">Remove</button>
  </li>
</ul>

<button data-bind="click: addPerson">Add Person</button>
```

```javascript
const viewModel = {
  people: kb.collectionObservable(collection),

  addPerson() {
    collection.add({
      name: 'New Person',
      age: 25
    });
  },

  removePerson(personVM) {
    collection.remove(personVM.model());
  }
};

ko.applyBindings(viewModel);
```

## Options Reference

| Option | Description |
|--------|-------------|
| `view_model` | Custom ViewModel class |
| `sort_attribute` | Attribute to sort by |
| `comparator` | Custom sort function |
| `filters` | Filter function or array |
| `path` | Path for nested collections |

## Memory Management

Release cleans up all ViewModels:

```javascript
const people = kb.collectionObservable(collection);

// Releases all item ViewModels
kb.release(people);
```
