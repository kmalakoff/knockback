---
title: Knockout.js Basics
description: Understanding Knockout.js fundamentals for Knockback
---

Before diving into Knockback, it helps to understand Knockout.js fundamentals.

## Observables

Knockout observables are special JavaScript objects that notify subscribers when their value changes:

```javascript
// Create an observable
const name = ko.observable('Bob');

// Read the value
console.log(name()); // 'Bob'

// Write a new value
name('Alice');
console.log(name()); // 'Alice'
```

## Computed Observables

Computed observables are derived from other observables:

```javascript
const firstName = ko.observable('John');
const lastName = ko.observable('Doe');

const fullName = ko.computed(() => {
  return firstName() + ' ' + lastName();
});

console.log(fullName()); // 'John Doe'
```

## Data Binding

Knockout binds observables to the DOM:

```html
<p>Name: <span data-bind="text: name"></span></p>
<input data-bind="value: name" />
```

```javascript
const viewModel = {
  name: ko.observable('Bob')
};

ko.applyBindings(viewModel);
```

When the input changes, the span updates automatically!

## Common Bindings

| Binding | Purpose |
|---------|---------|
| `text` | Display text content |
| `html` | Display HTML content |
| `value` | Two-way bind form inputs |
| `visible` | Show/hide elements |
| `css` | Apply CSS classes |
| `click` | Handle click events |
| `foreach` | Render arrays |

## Observable Arrays

For collections, use `observableArray`:

```javascript
const items = ko.observableArray(['Apple', 'Banana']);

// Add item
items.push('Cherry');

// Remove item
items.remove('Banana');
```

## Why Knockback?

Knockout is great for data binding, but lacks:
- A robust model layer
- RESTful sync with servers
- Collections with sorting/filtering

That's where Backbone.js comes in, and Knockback bridges them together!
