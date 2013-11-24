###############################
class ORM
  constructor: ->
    @adapters = []

  initialize: ->
    @adapters = _.select(@adapters, (adapter) -> adapter.isAvailable())
    @initialized = true

  addAdapter: (adapter) -> @adapters.push(adapter); @initialized = false

  keys: (model) ->
    return unless @adapters.length
    @initialize() unless @initialized

    return keys for adpater in @adapters when keys = adpater.keys(model)
    return

  inferCreator: (model, key) ->
    return unless @adapters.length
    @initialize() unless @initialized

    return creator for adpater in @adapters when creator = adpater.inferCreator(model, key)
    return

  bind: (model, key, update, path) ->
    return unless @adapters.length
    @initialize() unless @initialized

    return unbind_fn for adpater in @adapters when unbind_fn = adpater.bind(model, key, update, path)
    return

kb.orm = new ORM()
###############################

###############################
class ORMAdapter_BackboneORM
  isAvailable: ->
    try kb.BackboneORM = window?.BackboneORM or require?('backbone-orm') catch
    return !!kb.BackboneORM

  keys: (model) ->
    return null unless (model.schema and _.isFunction(model.relation))
    return _.keys(model.schema().relations)

  relationType: (model, key) ->
    return null unless (model.schema and _.isFunction(model.relation))
    return null unless relation = model.relation(key)
    return if relation.type is 'hasMany' then KB_TYPE_COLLECTION else KB_TYPE_MODEL

  inferCreator: (model, key) ->
    return null unless type = @relationType(model, key)
    return if type is KB_TYPE_COLLECTION then kb.CollectionObservable else kb.ViewModel

  bind: (model, key, update, path) -> return

kb.orm.addAdapter(new ORMAdapter_BackboneORM())
###############################

###############################
class ORMAdapter_BackboneRelational
  isAvailable: ->
    try kb.Backbone?.RelationalModel or require?('backbone-relational') catch
    return !!kb.Backbone?.RelationalModel

  keys: (model) ->
    return null unless model instanceof kb.Backbone.RelationalModel
    return _.map(model.getRelations(), (test) -> test.key)

  relationType: (model, key) ->
    return null unless model instanceof kb.Backbone.RelationalModel
    return null unless relation = _.find(model.getRelations(), (test) -> return test.key is key)
    return if (relation.collectionType or _.isArray(relation.keyContents)) then KB_TYPE_COLLECTION else KB_TYPE_MODEL

  inferCreator: (model, key) ->
    return null unless type = @relationType(model, key)
    return if type is KB_TYPE_COLLECTION then kb.CollectionObservable else kb.ViewModel

  bind: (model, key, update, path) ->
    return null unless type = @relationType(model, key)
    rel_fn = (model) ->
      not kb.statistics or kb.statistics.addModelEvent({name: 'update (relational)', model: model, key: key, path: path})
      update()

    # VERSIONING: pre Backbone-Relational 0.8.0
    events = if Backbone.Relation.prototype.sanitizeOptions then ['update', 'add', 'remove'] else ['change', 'add', 'remove']
    if type is KB_TYPE_COLLECTION
      model.bind("#{event}:#{key}", rel_fn) for event in events
    else
      model.bind("#{events[0]}:#{key}", rel_fn)

    return ->
      if type is KB_TYPE_COLLECTION
        model.unbind("#{event}:#{key}", rel_fn) for event in events
      else
        model.unbind("#{events[0]}:#{key}", rel_fn)
      return

kb.orm.addAdapter(new ORMAdapter_BackboneRelational())
###############################

###############################
class ORMAdapter_BackboneAssociations
  isAvailable: ->
    try kb.Backbone?.AssociatedModel or require?('backbone-associations') catch
    return !!kb.Backbone?.AssociatedModel

  keys: (model) ->
    return null unless model instanceof kb.Backbone.AssociatedModel
    return _.map(model.relations, (test) -> test.key)

  relationType: (model, key) ->
    return null unless model instanceof kb.Backbone.AssociatedModel
    return null unless relation = _.find(model.relations, (test) -> return test.key is key)
    return if (relation.type is 'Many') then KB_TYPE_COLLECTION else KB_TYPE_MODEL

  inferCreator: (model, key) ->
    return null unless type = @relationType(model, key)
    return if type is KB_TYPE_COLLECTION then kb.CollectionObservable else kb.ViewModel

  bind: (model, key, update, path) -> return null

kb.orm.addAdapter(new ORMAdapter_BackboneAssociations())
###############################

###############################
class ORMAdapter_Supermodel
  isAvailable: ->
    try window?.Supermodel or require?('supermodel') catch
    return !!window?.Supermodel

  keys: (model) ->
    return null unless model instanceof Supermodel.Model
    return _.keys(model.constructor.associations())

  relationType: (model, key) ->
    return null unless model instanceof Supermodel.Model
    return null unless relation = model.constructor.associations()[key]
    return if relation.add then KB_TYPE_COLLECTION else KB_TYPE_MODEL

  inferCreator: (model, key) ->
    return null unless type = @relationType(model, key)
    return if type is KB_TYPE_COLLECTION then kb.CollectionObservable else kb.ViewModel

  bind: (model, key, update, path) -> return null

kb.orm.addAdapter(new ORMAdapter_Supermodel())
###############################
