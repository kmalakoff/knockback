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

## Knockback

* [Development version][1]
* [Production version][2]

[1]: https://github.com/kmalakoff/knockback/raw/master/knockback.js
[2]: https://github.com/kmalakoff/knockback/raw/master/knockback.min.js

You also will need to use my slightly modified copies of Knockout until the changes are merged into the main branch:

## Knockout 1.2.1

* [Development version][3]
* [Production version][4]

[3]: https://github.com/kmalakoff/knockback/raw/master/knockout-1.2.1.debug-kmalakoff.js
[4]: https://github.com/kmalakoff/knockback/raw/master/knockout-1.2.1-kmalakoff.js

## Knockout 1.3.beta

* [Development version][5]
* [Production version][6]

[5]: https://github.com/kmalakoff/knockback/raw/master/knockout-1.3.beta.debug-kmalakoff.js
[6]: https://github.com/kmalakoff/knockback/raw/master/knockout-1.3.beta-kmalakoff.js


When I was evaluating client-side frameworks, I liked lots of the pieces, but wanted to "mix and match" the best features. I started with [Backbone.js](http://documentcloud.github.com/backbone/) and really loved the Models and Collections, and used [Brunch](http://brunch.io/) to get me up and running quickly.

After a while, I found the view coding too slow so I wrote [Mixin.js](https://github.com/kmalakoff/mixin) to extract out reusable aspects of my views. When I was looking for my next productivity increase, an ex-work colleague suggested [Sproutcore](http://www.sproutcore.com/), but at the time, it wasn't yet micro-frameworky enough meaning I would need to learn something big and "to throw the baby out with the bathwater" as they say (it is hard to give up Backbone models and collections!). Then, I discovered [Knockout](http://knockoutjs.com/) and knew it was for me!

Knockout provided just the right building blocks for a layer between my templates and data. As I used it more, I built additional functionality like [Backbone.ModelRefs](https://github.com/kmalakoff/backbone-modelref) for lazy model loading, localization helpers for truly dynamic views, and most recently, an easier way to sync collections and their model's view models.

So here it is...the refactored and shareable version of my Backbone bindings for Knockout: Knockback.js

Enjoy!

Kevin


PS: check out the jsFiddle that demonstrates dynamic localization: http://jsfiddle.net/kmalakoff/QSkpv/


An Example
----------

### The view model:

```coffeescript
ContactViewModel = (model) ->
  kb.observables(model, {
    name:     {key:'name'}
    email:    {key:'email', write: true, default: 'your.name@yourplace.com'}
    date:     {key:'date', write: true, localizer: (value) => return new LongDateLocalizer(value)}
  }, this)
  return this
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

# and cleanup after yourself when you are done. We'll try to get rid of this step: https://github.com/kmalakoff/knockback/issues/2
kb.vmDestroy(view_model)
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

1. **Knockback.observables and Knockback.observable**:
   These are the foundations for watching model attributes for one and two-way changes. The pluralized form provides a short-hand for multiple attributes like in the above example.

### Note 1

You can watch a non-BackboneModel as long as it: a) mixes in Backbone.Events and triggers 'change' and/or "change:#{attribute_name}" events and b) implements "get: (attribute_name) -> return something". This simplified Backbone.Model API is the same interface as is needed for your implementation of kb.locale_manager:

```coffeescript
kb.observables(kb.locale_manager, {
  label_title_new:    { key: 'label_title_new' },
  label_button_new:   { key: 'label_button_new' },
  label_name:         { key: 'label_name' },
  label_email:        { key: 'label_email' },
  label_date:         { key: 'label_date' }
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
  date:     {key:'date', write: true, localizer: (value) => return new LongDateLocalizer(value)}
}, this)
```

### Note 4

You can also watch a Backbone.ModelRef instead of a Backbone.Model. What is a Backbone.ModelRef do you ask? It is the combination of a collection and a model id that tells you when it is loaded and unloaded (https://github.com/kmalakoff/backbone-modelref). That way, you can start rendering views on a page while the models are loading. If the model unloads, the default behavior is to retain the last value, but you can force a refresh on unload using attribute_observable.forceRefresh():

* If the model reference gets unloaded and you want to restore the default values, you can call forceRefresh on either Knockback.observables or Knockback.observable, and they will restore the defaults. The assumption is that normally, keeping the old values is a desired behavior.


Knockback.CollectionSync
------------------------

This takes a ko.observableArray and makes sure it stays in sync and sorted with a collection. You need to at minimum provide a "viewModelCreate: (model) -> return new myViewModel(model)" function which can return an instance of a class or can be a plain old Javascript object. The important thing is that the view model you provide should be unique per instance of your model or else the "behavior is not guaranteed".

```coffeescript
kb.collectionSync(collection, view_models_array, {
  viewModelCreate: (model) -> return new ContactViewModel(model)
})
```

### Note 1

You can either have the collection sort for you (eg. using a Backbone.Collection "comparator") or you can provide your own sorting methods that are decoupled from the collection like:

```coffeescript
collection_sync = kb.collectionSync(collection, view_models_array, {
  sort_attribute: 'name' # optimization to only refresh when this attribute changes
  sortedIndex:    (models, model) -> _.sortedIndex(models, model, (test) -> test.get('name'))
})
```

### Note 2

Collections cache some information on the view model and if you have a view model and want to get access to it, use the following helpers:

* **kb.vmModel** to get the model for a view model
* **kb.vmElement** to get the rendered element from Knockout for a view model

### Note 3
There are some other helpers for collection sync view models that you may find useful:

* **modelByViewModel**: (view_model) -> ...
* **viewModelByModel**: (model) -> ...
* **elementByModel**: (model) -> ...
* **eachViewModel**: (iterator) -> ...


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


Final notes
-----------

* Everything uses a new/destroy lifecycle. You need to destroy everything you create to ensure memory is cleaned up correctly. Some of my examples leave that out rigorous cleanup for understandability, but please don't forget!
    -> Use the helper function: kb.vmDestroy() to clean up your view models. It traverses all of your observables and destroys the ones it recognizes.
    -> I'm hoping to change this: https://github.com/kmalakoff/knockback/issues/2

* Knockback.observable, Knockback.observables and Knockback.localizedObservable actually return a ko.dependentObservable with a bound destroy method on it. It you want to subclass your class, look at the source files (like Knockback.observable) because a little bit of a Coffeescript dance is required to return the right thing from your constructor! (that's what the kb.wrappedObservable() is for)


In addition to the examples in the test folder (https://github.com/kmalakoff/knockback/blob/master/test), you can look at the examples_lib folder for a sample kb.locale_manager, a localized string, and some examples of localized observables.
