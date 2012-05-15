````
    __ __                  __   __               __       _
   / //_/____  ____  _____/ /__/ /_  ____ ______/ /__    (_)____
  / ,<  / __ \/ __ \/ ___/ //_/ __ \/ __ `/ ___/ //_/   / / ___/
 / /| |/ / / / /_/ / /__/ ,< / /_/ / /_/ / /__/ ,< _   / (__  )
/_/ |_/_/ /_/\____/\___/_/|_/_.___/\__,_/\___/_/|_(_)_/ /____/
                                                   /___/
````

Knockback.js provides Knockout.js magic for Backbone.js Models and Collections.

### Website: http://kmalakoff.github.com/knockback/

You can get the library here:

* [Development version][1]
* [Production version][2]

[1]: https://raw.github.com/kmalakoff/knockback/0.15.1/knockback.js
[2]: https://raw.github.com/kmalakoff/knockback/0.15.1/knockback.min.js

**NOTE: there are breaking changes in 0.15.1** Please see the [release notes][http://kmalakoff.github.com/knockback/release_notes.html] for details.

Why Write Knockback.js?
-----------------------

When I was evaluating client-side frameworks, I liked lots of the pieces, but wanted to "mix and match" the best features. I started with [Backbone.js](http://documentcloud.github.com/backbone/) and really loved the Models and Collections, and used [Brunch](http://brunch.io/) to get me up and running quickly.

After a while, I found the view coding too slow so I wrote [Mixin.js](https://github.com/kmalakoff/mixin) to extract out reusable aspects of my views. When I was looking for my next productivity increase, an ex-work colleague suggested [Sproutcore](http://www.sproutcore.com/), but at the time, it wasn't yet micro-frameworky enough meaning I would need to learn something big and "to throw the baby out with the bathwater" as they say (it is hard to give up Backbone models and collections!). Then, I discovered [Knockout](http://knockoutjs.com/) and knew it was for me!

Knockout provided just the right building blocks for a layer between my templates and data. As I used it more, I built additional functionality like [Backbone.ModelRefs](https://github.com/kmalakoff/backbone-modelref) for lazy model loading, localization helpers for truly dynamic views, and most recently, an easier way to sync collections and their model's view models.

So here it is...the refactored and shareable version of my Backbone bindings for Knockout: Knockback.js

Enjoy!

Kevin

An Example
----------

### The view model:

```coffeescript
ContactViewModel = (model) ->
  kb.observables(model, {
    name:     'name'
    email:    {key:'email', write: true, default: 'your.name@yourplace.com'}
    date:     {key:'date', write: true, localizer: LongDateLocalizer}
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


Building the library
-----------------------

Installing:

1. install ruby: http://www.ruby-lang.org
2. install bundler: http://gembundler.com
3. install gems: (sudo) 'bundle install'
4. install node.js: http://nodejs.org
5. install node packages: (sudo) 'npm install'

Commands:

1. 'rake clean' - cleans the project of all compiled files
2. 'rake build' - performs a single build
3. 'rake watch' - automatically scans for and builds the project when changes are detected
4. 'rake package' - cleans the project of all compiled files, builds, and minimizes library

