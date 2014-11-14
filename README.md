[![Build Status](https://secure.travis-ci.org/kmalakoff/knockback.png)](http://travis-ci.org/kmalakoff/knockback#master)

![logo](https://github.com/kmalakoff/knockback/raw/master/media/logo.png)

Knockback.js provides Knockout.js magic for Backbone.js Models and Collections.

# Why Knockback?

* Make amazingly dynamic applications by applying a small number of simple principles
* Leverage the wonderful work from both the Backbone and Knockout communities
* Easily view and edit relationships between Models using an ORM of your choice:
  * [BackboneORM](http://vidigami.github.io/backbone-orm/)
  * [Backbone-Relational.js](http://backbonerelational.org/)
* Simplify program control flow by configuring your application from your HTML Views. It's like Angular.js but without memorizing all of the special purpose ng-{something} attributes. See the [Inject Tutorial](http://kmalakoff.github.com/knockback/tutorial_inject.html) for live examples!

# Examples

### Simple

###### The HTML:

```html
<label>First Name: </label><input data-bind="value: first_name, valueUpdate: 'keyup'" />
<label>Last Name: </label><input data-bind="value: last_name, valueUpdate: 'keyup'" />
```

###### And...engage:

```coffeescript
model = new Backbone.Model({first_name: 'Bob', last_name: 'Smith'})
ko.applyBindings(kb.viewModel(model))
```

When you type in the input boxes, the values are properly transferred bi-directionally to the model and all other bound view models!


### Advanced

###### The View Model:

**Javascript**

```javascript
var ContactViewModel = kb.ViewModel.extend({
  constructor: function(model) {
    kb.ViewModel.prototype.constructor.call(this, model);

    this.full_name = ko.computed(function() {
      return this.first_name() + " " + this.last_name();
    }, this);
});

```

**or Coffeescript**

```coffeescript
class ContactViewModel extends kb.ViewModel
  constructor: (model) ->
    super model

    @full_name = ko.computed => "#{@first_name()} #{@last_name()}"
```

###### The HTML:

```html
<h1 data-bind="text: 'Hello ' + full_name()"></h1>
<label>First Name: </label><input data-bind="value: first_name, valueUpdate: 'keyup'" />
<label>Last Name: </label><input data-bind="value: last_name, valueUpdate: 'keyup'" />
```

###### And...engage:

```coffeescript
model = new Backbone.Model({first_name: 'Bob', last_name: 'Smith'})
view_model = new ContactViewModel(model)
ko.applyBindings(view_model)

# ... do stuff then clean up
kb.release(view_model)
```

Now, the greeting updates as you type!


# Getting Started

* [Website](http://kmalakoff.github.com/knockback/) - explore everything Knockback and connect to the community
* [Tutorials](http://kmalakoff.github.io/knockback/tutorials_introduction.html) - try some live examples
* [API Docs](http://kmalakoff.github.com/knockback/doc/index.html) - dig into the API
* [TodoMVC App (Live!)](http://kmalakoff.github.com/knockback-todos-app/) - compare client-side framworks
* [Knockback.js Reference App (Live!)](http://kmalakoff.github.com/knockback-reference-app/) - demonstrates best practices when using Knockback.js including page routing and lifecycle management
* [Knockback-Navigators.js (Live!)](http://kmalakoff.github.com/knockback-navigators): demonstrates page and embedded pane transitions. They are platform-agnostic so you can even use them without using Knockback.js or Knockout.js!

# Download Latest (0.20.5):

Please see the [release notes](https://github.com/kmalakoff/knockback/blob/master/RELEASE_NOTES.md) for upgrade pointers.

* Full Library [(dev, 64k)](https://raw.github.com/kmalakoff/knockback/0.20.5/knockback.js) or [(min+gzip, 8k)](https://raw.github.com/kmalakoff/knockback/0.20.5/knockback.min.js)
* Full Stack [(dev, 330k)](https://raw.github.com/kmalakoff/knockback/0.20.5/knockback-full-stack.js) or [(min+gzip, 32k)](https://raw.github.com/kmalakoff/knockback/0.20.5/knockback-full-stack.min.js)

* Core Library [(dev, 54k)](https://raw.github.com/kmalakoff/knockback/0.20.5/knockback-core.js) or [(min+gzip, 7k)](https://raw.github.com/kmalakoff/knockback/0.20.5/knockback-core.min.js)
* Core Stack [(dev, 315k)](https://raw.github.com/kmalakoff/knockback/0.20.5/knockback-core-stack.js) or [(min+gzip, 31k)](https://raw.github.com/kmalakoff/knockback/0.20.5/knockback-core-stack.min.js)

The **full versions** bundle advanced features.

The **core versions** remove advanced features that can be included separately: localization, formatting, triggering, defaults, and validation.

The **stack versions** provide Underscore.js + Backbone.js + Knockout.js + Knockback.js in a single file.

###Distributions

You can also find Knockback on your favorite distributions:

* **npm**: npm install knockback
* **Bower**: bower install knockback
* **Component**: component install kmalakoff/knockback
* [NuGet](http://nuget.org/packages/Knockback.js) - install right in Visual Studio
* **Jam**: jam install knockback

###Dependencies

* [Backbone.js](http://backbonejs.org/) - provides the Model layer
* [Knockout.js](http://knockoutjs.com/) - provides the ViewModel layer foundations for Knockback
* [Underscore.js](http://underscorejs.org/) - provides an awesome JavaScript utility belt
* [LoDash](http://lodash.com/) - optionally replaces Underscore.js with a library optimized for consistent performance
* [Parse](https://www.parse.com/) - optionally replaces Backbone.js and Underscore.js

###Compatible Components

* [BackboneORM](http://vidigami.github.io/backbone-orm/) - A polystore ORM for Node.js and the browser
* [Backbone-Relational.js](http://backbonerelational.org/) - Get and set relations (one-to-one, one-to-many, many-to-one) for Backbone models
* [Backbone Associations](http://dhruvaray.github.io/backbone-associations/) - Create object hierarchies with Backbone models. Respond to hierarchy changes using regular Backbone events
* [Supermodel.js](http://pathable.github.io/supermodel/) - Minimal Model Tracking for Backbonejs
* [BackboneModelRef.js](https://github.com/kmalakoff/backbone-modelref/) - provides a reference to a Backbone.Model that can be bound to your view before the model is loaded from the server (along with relevant load state notifications).
* [KnockbackNavigators.js](https://github.com/kmalakoff/knockback-navigators/) - provides page and pane navigation including history and state (useful for single-page and mobile apps). Can be used independently from Knockback.js.
* [KnockbackInspector.js](https://github.com/kmalakoff/knockback-inspector/) - provides customizable tree view of models and collections for viewing and editing your data (useful for debugging and visualizaing JSON).


# Contributing

To build the library for Node.js and browsers:

```
$ gulp build
```

Please run tests before submitting a pull request:

```
$ gulp test --quick
```

and eventually all tests:

```
$ npm test
```
