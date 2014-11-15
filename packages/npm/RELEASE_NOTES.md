Please refer to the following release notes when upgrading your version of Knockback.js.

## 0.20.5
* Additional check for a collection updating during release.

## 0.20.4
* Compatibility fix for IE9.

## 0.20.3
* Bug fix for kb.CollectionObservable storage.

## 0.20.2
* Passed the context from the rendered nodes to the wrapper in kb.renderTemplate.
* Attached an array of elements to a new node in kb.applyBindings and returned a single node.
* Bug fix for attribute named url: # https://github.com/kmalakoff/knockback/issues/134

## 0.20.1
* Generalized kb.CollectionObservable to take a variable number of options.

## 0.20.0
* Bug fix for shared view models: https://github.com/kmalakoff/knockback/issues/113. You will now get warnings if you try to change a model on a shared ViewModel.
* Added variants for creating a Collection Observable: kb.collectionObservable(YourViewModel), kb.collectionObservable(YourViewModel, options), kb.collectionObservable(new YourCollection(), YourViewModel, options)
* Fixed full- and core-stack versions for not pulling in production version of Knockout.

## 0.19.4
* Bug fix for extracting a Model when setting by kb.ViewModel and to extract a Collection when setting by kb.CollectionObservable.

## 0.19.3
* Tested Knckout 3.2 and updated component.io reference to kmalakoff/knockout for latest.

## 0.19.2
* Fixed childNodes skipping comments in kb.renderTemplate.
* Fixed comments: https://github.com/kmalakoff/knockback/issues/128

## 0.19.1
* BREAKING API CHANGE: kb.observable now splits share options out to the second parameter to give a new signature: kb.observable(model, key, share_options, view_model)
* BREAKING API CHANGE: kb.ViewModel::mapObservables is now aliased to kb.ViewModel::createObservables. Also, kb.ViewModel::createObservables now respected the excludes option. Use kb.observable(model, key_or_options, share_options, vm) to manually add observables to a view model.
* Removed support for Knockout version < 2.1.0.
* Patched Knockout extend to release observables: https://github.com/kmalakoff/knockback/issues/124
* Fixed event emitter not being updated when model changed: https://github.com/kmalakoff/knockback/issues/108
* Fixed defaults considering 0 as empty: https://github.com/kmalakoff/knockback/issues/114
* Fixed setting array attribute to null: https://github.com/kmalakoff/knockback/issues/103
* Fixed events being cleaned up: https://github.com/kmalakoff/knockback/issues/101
* Fixed dynamic adding of keys: https://github.com/kmalakoff/knockback/issues/121
* Added kb.configure to manually set the ORM solution: kb.configure({orm: 'backbone-relational'}). Knockback will try to infer the ORM solution of your choice, but if it is not loaded before Knockback, you can select it manally.

## 0.19.0
* Removed standalone plugins. Just choose knockback if you need one or more plugins.
* Change library building to use webpack.
* Avoid creating dependencies in collectionObservable's destroy: https://github.com/kmalakoff/knockback/pull/120
* Improved server support (Node.js tested with jsdom)

## 0.18.6
* Put AMD loader first due to webpack imcompatibity

## 0.18.5
* Fix for memory leak: https://github.com/kmalakoff/knockback/pull/110

## 0.18.4
* fixed failed npm publish

## 0.18.3
* made safe to run on Node.js

## 0.18.2
* added auto_compact option for collection paging to regenerate observables on collection reset
* exposed kb.ViewModel's createObservables and mapObservables functions for manual use

## 0.18.1
* bugfix for missing binding of this pointer on custom read method

## 0.18.0
* BREAKING CHANGE: filter is now consistent with underscore.js (it was opposite previously where filter true meant remove instead of keep)
* BREAKING CHANGE: knockback component libraires are now without the 'knockback-' infront of them. For example, lib/knockback-defaults.js is now lib/defaults.js
* BREAKING CHANGE: removed window.Knockback symbol publishing (now only window.kb is supported).
* kb.ViewModel, kb.CollectionObservable, and kb.Observable are now guaranteed to not create observable dependencies when you set their properties
* options merging: automate the merging of options including 'internals', 'requires', 'excludes', 'keys', 'factories', 'statics', 'staticDefaults'
* improved AMD module loading support: https://github.com/kmalakoff/knockback/pull/80
* kb.collectionObservable: added automatic creation of a collection is one isn't passed or if an array is passed since you can reference it using collection() on the observable
* bug fix for findOrCreate refering to incorrect class
* updated tests for latest libraries (Knockout 3.0.0, Backbone 1.1.0, Underscore 1.5.2, LoDash 2.3, and BackboneRelational 0.8.6)
* added 'sort' collection message in addition to 'resort'
* bug fix for removed model: https://github.com/kmalakoff/knockback/issues/87
* added statics and static_defaults: kb.viewModel(model, {statics: ['name'], staticDefaults: {name: '(no name)'}})

## 0.17.2

* auto-disable RECUSIVE_AUTO_INJECT flags (default disabled) until investigated: https://github.com/kmalakoff/knockback/issues/63
* bug fix for relational release in EventWatcher

## 0.17.1

* reduce the destructiveness of kb.release (and speed it up too): https://github.com/kmalakoff/knockback/issues/48
* enable recursive auto inject using RECUSIVE_AUTO_INJECT flags (default enabled): https://github.com/kmalakoff/knockback/issues/63
* allow kb.CollectionObservable options for internals, excludes, and requires be either arrays or individual strings

## 0.17.0

* added kb.wasReleased helper function
* bug fix for recursive view model create: https://github.com/kmalakoff/knockback/issues/53
* added support for Parse framework (no-AMD support): https://github.com/kmalakoff/knockback/issues/51
* bug fix for nested filter dependencies: https://github.com/addyosmani/todomvc/issues/381
* bug fix for filtering notifications: https://github.com/kmalakoff/knockback/issues/53
* bug fix for models_only on change event: https://github.com/kmalakoff/knockback/issues/59
* added support for Backbone 1.0.0. Note: needed to patch Backbone-relational to 0.8.0plus and to add _.findWhere to lodash.
* added automatic call of afterRender on a view model in kb.renderTemplate unless afterRender is also provided in the options (to avoid multiple calls).

## 0.16.8

* updated knockback-full-stack for latest Underscore.js, Backbone.js, and Knockout.js
* bugfix for viewModelByModel if the ViewModel has not yet been initialized
* removed legacy functionality that had been previously warned for removal: kb.utils.release, kb.renderAutoReleasedTemplate, ko.defaultWrapper, kb.CollectionObservable::sorted_index/sortedIndex

## 0.16.7

* replaced `sortedIndex` by `comparator` for sorting a kb.collectionObservable
* added extensibility to knockback-validation.js through data-bind on input elements. Added $enabled and $disabled and renamed internal helpers ($error_count, $valid, and $active_error) with '$' prefix.
* published filters function on kb.CollectionObservable.
* added stricted checking for compatible type setting on a kn.CollectionObservable's ko.observableArray.
* added kb.utils.hasModelSignature and kb.utils.hasCollectionSignature to simplify signature checking.
* added an event selector to kb.EventWatcher so multiple events could be bound at the same time.
* made the kb.ModelWatcher into a general-purpose kb.EventWatcher so it could also watch collection events.
* bug fix: added dispose of kb.CollectionObservable _mapping
* bug fix: implemented general-purpose basic object test

### Deprecations

* **ko.collectionObservable `sortedIndex` has been replaced by `comparator` so you can resort in custom ways rather than reducing the sorting down to an index.

## 0.16.6

* bug fix: ko.obseravbleArray not created for simple array attribute types ([issue #45](https://github.com/kmalakoff/knockback/issues/45))

## 0.16.5

* renamed kb-app to kb-inject and kb.injectApps to kb.injectViewModels to better reflect the general nature of the injection mechanism: expanded the flexibilty and use cases for data-bind 'inject' amd kb-inject: use 'new' on the  for functions to permit class hierachies to be used and recursively resolving view_model or create within the binding cycle.
* **afterBinding and beforeBinding**: put into a special options property to simplify the kb-inject attribute syntax (eg. no need to specify view_model: for the properties to seed your view model with) and allow to be included on the view_model
* bug fix: fixed case where kb.injectViewModels (formerly kb.injectApps) could be called before page scripts loaded.
* bug fix: fixed case where kb.Observable set 0 to null (issue 44).
* added headers to all components and stack versions.
* added AMD loader to all components.

## 0.16.4

* path release: incorrect version displayed in headers (was 0.16.2 instead of 0.16.3) and missing files from NuGet package.

## 0.16.3

* **kb-app injection bugfix**: fixed 'NOT_FOUND_ERR: DOM Exception 8 error' (chrome warning) when app is bound multiple times.
* **increased factory sharing**: reduced the factory nesting through more aggressive sharing

## 0.16.2

* **major changes to kb.CollectionObservable**: added support for observable mappings (sort_attribute, sorted_index_fn and filters), removed defer, removed optional collection reference counting, removed Backbone.Events (use ko.subscription instead, removed wrappedObject in the collection).

* **added app and view_model injection**: you are now able to inject an application using a kb-app attribute on a dom element and inject into a view model using an 'inject' data-bind attribute.

* **added validators**: you can use kb.valueValidator, kb.inputValidator, or kb.formValidator to add validations. Currently only the following are support: 'required', 'url', 'number', 'email' and you can extend by adding properties to kb.validators

### Deprecations

* **ko.renderAutoReleasedTemplate replaced by kb.renderTemplate**: reduced verbosity

## 0.16.1

* renamed kb.DefaultWrapper to kb.DefaultObservable to provide consistency with classes that return a ko.observable or ko.observableAray instead of 'this' from constructor.


## 0.16.0

* **added 2-way sync to kb.CollectionObservable**: now supports Knockout.js options and selectedOptions view model setting ([issue #37](https://github.com/kmalakoff/knockback/issues/37))

* **simplified and improved memory management**: all reference counting has been removed by using paths and create comparisons in the kb.Store for shared ViewModels. Please take a  look at the [Knockback Reference App](kmalakoff.github.com/knockback-reference-app) for memory profiling tests in the Demo Mode -> Statistics menu.

* **improved consistency in nested kb.ViewModels**: now all nested observables created both by create functions and constructor are guaranteed to be wrapped in ko.observable ([issue #28](https://github.com/kmalakoff/knockback/issues/28)). Please note: iterating over the view models in a kb.CollectionObservable still return the unwrapped view model.

* **merged functionality from kb.AttributeConnector into kb.Observable**: including generating the correct attribute observable type (ko.observable, ko.observableArray, kb.ViewModel, kb.CollectionObservable, or custom through the 'factories' create option) based on the attribute value type. You can get access to the underlying observable using value().

* **merged functionality from kb.Observables into kb.ViewModel**: including bulk mode [key1, key2, key3], mapping to an alternative ViewModel, providing options to specific observables {key1: {default: '(missing)'}, key2: {}}, etc. See [options](http://kmalakoff.github.com/knockback/doc/classes/kb/ViewModel.html#constructor-instance) for information on all of the options.

* **kb.release now handles arrays**: you can release an array of observables/ViewModels like:

```
var array = [kb.viewModel(model1), kb.collectionObservable(collection1)];
...
kb.release(array);
```

* **made it possible to derive from kb.CollectionObservable**: use can use CoffeeScript inheritance or the JavaScript 'extend' class method. Be careful to return the ko.collectionArray from the constructor instead of the 'this'.

```
window.ThingCellCollectionObservable = kb.CollectionObservable.extend({
  constructor: function(collection, options) {
    // return ko.observableArray instead of 'this'
    return kb.CollectionObservable.prototype.constructor.call(this, collection, {
      view_model: ThingCellViewModel,
      options: options
    });
  }
});

// OR
window.ThingCellCollectionObservable = kb.CollectionObservable.extend({
  constructor: function(collection, options) {
    kb.CollectionObservable.prototype.constructor.call(this, collection, {
      view_model: ThingCellViewModel,
      options: options
    });

    // return ko.observableArray instead of 'this'
    return kb.utils.wrappedObservable(this);
  }
});

```

* **added 'models_only' option to kb.CollectionObservable**: rather than deducing whether ViewModels should be created for a kbCollectionObservable, now you must explicitly state that you would only like models to be created or else a default kb.ViewModel will be created for each model.

* **added 'filters' option to kb.CollectionObservable**: now in addition to per-collection observable sorting, you can also filter a collection independent of the Backbone.Collection.

* **added factories option to kb.CollectionObservable and kb.ViewModel**: you can specify a constructor, create function, or models_only flag for a path. For example:

```
var view_model = {
  kb_view_models: kb.collectionObservable(collection),
  no_view_models: kb.collectionObservable(collection, { factories: {
    'models': { models_only: true }
  }}),
  nested_different: kb.collectionObservable(collection, { factories: {
    'models': PersonViewModel
    'models.friends.models': FriendViewModel
  }}),
  created: kb.collectionObservable(collection, { factories: {
    'models': { create: function(model, options) { return new ContactViewModelDate(model, options); } }
  }}),
  heterogenous_created: kb.collectionObservable(collection, { factories: {
    'models': { create: function(model, options) {
      return model.get('style') === 'Cool') ?
        CoolViewModel(model, options) :
        kb.viewModel(model, options);
    } }
  }})
};
```

* **added convention for linking the lifecycle of DOM nodes and ViewModels**: added the following functions to auto release nodes when their element is removed using ko.removeNode(el):

```
kb.releaseOnNodeRemove(view_model, node) -> binds kb.release to be called when ko.removeNode is called on the node.

kb.renderAutoReleasedTemplate(template_name, view_model, options) -> renders a template and binds auto-release to the template node

kb.applyBindings(view_model, node) -> applies bindings and binds auto-release to the node
```

* **added support for attribute changing types**: if you use kb.ViewModel or kb.Observable, when a Backbone.Model's attribute changes type, the corresponding observable will change types too.

```
var model = new Backbone.Model({reused: null});
var view_model = kb.viewModel(model);
kb.utils.valueType(view_model.reused); // kb.TYPE_SIMPLE

model.set({reused: new Backbone.Model()});
kb.utils.valueType(view_model.reused); // kb.TYPE_MODEL
```

* **added support for recursive options.options**: rather than requiring manual merging of options when you derive from kb.ViewModel and kb.CollectionObservable, you can pass options as a property on the options:

```
var HouseViewModel = kb.ViewModel.extend({
  constructor: (model, options) ->
    kb.ViewModel.prototype.constructor.call(this, model, {factories: {
      'occupants.models': PersonViewModel
    }, options: options});
})
```

* **added shareOptions helper to share a store**: both kb.ViewModel and kb.CollectionObservable use a kb.Store and kb.Factory to share ViewModels for breaking potential-recursive Model cycles. You can use the shareOptions() to increase the sharing with new kb.ViewModels and kb.CollectionObservables.

```
var collection = new Backbone.Collection([model1, model2, model3]);
var co1 = ko.collectionObservable(collection)
var co2 = ko.collectionObservable(collection, co1.shareOptions()); // view models ail be shared across collection observables.
```

* **added kb.ModelWatcher to provide an Backbone.Events hub**: rather than registering a new event handler for each observable, you and kb.ViewModel shares the event handler registration. Also, the kb.Statistics manager can optionally be used to track all Backbone.Model events intercepted and handled.

* **upgraded kb.Statistics**: now you can optionally track detailed statistics on kb.ViewModels and kb.CollectionObservables in memory, and on Backbone.Events triggered. See the [API docs](http://kmalakoff.github.com/knockback/doc/classes/kb/Statistics.html) for information or [Knockback Reference App](kmalakoff.github.com/knockback-reference-app) for a usage example.

* **added kb.utils.wrappedObject**: added utility that can be used to get/set an underlying object that an observable or ViewModel is wrapping. For example, a kb.CollectionObservable wraps a collection and a kb.ViewModel wraps a Backbone.Model or Backbone.ModelRef. For a ViewModel, this is similar to kb.utils.wrappedModel except that kb.utils.wrappedModel will return the wrapper if the model doesn't exist which is important simplifying code when iterating over the Models or ViewModels stored in a kb.CollectionObservable.

* **kb.utils.wrappedStore**: added utility to get a store of ViewModels to share them between observables (for [Relational Models](http://kmalakoff.github.com/knockback/tutorial_relational_models.html), selectedOptions, manually sharing ViewModels in custom create functions, etc).

```
collection_observable = kb.collectionObservable(new Backbone.Collection())
collection_observable_shared = kb.collectionObservable(new Backbone.Collection(), {store: kb.utils.wrappedStore(collection_observable)})
```
* **added path functions to assist with factories**: you can use kb.utils.pathJoin(path1, path2) and kb.utils.optionsPathJoin(options, path) to combine dot-delimited paths.


### Required changes

* **replace kb.utils.release with kb.release**: simplified the naming of this common function.

* **kb.ViewModel and kb.CollectionObservable options**: view_model_create(model), create(model, key), children have been replaced by the mappings options as explained above. This change was made to simplify and standardize the way to override custom ViewModels. You will need to use mappings + paths + one of 'constructor' or 'create: function(model, options)' or 'models_only: true' as demonstrated above.

* **kb.CollectionObservable explicit models_only**: previously, if you did not specify a view_model for your collection, the kb.CollectionObservable stored models instead of ViewModels. Now you must explicitly pass the models_only option. This change was made to provide better default behavior for nested collections meaning a kb.ViewModel is automatically created for each nested Model unless otherwise specified.

```
var collection_observable = kb.collectionObservable(collection, {models_only: true});
```

* **custom factories for nested models**: if you were using 'view_model_create' or 'children' for specifying view models for nested models, you need to replace them with the 'factories' options as follows:

```
var view_model = kb.viewModel(model, {
  factories: {
    'friends.models': FriendViewModel,
    'friends.models.friends.models': FriendViewModel
  }
});
```

* **kb.observables keys now an option**: besides changing all your references to kb.viewModel, if you were using a keys array, you need to map it to 'keys' or 'requires' options:

```
// WAS
kb.observables(model, ['key1', 'key2']);

// IS NOW
kb.viewModel(model, {keys: ['key1', 'key2']});

```


### Deprecations

* **replaced kb.utils.release with kb.release**: simplified the naming of this common function.

* **read_only and write option removed**: should be handled by binding logic instead (this parameter will be ignored)

* **kb.utils.observableInstanceOf removed**: has been replaced by kb.utils.valueType which can be used to determine what type of value an observable is wrapping.

* **kb.observables deprecated**: the functionality has been merged into [kb.ViewModel](http://kmalakoff.github.com/knockback/doc/classes/kb/ViewModel.html).

* **removed kb.RefCountable**: upgraded the kb.Store to not require reference counting to track observables so reference counting has been removed from kb.ViewModel and kb.CollectionObservable.

* **merged kb.AttributeConnector functionality into kb.Observable**: use kb.Observable instead.

* **nested model 'view_model_create' and 'children' factories replaced with constructor option factories**: see above.


## 0.15.0
* **kb.collectionObservable no longer triggers changes when model attributes change** (only when the list of models is modified) to reduce regenerating view models when an embedded model changes

* **added kb.utils**: utility functions have been moved to kb.utils to be more consistent with Knockout. See [kb.utils](http://kmalakoff.github.com/knockback/docs_kb_utils.html)

* **kb.LocalizedObservable now uses Backbone.extend**: now JavaScript inheritance is possible so read/write options have been deprecated

* **kb.ViewModel now handles nested models** (like self-referencing Backbone-Relational.js models). **Related tutorials**: [Relational Models](http://kmalakoff.github.com/knockback/tutorial_relational_models.html) [kb.ViewModel](http://kmalakoff.github.com/knockback/tutorial_kb_view_model.html)

```
var Person = Backbone.RelationalModel.extend({
  relations: [{
    type: Backbone.HasMany,
    key: 'friends',
    relatedModel: Person
  }]
});

var john = new Person({
  id: 'person-1',
  name: 'John',
  friends: ['person-2']
});
var paul = new Person({
  id: 'person-2',
  name: 'Paul',
  friends: ['person-1']
});

var john_view_model = kb.viewModel(john);

var friend_view_model = john_view_model.friends()[0];
kb.utils.wrappedModel(friend_view_model);                     // paul
kb.utils.wrappedModel(friend_view_model.friends()[0]);        // john
```

* **kb.CollectionObservable is now a ko.observableArray**: you no longer need to supply the second parameter

```
// WAS:
var view_model = {
  property: ko.observableArray()
  collection_observable: kb.collectionObservable(collection, observable_array, options)
};

var view_model;
for (var i = 0, len = view_model.property().length; i < len; i++) {
  view_model = view_model.property()[i];
  ...
}

// IS NOW:
var view_model = {
  property: kb.collectionObservable(collection, options)
};

var view_model;
for (var i = 0, len = view_model.property().length; i < len; i++) {
  view_model = view_model.property()[i];
  ...
}
```

### Required changes

* **kb.collectionObservable no longer triggers changes when model attributes change** so if you need to respond to embedded model changes (that cannot be handled by their view models directly), manually register for the changes like: `collection.bind('change', function(){ collection_observable.valueHasMutated(); });`
* **kb.collectionObservable is now a ko.observableArray** so remove the second parameter which used to contain the ko.observableArray

### Deprecations

* **kb.utils.wrappedObservable(instance {, observable})** replaces **Knockback.wrappedObservable(instance)**

* **kb.utils.wrappedModel(view_model {, observable})** replaces **Knockback.viewModelGetModel(view_model)** and **Knockback.vmModel(view_model)**

* **kb.utils.release(obj)** replaces **Knockback.vmRelease(view_model)** and **Knockback.vmReleaseObservable(observable)**

*  was replaced by kb.utils.release(obj)

* **kb.LocalizedObservable now uses Backbone.extend** for JavaScript inheritance so replace all options with inheritance:

```
var MyLocalizer = kb.LocalizedObservable.extend({
  constructor: function(value, options, view_model) {
    kb.LocalizedObservable.prototype.constructor.apply(this, arguments);
    return kb.utils.wrappedObservable(this);
  },
  read: function(value) {
    # return something
  },
  write: function(localized_string, value) {
    # do something
  }
});
```
