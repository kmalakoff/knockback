[![Build Status](https://secure.travis-ci.org/kmalakoff/knockback.png)](http://travis-ci.org/kmalakoff/knockback#master)

![logo](https://github.com/kmalakoff/knockback/raw/master/media/logo.png)

Knockback.js provides Knockout.js magic for Backbone.js Models and Collections.

Some great advantages to using Knockback.js:

* make amazingly dynamic applications by applying a small number of simple principles

* leverage the wonderful work from both the Backbone and Knockout communities

* easily view and edit relationships between Models using an ORM of your choice:
  * [BackboneORM](http://vidigami.github.io/backbone-orm/)
  * [Backbone-Relational.js](http://backbonerelational.org/)
  * [Backbone Associations](http://dhruvaray.github.io/backbone-associations/)
  * [Supermodel.js](http://pathable.github.io/supermodel/)

* simplify program control flow by configuring your application from your HTML Views: think of it like Angular.js without memorizing all of the special purpose ng-{something} attributes. See the [Inject Tutorial](http://kmalakoff.github.com/knockback/tutorial_inject.html) for live examples!


These resources can help you get started:

* [Knockback.js Website](http://kmalakoff.github.com/knockback/)

* [API Docs](http://kmalakoff.github.com/knockback/doc/index.html)

* [Tutorials](http://kmalakoff.github.com/knockback/tutorials_introduction.html)

* [TodoMVC App (Live!)](http://kmalakoff.github.com/knockback-todos-app/)

* [Knockback.js Reference App (Live!)](http://kmalakoff.github.com/knockback-reference-app/): demonstrates best practices when using Knockback.js including page routing and lifecycle management.

* [Knockback-Navigators.js (Live!)](http://kmalakoff.github.com/knockback-navigators): demonstrates page and embedded pane transitions. They are platform-agnostic so you can even use them without using Knockback.js or Knockout.js!


An Example
----------

### The view model:

Javascript

```javascript
var ContactViewModel = kb.ViewModel.extend({
  constructor: function(model) {
    kb.ViewModel.prototype.constructor.call(this, model);
    this.full_name = ko.computed(function() {
      return this.first_name() + " " + this.last_name();
    }, this);
});

```

or Coffeescript

```coffeescript
class ContactViewModel extends kb.ViewModel
  constructor: (model) ->
    super model
    @full_name = ko.computed => "#{@first_name()} #{@last_name()}"
```

### The HTML:

```html
<h1 data-bind="text: 'Hello ' + full_name()"></h1>
<label>First Name: </label><input data-bind="value: first_name" />
<label>Last Name: </label><input data-bind="value: last_name" />
<label>Email: </label><input data-bind="value: email" />
<label>Birthdate: </label><input data-bind="value: date" />
```

### And...engage:

```coffeescript
view_model = new ContactViewModel(new Backbone.Model({first_name: 'Bob', last_name: 'Bob', email: 'bob@bob.com', date: new Date()}))
ko.applyBindings(view_model)

# ...

# and cleanup after yourself when you are done.
kb.release(view_model)
```

And now when you type in the input boxes, the values are properly transferred to the model and the greeting updates as you type!

Of course, this is just a simple example, but hopefully you get the picture.


#Download Latest (0.19.4):

Please see the [release notes](https://github.com/kmalakoff/knockback/blob/master/RELEASE_NOTES.md) for upgrade pointers.

###Full

Bundles advanced features including: localization, formatting, triggering, and defaults. Stack provides Underscore.js + Backbone.js + Knockout.js + Knockback.js in a single file.

* Full Library [(dev, 64k)](https://raw.github.com/kmalakoff/knockback/0.19.4/knockback.js) or [(min+gzip, 8k)](https://raw.github.com/kmalakoff/knockback/0.19.4/knockback.min.js)
* Full Stack [(dev, 330k)](https://raw.github.com/kmalakoff/knockback/0.19.4/knockback-full-stack.js) or [(min+gzip, 32k)](https://raw.github.com/kmalakoff/knockback/0.19.4/knockback-full-stack.min.js)

###Core

Removes advanced features that can be included separately: localization, formatting, triggering, defaults, validation, and statistics. Stack provides Underscore.js + Backbone.js + Knockout.js + Knockback.js in a single file.

* Core Library [(dev, 54k)](https://raw.github.com/kmalakoff/knockback/0.19.4/knockback-core.js) or [(min+gzip, 7k)](https://raw.github.com/kmalakoff/knockback/0.19.4/knockback-core.min.js)
* Core Stack [(dev, 315k)](https://raw.github.com/kmalakoff/knockback/0.19.4/knockback-core-stack.js) or [(min+gzip, 31k)](https://raw.github.com/kmalakoff/knockback/0.19.4/knockback-core-stack.min.js)

###Distributions

You can also find Knockback on your favorite distributions:

* npm: npm install knockback
* Bower: bower install knockback
* Component.io: component install kmalakoff/knockback
* [NuGet]: (http://nuget.org/packages/Knockback.js)
* Jam: jam install knockback

###Dependencies

* [Backbone.js](http://backbonejs.org/)
* [Underscore.js](http://underscorejs.org/)
* [Knockout.js](http://knockoutjs.com/)

###Replaceable Dependencies

* [LoDash](http://lodash.com/) - it you prefer LoDash to Underscore.js, we've got support for it!
* [Parse](https://www.parse.com/) - instead of Backbone.js, you can use Parse. Please note: there is no support for module loading and if you include Parse, it overrides Backbone.js and Underscore.js

###Compatible Components

* [BackboneORM](http://vidigami.github.io/backbone-orm/) - A polystore ORM for Node.js and the browser
* [Backbone-Relational.js](http://backbonerelational.org/) - Get and set relations (one-to-one, one-to-many, many-to-one) for Backbone models
* [Backbone Associations](http://dhruvaray.github.io/backbone-associations/) - Create object hierarchies with Backbone models. Respond to hierarchy changes using regular Backbone events
* [Supermodel.js](http://pathable.github.io/supermodel/) - Minimal Model Tracking for Backbonejs
* [BackboneModelRef.js](https://github.com/kmalakoff/backbone-modelref/) - provides a reference to a Backbone.Model that can be bound to your view before the model is loaded from the server (along with relevant load state notifications).
* [KnockbackNavigators.js](https://github.com/kmalakoff/knockback-navigators/) - provides page and pane navigation including history and state (useful for single-page and mobile apps). Can be used independently from Knockback.js.
* [KnockbackInspector.js](https://github.com/kmalakoff/knockback-inspector/) - provides customizable tree view of models and collections for viewing and editing your data (useful for debugging and visualizaing JSON).


### For Contributors

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
