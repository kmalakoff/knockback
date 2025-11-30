---
title: Views & ViewModels
description: Understanding the MVVM pattern in Knockback
---


Knockback implements the MVVM (Model-View-ViewModel) pattern.

## The Problem with MVC

In traditional Backbone MVC, views often contain too much logic:

```javascript
// Backbone View - logic mixed with rendering
const UserView = Backbone.View.extend({
  render() {
    const fullName = this.model.get('firstName') + ' ' +
                     this.model.get('lastName');
    this.$('.name').text(fullName);

    if (this.model.get('age') >= 18) {
      this.$('.adult-content').show();
    }
    return this;
  }
});
```

## MVVM Solution

With Knockback, the ViewModel handles logic while the view stays declarative:

```javascript
// ViewModel - owns the logic
const UserViewModel = function(model) {
  this.firstName = kb.observable(model, 'firstName');
  this.lastName = kb.observable(model, 'lastName');
  this.age = kb.observable(model, 'age');

  // Computed properties
  this.fullName = ko.computed(() => {
    return this.firstName() + ' ' + this.lastName();
  });

  this.isAdult = ko.computed(() => {
    return this.age() >= 18;
  });
};
```

```html
<!-- View - declarative, logic-less -->
<div>
  <p data-bind="text: fullName"></p>
  <div data-bind="visible: isAdult">Adult content here</div>
</div>
```

## Separation of Concerns

| Layer | Responsibility |
|-------|---------------|
| **Model** (Backbone) | Data, validation, server sync |
| **ViewModel** (Knockback) | UI state, computed values, formatting |
| **View** (HTML + Knockout) | Display, user interaction |

## Custom ViewModels

Extend kb.ViewModel for reusable ViewModels:

```javascript
const PersonViewModel = kb.ViewModel.extend({
  constructor(model) {
    kb.ViewModel.prototype.constructor.call(this, model);

    this.fullName = ko.computed(() => {
      return this.firstName() + ' ' + this.lastName();
    });
  }
});

const viewModel = new PersonViewModel(personModel);
```

## View Settings

ViewModels can have view-specific settings not in the model:

```javascript
const TaskViewModel = function(model) {
  kb.viewModel(model, this);

  // View-only state (not in model)
  this.isEditing = ko.observable(false);
  this.isSelected = ko.observable(false);

  // Priority colors (view concern)
  this.priorityColor = ko.computed(() => {
    const priority = this.priority();
    return priority === 'high' ? 'red' :
           priority === 'medium' ? 'yellow' : 'green';
  });
};
```

## Benefits

1. **Testable** - ViewModels can be unit tested without DOM
2. **Reusable** - Same ViewModel for different views
3. **Maintainable** - Clear separation of concerns
4. **Declarative** - Views describe what, not how
