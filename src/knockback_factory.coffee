###
  knockback_factory.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Factory is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.Factory
  constructor: (@parent_factory) ->
    @paths = {}

  hasPath: (path) -> return @paths.hasOwnProperty(path) or (@parent_factory and @parent_factory.hasPath(path))

  addPathMapping: (path, create_info) ->
    @paths[path] = create_info

  addPathMappings: (mappings) ->
    for path, create_info of mappings
      @paths[path] = create_info

  creatorForPath: (obj, path) ->
    creator = @paths[path]; return creator if creator
    if @parent_factory
      creator = @parent_factory.creatorForPath(obj, path); return creator if creator

    # use defaults
    return kb.ViewModel                   if obj instanceof Backbone.Model
    return kb.CollectionObservable        if obj instanceof Backbone.Collection
    return null

  createForPath: (obj, path, store, creator) ->
    creator = @creatorForPath(obj, path)   if not creator # hasn't been looked up yet
    return ko.observable(obj)              if not creator # an observable
    return new creator(obj, {store: store, factory: this, path: path, creator: creator})            if typeof(creator) == 'function'  # a constructor
    return creator.create(obj, {store: store, factory: this, path: path, creator: creator})         if creator.create                 # a function
    throw "unrecognized creator for #{path}"

  @createDefault: (obj, options) ->
    return kb.viewModel(obj, options)                   if obj instanceof Backbone.Model
    return kb.collectionObservable(obj, options)        if obj instanceof Backbone.Collection
    return ko.observable(obj)
