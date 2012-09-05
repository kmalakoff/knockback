###
  knockback_factory.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Factory is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

# Used to share the hierachy of constructors and create functions by path to allow for custom creation per Model attribute.
#
# @example Create an instance by path.
#   var factory = new kb.Factory();
#   factory.addPathMapping('bob.the.builder', kb.ViewModel);
#   view_model = factory.createForPath(new Backbone.Model({name: 'Bob'}), 'bob.the.builder'); // creates kb.ViewModel
class kb.Factory

  # Used to either register yourself with the existing factory or to create a new factory.
  #
  # @param [Object] options please pass the options from your constructor to the register method. For example, constructor(model, options)
  # @option options [Object] factories a map of dot-deliminated paths; for example 'models.owner': kb.ViewModel to either constructors or create functions. Signature: 'some.path': function(object, options)
  # @param [Instance] obj the instance that will own or register with the store
  # @param [String] owner_path the path to the owning object for turning relative scoping of the factories to absolute paths.
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

  # If possible, creates an observable for an object using a dot-deliminated path.
  #
  # @example Create an instance by path.
  #   var factory = new kb.Factory();
  #   factory.addPathMapping('bob.the.builder', kb.ViewModel);
  #   view_model = factory.createForPath(new Backbone.Model({name: 'Bob'}), 'bob.the.builder'); // creates kb.ViewModel
  creatorForPath: (obj, path) ->
    if (creator = @paths[path])
      return if creator.view_model then creator.view_model else creator
    if @parent_factory
      return creator if (creator = @parent_factory.creatorForPath(obj, path))
    return null