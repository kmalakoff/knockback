---
title: Knockback Basics
description: Core concepts of Knockback.js
---


Knockback connects Backbone models to Knockout observables. You can use Knockback to bind Backbone Models/Collections to your HTML/templates using Knockout, allowing server or application changes to propagate automatically to your views.

:::tip[Classes vs Factory Functions]
You'll notice different capitalizations like `kb.viewModel(model)` and `kb.ViewModel`. The lowercase versions are **factory functions** that create instances of the uppercase **classes**:
```javascript
kb.viewModel = function(model, options) {
  return new kb.ViewModel(model, options);
};
```
:::

## kb.observable

Creates a Knockout observable from a Backbone model attribute:

```javascript
const model = new Backbone.Model({ name: 'Bob' });

// Create a Knockback observable
const name = kb.observable(model, 'name');

// Use it like a Knockout observable
console.log(name()); // 'Bob'

// Changes sync both ways!
name('Alice');
console.log(model.get('name')); // 'Alice'

model.set('name', 'Charlie');
console.log(name()); // 'Charlie'
```

:::note
Creating a ViewModel by hand with `kb.observable` is the best way to create **optimized ViewModels** since you only create observables for the attributes you need.
:::

## kb.viewModel

Creates a ViewModel with a Knockout observable for each Backbone.Model attribute automatically. This is good for **rapid prototyping**, but creates more observables than may be required:

```javascript
const model = new Backbone.Model({
  name: 'Bob',
  age: 25,
  email: 'bob@example.com'
});

// Create ViewModel with all attributes as observables
const viewModel = kb.viewModel(model);

// Access observables
console.log(viewModel.name()); // 'Bob'
console.log(viewModel.age());  // 25

// Bind to view
ko.applyBindings(viewModel, document.getElementById('my-view'));
```

```html
<div id="my-view">
  <p>Name: <span data-bind="text: name"></span></p>
  <p>Age: <span data-bind="text: age"></span></p>
  <input data-bind="value: email" />
</div>
```

## kb.collectionObservable

Creates an observable array from a Backbone collection:

```javascript
const collection = new Backbone.Collection([
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
]);

// Create collection observable
const people = kb.collectionObservable(collection);

// Each item is automatically a ViewModel
console.log(people()[0].name()); // 'Alice'
```

```html
<ul data-bind="foreach: people">
  <li data-bind="text: name"></li>
</ul>
```

## Two-Way Sync

Changes propagate automatically in both directions:

```javascript
const model = new Backbone.Model({ name: 'Bob' });
const viewModel = kb.viewModel(model);

// View → Model
viewModel.name('Alice');
console.log(model.get('name')); // 'Alice'

// Model → View
model.set('name', 'Charlie');
console.log(viewModel.name()); // 'Charlie'
```

## Memory Management

Always release ViewModels when done:

```javascript
const viewModel = kb.viewModel(model);

// When destroying the view
kb.release(viewModel);
```
