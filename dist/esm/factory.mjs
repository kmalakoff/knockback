/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */ /*
  knockback.js 1.2.3
  Copyright (c)  2011-2016 Kevin Malakoff.
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
  Source: https://github.com/kmalakoff/knockback
  Dependencies: Knockout.js, Backbone.js, and Underscore.js (or LoDash.js).
  Optional dependencies: Backbone.ModelRef.js and BackboneORM.
*/ let kb;
const { _ } = kb = require('./kb');
// Used to share the hierachy of constructors and create functions by path to allow for custom creation per Model attribute.
//
// @example Create an instance by path.
//   var factory = new kb.Factory();
//   factory.addPathMapping('bob.the.builder', kb.ViewModel);
//   view_model = factory.createForPath(new Backbone.Model({name: 'Bob'}), 'bob.the.builder'); // creates kb.ViewModel
kb.Factory = class Factory {
    // Used to either register yourself with the existing factory or to create a new factory.
    //
    // @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
    // @option options [Object] factories a map of dot-deliminated paths; for example 'models.owner': kb.ViewModel to either constructors or create functions. Signature: 'some.path': function(object, options)
    // @param [Instance] obj the instance that will own or register with the store
    // @param [String] owner_path the path to the owning object for turning relative scoping of the factories to absolute paths.
    static useOptionsOrCreate(options, obj, owner_path) {
        // share
        if (options.factory && (!options.factories || options.factories && options.factory.hasPathMappings(options.factories, owner_path))) {
            return kb.utils.wrappedFactory(obj, options.factory);
        }
        // create a new factory
        const factory = kb.utils.wrappedFactory(obj, new kb.Factory(options.factory));
        if (options.factories) {
            factory.addPathMappings(options.factories, owner_path);
        }
        return factory;
    }
    hasPath(path) {
        return this.paths.hasOwnProperty(path) || (this.parent_factory != null ? this.parent_factory.hasPath(path) : undefined);
    }
    addPathMapping(path, create_info) {
        return this.paths[path] = create_info;
    }
    addPathMappings(factories, owner_path) {
        for(var path in factories){
            var create_info = factories[path];
            this.paths[kb.utils.pathJoin(owner_path, path)] = create_info;
        }
    }
    hasPathMappings(factories, owner_path) {
        let all_exist = true;
        for(var path in factories){
            var existing_creator;
            var creator = factories[path];
            all_exist &= (existing_creator = this.creatorForPath(null, kb.utils.pathJoin(owner_path, path))) && creator === existing_creator;
        }
        return all_exist;
    }
    // If possible, creates an observable for an object using a dot-deliminated path.
    //
    // @example Create an instance by path.
    //   var factory = new kb.Factory();
    //   factory.addPathMapping('bob.the.builder', kb.ViewModel);
    //   view_model = factory.createForPath(new Backbone.Model({name: 'Bob'}), 'bob.the.builder'); // creates kb.ViewModel
    creatorForPath(obj, path) {
        let creator;
        if (creator = this.paths[path]) {
            return creator.view_model ? creator.view_model : creator;
        }
        if (creator = this.parent_factory != null ? this.parent_factory.creatorForPath(obj, path) : undefined) {
            return creator;
        }
        return null;
    }
    constructor(parent_factory){
        this.paths = {};
        if (parent_factory) {
            this.parent_factory = parent_factory;
        }
    }
};
