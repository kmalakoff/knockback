````
    __ __                  __   __               __       _
   / //_/____  ____  _____/ /__/ /_  ____ ______/ /__    (_)____
  / ,<  / __ \/ __ \/ ___/ //_/ __ \/ __ `/ ___/ //_/   / / ___/
 / /| |/ / / / /_/ / /__/ ,< / /_/ / /_/ / /__/ ,< _   / (__  )
/_/ |_/_/ /_/\____/\___/_/|_/_.___/\__,_/\___/_/|_(_)_/ /____/
                                                   /___/
````

Knockback.js provides Knockout.js magic for Backbone.js Models and Collections.

You can get the library here:

* [Development version][1]
* [Production version][2]

[1]: https://github.com/kmalakoff/knockback/raw/master/knockback.js
[2]: https://github.com/kmalakoff/knockback/raw/master/knockback.min.js

You can find Knockout [here][3], Backbone.js [here][4], and Underscore.js [here][5].

[3]: https://github.com/SteveSanderson/knockout/downloads/
[4]: http://documentcloud.github.com/backbone/
[5]: http://documentcloud.github.com/underscore/


When I was evaluating client-side frameworks, I liked lots of the pieces, but wanted to "mix and match" the best features. I started with [Backbone.js](http://documentcloud.github.com/backbone/) and really loved the Models and Collections, and used [Brunch](http://brunch.io/) to get me up and running quickly.

After a while, I found the view coding too slow so I wrote [Mixin.js](https://github.com/kmalakoff/mixin) to extract out reusable aspects of my views. When I was looking for my next productivity increase, an ex-work colleague suggested [Sproutcore](http://www.sproutcore.com/), but at the time, it wasn't yet micro-frameworky enough meaning I would need to learn something big and "to throw the baby out with the bathwater" as they say (it is hard to give up Backbone models and collections!). Then, I discovered [Knockout](http://knockoutjs.com/) and knew it was for me!

Knockout provided just the right building blocks for a layer between my templates and data. As I used it more, I built additional functionality like [Backbone.ModelRefs](https://github.com/kmalakoff/backbone-modelref) for lazy model loading, localization helpers for truly dynamic views, and most recently, an easier way to sync collections and their model's view models.

So here it is...the refactored and shareable version of my Backbone bindings for Knockout: Knockback.js

Enjoy!

Kevin

Demos and Documentation
-----------------------

### Try the live demo: http://kmalakoff.github.com/knockback-todos/

1. Knockback Todo app provides a **comprehesive documentation on Knockback**: https://github.com/kmalakoff/knockback-todos
2. jsFiddle that demonstrates dynamic localization: http://jsfiddle.net/kmalakoff/QSkpv/

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
````

or

```coffeescript
class ContactViewModel extends kb.ViewModel
  constructor: (model) ->
    super(model, {internals: ['email', 'date']})  # @name, @_email, and @_date created in super from the model attributes
    @email = kb.defaultWrapper(@_email, 'your.name@yourplace.com')
    @date = new LongDateLocalizer(@_date)
````

### The HTML:

```html
<label>Name: </label><input data-bind="value: name" />
<label>Email: </label><input data-bind="value: email" />
<label>Birthdate: </label><input data-bind="value: date" />
```

### And...engage:

```coffeescript
view_model = new ContactViewModel(collection.get('some_id'))
ko.applyBindings(view_model)

# ...

# and cleanup after yourself when you are done.
kb.vmRelease(view_model)
```

And now when you type in the input boxes, the values are properly transferred to the model and the dates are even localized!

Of course, this is just a simple example, but hopefully you get the picture. For a more advanced version, look at test/interactive/test.html or http://jsfiddle.net/kmalakoff/QSkpv/.

Conventions and useful tips
===========================

1. Knockback and kb are aliased so you can use kb.observable or Knockback.observable.

2. The library is written with the following naming conventions: i) Classes are CamelCase, ii) functions are sortaCamelCased, iii) properties are written_with_underscores, and constants are BIG_AND_NOTICABLE.

3. What 2. means is that kb.observable() is actually a factory function and kb.Observable is the class it creates and from which you derive if you want to override behavior. In other words:

```coffeescript
# factory function
Knockback.observable = (model, bind_info, view_model) -> return new Knockback.Observable(value, bind_info, view_model)
```

The library includes the following classes:

Knockback.observables and Knockback.observable
----------------------------------------------

   These are the foundations for watching model attributes for one and two-way changes. The pluralized form provides a short-hand for multiple attributes like in the above example.

### Note 1

You can watch a non-BackboneModel as long as it: a) mixes in Backbone.Events and triggers 'change' and/or "change:#{attribute_name}" events and b) implements "get: (attribute_name) -> return something". This simplified Backbone.Model API is the same interface as is needed for your implementation of kb.locale_manager:

```coffeescript
kb.observables(kb.locale_manager, {
  label_title_new:    'title_new'
  label_button_new:   'button_new'
  label_name:         'name'
  label_email:        'email'
  label_date:         'date'
}, view_model)
```

### Note 2

You can provide custom read and write methods to provide custom formatting to the attributes just like in Knockout.

```coffeescript
kb.observable(model, {
  key:'number'
  read: -> return "#: #{model.get('number')}"
  write: (value) -> model.set({number: value.substring(3)})
}, this)
```

### Note 3

You can provide a localizer (see the Knockback.LocalizedObservable class) to both provide read and write localization for an attribute.

```coffeescript
kb.observables(model, {
  date:     {key:'date', write: true, localizer: LongDateLocalizer}
}, this)
```

### Note 4

You can provide an option to the observables to fill in the write options for entries that have not been specified. Note: the default is read-only to reduce keep observable resource usage to a minimum.

```coffeescript
kb.observables(model, {
  name:     'name'
  status:   {key: 'status', write: false}
  date:     {key:'date', localizer: LongDateLocalizer}
  item1:    'something'
}, this, true)    # fill in unspecified - name, date, item1 are writeable, status is read-only
```
or

```coffeescript
kb.observables(model, {
  name:     'name'
  status:   {key: 'status', write: false}
  date:     {key:'date', localizer: LongDateLocalizer}
  item1:    'something'
}, this, {write: true})    # fill in unspecified - name, date, item1 are writeable, status is read-only
```

### Note 5

You can also watch a Backbone.ModelRef instead of a Backbone.Model. What is a Backbone.ModelRef do you ask? It is the combination of a collection and a model id that tells you when it is loaded and unloaded (https://github.com/kmalakoff/backbone-modelref). That way, you can start rendering views on a page while the models are loading.

If the model unloads, the default behavior is to retain the last value; however, if you want to restore the default values, you can call setToDefault on either Knockback.observables or Knockback.observable, and they will restore the defaults. The assumption is that normally, keeping the old values is a desired behavior.


Knockback.collectionObservable
------------------------

This takes a ko.observableArray and makes sure it stays in sync and sorted with a collection. You need to at minimum provide a "view_model: MyViewModel" constructor which can return an instance of a class or can be a plain old Javascript object. The important thing is that the view model you provide should be unique per instance of your model or else the "behavior is not guaranteed".

```coffeescript
kb.collectionObservable(collection, view_models_array, {
  view_model_constructor: ContactViewModel
})
```
or

```coffeescript
kb.collectionObservable(collection, view_models_array, {
  view_model_create: (model) -> return new ContactViewModel(model)
})
```

**Note:** view_model_constructor and view_model_create are optional. If it is not supplied, a default view model with read and write observables will be created for all of the attributes in your model (see kb.viewModel).

### Note 1

You can either have the collection sort for you (eg. using a Backbone.Collection "comparator") or you can provide your own sorting methods that are decoupled from the collection like:

```coffeescript
collection_observable = kb.collectionObservable(collection, view_models_array, {
  sort_attribute: 'name' # optimization to only refresh when this attribute changes
})
```

or

```coffeescript
collection_observable = kb.collectionObservable(collection, view_models_array, {
  sorted_index:    (models, model) -> return _.sortedIndex(models, model, (test) -> return test.get('first_name') + " " + test.get('last_name'))
})
```

or

```coffeescript
collection_observable = kb.collectionObservable(collection, view_models_array, {
  sorted_index:    kb.sortedIndexWrapAttr('name', NameWithNumber)  # or shorthand: kb.siwa
})
```

### Note 2

Collections cache some information on the view model and if you have a view model and want to get access to it, use the following helpers:

* **kb.vmModel** to get the model for a view model

### Note 3

There are some other helpers for collection sync view models that you may find useful:

* **viewModelByModel**: (model) -> ...
* **eachViewModel**: (iterator) -> ...

### Note 4

You can subscribe for events on view models using Backbone.Events

* **'add'**: (view_model, view_models_array) -> ...
or if batch, **'add'**: (view_models_array) -> ...
* **'resort'**: (view_model, view_models_array, new_index) -> ...
or if batch, **'resort'**: (view_models_array) -> ...
* **'remove'**: (view_model, view_models_array) -> ...
or if batch, **'remove'**: (view_models_array) -> ...

Knockback.formattedObservable
-----------------------------
You can format an arbitrary number of arguments in both read and write directions:

```coffeescript
class ContactViewModelFullName extends kb.ViewModel
  constructor: (model) ->
    super(model, {internals: ['first', 'last']})
    @full_name = kb.formattedObservable('Last: {1}, First: {0}', @_first, @_last)

model = new Backbone.Model({first: 'Ringo', last: 'Starr'})
view_model = new ContactViewModelFullName(model)
equal(view_model.full_name(), 'Last: Starr, First: Ringo', "full name is good")

# use a complex formatted string to set multiple attributes at once
view_model.full_name('Last: The Starr, First: Ringo')

equal(view_model.full_name(), 'Last: The Starr, First: Ringo', "full name is good")
equal(model.get('first'), 'Ringo', "first name is good")
equal(model.get('last'), 'The Starr', "last name is good")
```

Knockback.localizedObservable
-----------------------------

This is the most tricky to implement (look in the examples_lib/localized_observables.coffee file for examples). Basically, a value is stored inside this class and is manually synced by a Knockback.observable whenever the model attribute changes since it can point to a new value instance for the same attribute. Here's an example of a read only one:

```coffeescript
class LocalizedStringLocalizer extends kb.LocalizedObservable
  constructor: (value, options, view_model) ->
    super; return kb.wrappedObservable(this)
  read: (value) ->
    return if (value.string_id) then kb.locale_manager.get(value.string_id) else ''
```

### Note 1

This looks like it returns an instance but it actually returns a ko.dependentObservable from super (use kb.wrappedObservable() to access it). Don't get caught out!

### Note 2

If you use these localization helpers, you need to implement a kb.locale_manager.  As mentioned in 1) Note 1....you can watch a non-BackboneModel as long as it: a) mixes in Backbone.Events and triggers 'change' events and b) implements `get: (attribute_name) -> ... ` and which is a minimal Backbone.Model interface... this is just what a Backbone.locale_manager is. Pretty clever, eh?

Knockback.viewModel
-------------------

Although they are only useful for a subset of scenarios, you can automatically create a view model for all of attributes for your model.

Read write observables for each attribute:

```coffeescript
model = new Contact({name: 'Ringo', number: '555-555-5556'})
view_model = kb.viewModel(model)
...
kb.vmRelease(view_model)
```

Read only observables for each attribute:

```coffeescript
model = new Contact({name: 'Ringo', number: '555-555-5556'})
view_model = kb.viewModel(model, {read_only: true})
...
kb.vmRelease(view_model)
```

Derive and specialize a view model Coffeescript class:

```coffeescript
class ContactViewModelCustom extends kb.ViewModel
  constructor: (model) ->
    super(model)
    @formatted_name = ko.dependentObservable(=> return "First: #{@name()}")
    @formatted_number = ko.dependentObservable({
      read: => return "#: #{@number()}"
      write: (value) => @number(value.substring(3)))
    }, this)
    @formatted_date = new LongDateLocalizer(@date)
...
kb.vmRelease(view_model)
```

Specialize using a simple function constructor:

```coffeescript
ContactViewModelCustom = (model) ->
  view_model = kb.viewModel(model)
  view_model.formatted_name = kb.observable(model, {key:'name', read: -> return "First: #{model.get('name')}" })
  return view_model
...
kb.vmRelease(view_model)
```

Dynamically create the observables in an external view model:

```coffeescript
model = new Contact({name: 'Ringo', number: '555-555-5556'})
view_model = {
  something: ko.observable('foo')
}
view_model_instance = kb.viewModel(model, {}, view_model)
...
kb.vmRelease(view_model_instance)
kb.vmRelease(view_model)
```

Stub out an observable if you are not sure if specific attributes will be in the model. If/when the attributes do arrive, the observing had already been established reducing conditional checks.

```coffeescript
class ContactViewModelFullName extends kb.ViewModel
  constructor: (model) ->
    super(model, {requires: ['first', 'last']})
    @full_name = kb.formattedObservable('Last: {1}, First: {0}', @first, @last)

model = new Backbone.Model()
view_model = new ContactViewModelFullName(model)
equal(view_model.full_name(), 'Last: , First: ', "full name is good")

model.set({first: 'Ringo', last: 'Starr'})
equal(view_model.full_name(), 'Last: Starr, First: Ringo', "full name is good")
```

Reassign (and stub out) specific default observable names to _{name} if you plan to use them only as internal, intermediate values. This way you can use your attribute names with advanced logic in your template bindings.

```coffeescript
class ContactViewModel extends kb.ViewModel
  constructor: (model) ->
    super(model, {internals: ['email', 'date']})
    @email = kb.defaultWrapper(@_email, 'your.name@yourplace.com')
    @date = new LongDateLocalizer(@_date)
````

Knockback.defaultWrapper
-----------------------------

You can wrap an observable with a default value to provide a value when it is missing:

```coffeescript
class ContactViewModel extends kb.ViewModel
  constructor: (model) ->
    super(model, {internals: ['email']})
    @email = kb.defaultWrapper(@_email, 'your.name@yourplace.com')

view_model = new ContactViewModel(model)
...
view_model.email.setToDefault()
# or
kb.vmSetToDefault(view_model)
```

Final notes
-----------

* Everything uses a new/destroy lifecycle. You need to destroy everything you create to ensure memory is cleaned up correctly. Some of my examples leave that out rigorous cleanup for understandability, but please don't forget!
    -> Use the helper function: **kb.vmRelease()** to clean up your view models. It traverses all of your observables and destroys the ones it recognizes.

* Knockback.observable, Knockback.observables and Knockback.localizedObservable actually return a ko.dependentObservable with a bound destroy method on it. It you want to subclass your class, look at the source files (like Knockback.Observable) because a little bit of a Coffeescript dance is required to return the right thing from your constructor! (that's what the kb.wrappedObservable() is for)


In addition to the examples in the test folder (https://github.com/kmalakoff/knockback/blob/master/test), you can look at the examples_lib folder for a sample kb.locale_manager, a localized string, and some examples of localized observables.
