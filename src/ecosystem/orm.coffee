###############################
class ORM
  constructor: ->
    @adapters = []

  initialize: ->
    @adapters = _.select(@adapters, (adapter) -> adapter.isAvailable())
    @initialized = true

  addAdapter: (adapter) -> @adapters.push(adapter); @initialized = false

  keys: (model) -> return @_call('keys', arguments)
  bind: (model) -> return @_call('bind', arguments)
  useFunction: (model) -> return @_call('useFunction', arguments)

  _call: (name, args) ->
    return unless @adapters.length
    @initialize() unless @initialized

    return result for adpater in @adapters when adpater[name] and result = adpater[name].apply(adpater, args)
    return

kb.orm = new ORM()
###############################

###############################
class ORMAdapter_BackboneRelational
  isAvailable: ->
    try kb.Backbone?.RelationalModel or require?('backbone-relational') catch
    return !!kb.Backbone?.RelationalModel

  relationType: (model, key) ->
    return null unless model instanceof kb.Backbone.RelationalModel
    return null unless relation = _.find(model.getRelations(), (test) -> return test.key is key)
    return if (relation.collectionType or _.isArray(relation.keyContents)) then KB_TYPE_COLLECTION else KB_TYPE_MODEL

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

  bind: (model, key, update, path) ->
    return null unless type = @relationType(model, key)
    rel_fn = (model, other) ->
      not kb.statistics or kb.statistics.addModelEvent({name: 'update (supermodel)', model: model, key: key, path: path})

      # HACK: the relationship may not be set until after this call
      relation = model.constructor.associations()[key]
      previous = model[relation.store]
      model[relation.store] = other
      update(other)
      model[relation.store] = previous
    if type is KB_TYPE_MODEL
      model.bind("associate:#{key}", rel_fn)
      return -> model.unbind("associate:#{key}", rel_fn)
    return

  useFunction: (model, key) -> return !!@relationType(model, key)

kb.orm.addAdapter(new ORMAdapter_Supermodel())
###############################
