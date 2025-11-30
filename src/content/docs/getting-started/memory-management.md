---
title: Memory Management
description: Properly managing memory in Knockback applications
---


Proper memory management is crucial for Knockback applications to avoid memory leaks.

## The Problem

Knockback creates subscriptions between Backbone models and Knockout observables. If not cleaned up, these subscriptions persist and cause memory leaks.

## kb.release()

Always release ViewModels when they're no longer needed:

```javascript
const viewModel = kb.viewModel(model);

// When destroying the view
kb.release(viewModel);
```

## Releasing Collections

For collection observables, release handles all child ViewModels:

```javascript
const people = kb.collectionObservable(collection);

// Releases all ViewModels in the collection
kb.release(people);
```

## Backbone View Integration

Clean up in your Backbone view's `remove` method:

```javascript
const MyView = Backbone.View.extend({
  initialize() {
    this.viewModel = kb.viewModel(this.model);
    ko.applyBindings(this.viewModel, this.el);
  },

  remove() {
    kb.release(this.viewModel);
    ko.cleanNode(this.el);
    Backbone.View.prototype.remove.call(this);
  }
});
```

## Auto-Releasing ViewModels

There are three ways to auto-release ViewModels when DOM nodes are removed:

### 1. kb.renderTemplate (Auto-released)

```javascript
const el = kb.renderTemplate('template_name', viewModel, options);
// viewModel is released when el is removed via ko.removeNode
```

### 2. kb.applyBindings (Auto-released)

```javascript
kb.applyBindings(viewModel, el);
// viewModel is released when el is removed via ko.removeNode
```

### 3. kb.releaseOnNodeRemove (Manual)

```javascript
const viewModel = kb.viewModel(model);
kb.releaseOnNodeRemove(viewModel, document.getElementById('my-view'));
ko.applyBindings(viewModel, document.getElementById('my-view'));
```

## Using with Backbone.Router

This means you can use a Backbone.Router without explicitly calling `kb.release()` because `ko.removeNode` calls it for you:

```javascript
const AppRouter = Backbone.Router.extend({
  initialize() {
    this.activeEl = null;

    const loadPage = (el) => {
      if (this.activeEl) ko.removeNode(this.activeEl);
      document.body.appendChild(this.activeEl = el);
    };

    this.route('', null, () => {
      loadPage(kb.renderTemplate('home', new HomeViewModel()));
    });
    this.route('things', null, () => {
      loadPage(kb.renderTemplate('things_page', new ThingsPageViewModel()));
    });
    this.route('things/:id', null, (id) => {
      loadPage(kb.renderTemplate('thing_page', new ThingViewModel(collection.get(id))));
    });
  }
});
```

## Best Practices

### 1. Release in reverse order of creation

```javascript
// Create
const parentVM = kb.viewModel(parentModel);
const childVM = kb.viewModel(childModel);

// Release in reverse order
kb.release(childVM);
kb.release(parentVM);
```

### 2. Use dispose callbacks for computed observables

```javascript
const viewModel = {
  fullName: ko.computed({
    read() { return this.firstName() + ' ' + this.lastName(); },
    disposeWhenNodeIsRemoved: myElement
  })
};
```

### 3. Clear event handlers

```javascript
const MyView = Backbone.View.extend({
  initialize() {
    this.listenTo(this.model, 'change', this.onChange);
  },

  remove() {
    this.stopListening(); // Clear Backbone events
    kb.release(this.viewModel);
    Backbone.View.prototype.remove.call(this);
  }
});
```

## Debugging Memory Leaks

Check for unreleased ViewModels:

```javascript
// In development
if (kb.statistics) {
  console.log('Registered ViewModels:', kb.statistics.registeredCount());
}
```

## Common Pitfalls

| Issue | Solution |
|-------|----------|
| Forgetting to release | Use `kb.releaseOnNodeRemove` |
| Releasing too early | Ensure view is fully removed first |
| Circular references | Use `kb.release` on all ViewModels |
| Event listeners | Call `stopListening()` before release |
