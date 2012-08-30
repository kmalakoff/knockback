###
  knockback_factory.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Factory is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.Factory
  @useOptionsOrCreate: (options, obj, owner_path) ->
    if options.factory and not options.factories # reuse
      factory = kb.utils.wrappedFactory(obj, options.factory)
    else
      factory = kb.utils.wrappedFactory(obj, new kb.Factory(options.factory))
    factory.addPathMappings(options.factories, owner_path) if options.factories
    return factory

  constructor: (@parent_factory) ->
    @paths = {}

  hasPath: (path) -> return @paths.hasOwnProperty(path) or (@parent_factory and @parent_factory.hasPath(path))

  addPathMapping: (path, create_info) ->
    @paths[path] = create_info

  addPathMappings: (factories, owner_path) ->
    for path, create_info of factories
      @paths[kb.utils.pathJoin(owner_path, path)] = create_info
    @

  creatorForPath: (obj, path) ->
    if (creator = @paths[path])
      return if creator.view_model then creator.view_model else creator
    if @parent_factory
      return creator if (creator = @parent_factory.creatorForPath(obj, path))
    return null