###
  knockback_factory.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Factory is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.Factory
  constructor: (path, factory) ->
    @paths = {}

  isEmpty: -> return _.isEmpty(@paths)

  addPathMapping: (path, create_fn) ->
    @paths[path] = create_fn

  addPathMappings: (mappings) ->
    for path, create_info of mappings
      @paths[path] = create_info

  createForPath: (obj, path, store) ->
    options = {store: store, factory: this, path: path}
    create_info = @paths[path]

    return kb.Factory.createDefault(obj, options)   if not create_info            # no create, use default
    return new create_info(obj, options)            if _.isFunction(create_info)  # a constructor
    return create_info.create(obj, options)         if create_info.create         # a function

  @createDefault: (obj, options) ->
    return kb.viewModel(obj, options)                   if obj instanceof Backbone.Model
    return kb.collectionObservable(obj, options)        if obj instanceof Backbone.Collection
    return ko.observable(obj)