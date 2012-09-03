[![Build Status](https://secure.travis-ci.org/kmalakoff/knockback.png)](http://travis-ci.org/kmalakoff/knockback)

````
    __ __                  __   __               __       _
   / //_/____  ____  _____/ /__/ /_  ____ ______/ /__    (_)____
  / ,<  / __ \/ __ \/ ___/ //_/ __ \/ __ `/ ___/ //_/   / / ___/
 / /| |/ / / / /_/ / /__/ ,< / /_/ / /_/ / /__/ ,< _   / (__  )
/_/ |_/_/ /_/\____/\___/_/|_/_.___/\__,_/\___/_/|_(_)_/ /____/
                                                   /___/
````

Knockback.js provides Knockout.js magic for Backbone.js Models and Collections.

### Website: [kmalakoff.github.com/knockback][1]

### Dependencies

* [Backbone.js][2]
* [Underscore.js][3]
* [Knockout.js][4]

You can get the full library here:

* [Development version][5]
* [Production version][6]

Also, now there is a core version (defaults, formatting, localization, and triggering removed), and bundled "stacks" that include Underscore.js, Backbone.js, Knockout.js, and Knockback.js (useful for comparing with other client-side libraries and frameworks):

* [Full Stack - Development version][7]
* [Full Stack - Production version][8]
* [Core - Development version][9]
* [Core - Production version][10]
* [Core Stack - Development version][11]
* [Core Stack - Production version][12]

**NOTE: if you are upgrading to 0.16.0+ from a previous version, there are many important changes and some require you to upgrade your code** Please see the [release notes](http://kmalakoff.github.com/knockback/release_notes.html) for details.

An Example
----------

### The view model:

```coffeescript
ContactViewModel = (model) ->
  kb.observables(model, {
    name:     'name'
    email:    {key:'email', default: 'your.name@yourplace.com'}
    date:     {key:'date', localizer: LongDateLocalizer}
  }, this)
  @           # must return this or Coffeescript will return the last statement which is not what we want!
```

or (Coffeescript)

```coffeescript
class ContactViewModel extends kb.ViewModel
  constructor: (model) ->
    super(model, {internals: ['email', 'date']})  # call super constructor: @name, @_email, and @_date created in super from the model attributes
    @email = kb.defaultWrapper(@_email, 'your.name@yourplace.com')
    @date = new LongDateLocalizer(@_date)
```

or (Javascript)

```javascript
var ContactViewModel = kb.ViewModel.extend({
  constructor: function(model) {
    kb.ViewModel.prototype.constructor.call(this, model, {internals: ['email', 'date']});   // call super constructor: @name, @_email, and @_date created in super from the model attributes
    this.email = kb.defaultWrapper(this._email, 'your.name@yourplace.com');
    this.date = new LongDateLocalizer(this._date);
    return this;
  }
});
```

### The HTML:

```html
<label>Name: </label><input data-bind="value: name" />
<label>Email: </label><input data-bind="value: email" />
<label>Birthdate: </label><input data-bind="value: date" />
```

### And...engage:

```coffeescript
view_model = new ContactViewModel(new Backbone.Model({name: 'Bob', email: 'bob@bob.com', date: new Date()}))
ko.applyBindings(view_model)

# ...

# and cleanup after yourself when you are done.
kb.utils.release(view_model)
```

And now when you type in the input boxes, the values are properly transferred to the model and the dates are even localized!

Of course, this is just a simple example, but hopefully you get the picture.

Demos and Documentation
-----------------------
For comprehensive tutorials, take a look at the website: http://kmalakoff.github.com/knockback/

Try a live demo: http://kmalakoff.github.com/knockback-todos/ or http://jsfiddle.net/kmalakoff/QSkpv/


Building, Running and Testing the library
-----------------------

###Installing:

1. install node.js: http://nodejs.org
2. install node packages: 'npm install'

###Commands:

Look at: https://github.com/kmalakoff/easy-bake

[1]: http://kmalakoff.github.com/knockback/
[2]: http://backbonejs.org/
[3]: http://underscorejs.org/
[4]: http://knockoutjs.com/

[5]: https://raw.github.com/kmalakoff/knockback/0.15.4/knockback.js
[6]: https://raw.github.com/kmalakoff/knockback/0.15.4/knockback.min.js
[7]: https://raw.github.com/kmalakoff/knockback/0.16.0/knockback-full-stack.js
[8]: https://raw.github.com/kmalakoff/knockback/0.16.0/knockback-full-stack.min.js

[9]: https://raw.github.com/kmalakoff/knockback/0.16.0/knockback-core.js
[10]: https://raw.github.com/kmalakoff/knockback/0.16.0/knockback-core.min.js
[11]: https://raw.github.com/kmalakoff/knockback/0.16.0/knockback-core-stack.js
[12]: https://raw.github.com/kmalakoff/knockback/0.16.0/knockback-core-stack.min.js