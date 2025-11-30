---
title: Introduction
description: Introduction to Knockback.js
---


Knockback.js bridges the dynamic DOM bindings of [Knockout.js](http://knockoutjs.com/) with the models, collections, and routers of [Backbone.js](http://backbonejs.org/). It also brings other features like localization, default values, and nested view models.

Both Knockout.js and Backbone.js have their strengths and weaknesses, but together they are amazing! With Knockback.js, you can use the strong ORM provided by Backbone and create dynamic views using Knockout bindings.

:::note
`kb` and `Knockback` can be used interchangeably throughout the API.
:::

## Features

- **Localization** - Built-in i18n support
- **Automatic Updates** - Knockout.js' bindings and automagical update
- **Robust Models** - Backbone's sleek Model definition
- **Dynamic Collection Sorting** - Sorted collection views
- **Two-way String Formatting** - Transform data for display and back

## Dependencies

Knockback requires these libraries to be loaded:

- [Knockout.js](http://knockoutjs.com/) - For data binding
- [Backbone.js](http://backbonejs.org/) - For models, collections, and routers
- [Underscore.js](http://underscorejs.org/) - Required by Backbone

## Compatible Components

Knockback is compatible with:

- [BackboneORM](http://vidigami.github.io/backbone-orm/)
- [Backbone-Relational](http://backbonerelational.org/)
- [Backbone Associations](http://dhruvaray.github.io/backbone-associations/)
- [Parse](https://www.parse.com/)
- [Backbone-ModelRef](https://github.com/kmalakoff/backbone-modelref)

## Quick Example

```javascript
// Create a Backbone model
const model = new Backbone.Model({ name: 'Bob', age: 25 });

// Create a Knockback ViewModel
const viewModel = kb.viewModel(model);

// Use Knockout bindings in your HTML
// <span data-bind="text: name"></span>
// <span data-bind="text: age"></span>

// Changes to the model automatically update the view!
model.set('name', 'Alice'); // View updates automatically
```
