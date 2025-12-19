![logo](https://github.com/kmalakoff/knockback/raw/master/media/logo.png)

Knockback.js provides Knockout.js magic for Backbone.js Models and Collections.

## Why Knockback?

* Make amazingly dynamic applications by applying a small number of simple principles
* Leverage the wonderful work from both the Backbone and Knockout communities
* Full TypeScript support with type definitions included

## Installation

```bash
npm install knockback
```

### Peer Dependencies

Knockback requires these peer dependencies:

```bash
npm install backbone knockout underscore
```

## Examples

### Simple

**The HTML:**

```html
<label>First Name: </label><input data-bind="value: first_name, valueUpdate: 'keyup'" />
<label>Last Name: </label><input data-bind="value: last_name, valueUpdate: 'keyup'" />
```

**And...engage:**

```typescript
import Backbone from 'backbone';
import ko from 'knockout';
import { viewModel } from '@mcpeasy/knockback';

const model = new Backbone.Model({ first_name: 'Bob', last_name: 'Smith' });
ko.applyBindings(viewModel(model));
```

When you type in the input boxes, the values are properly transferred bi-directionally to the model and all other bound view models!


### Advanced

**The View Model:**

```typescript
import Backbone from 'backbone';
import ko from 'knockout';
import { viewModel, release } from '@mcpeasy/knockback';

// Create a model
const model = new Backbone.Model({ first_name: 'Bob', last_name: 'Smith' });

// Create a view model with a computed property
const vm = viewModel(model) as Record<string, ko.Observable>;
const full_name = ko.computed(() => `${vm.first_name()} ${vm.last_name()}`);

// Apply bindings
ko.applyBindings({ ...vm, full_name });

// ... do stuff then clean up
release(vm);
```

**The HTML:**

```html
<h1 data-bind="text: 'Hello ' + full_name()"></h1>
<label>First Name: </label><input data-bind="value: first_name, valueUpdate: 'keyup'" />
<label>Last Name: </label><input data-bind="value: last_name, valueUpdate: 'keyup'" />
```

Now, the greeting updates as you type!


## API

### Core Functions

- `observable(model, key, options?)` - Create an observable bound to a model attribute
- `viewModel(model, options?)` - Create observables for all model attributes
- `collectionObservable(collection, options?)` - Create an observable array bound to a collection
- `release(obj)` - Release a view model or observable and all its resources

### Plugins

- `defaultObservable(observable, defaultValue)` - Provide default values
- `formattedObservable(format, ...args)` - Two-way string formatting
- `localizedObservable(value, options)` - Locale-aware observables
- `triggeredObservable(emitter, event)` - Event-based observable updates
- `valueValidator(observable, validators)` - Value validation

## Documentation

* [Website](http://kmalakoff.github.com/knockback/) - explore everything Knockback
* [API Docs](http://kmalakoff.github.com/knockback/doc/index.html) - dig into the API

## Dependencies

* [Backbone.js](http://backbonejs.org/) - provides the Model layer
* [Knockout.js](http://knockoutjs.com/) - provides the ViewModel layer foundations
* [Underscore.js](http://underscorejs.org/) - provides JavaScript utilities

## Contributing

To build the library:

```bash
npm run build
```

To run tests:

```bash
npm test
```

## License

MIT
