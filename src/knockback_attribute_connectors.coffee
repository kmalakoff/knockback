###
  knockback_attribute_connectors.js
  (c) 2012 Kevin Malakoff.
  Knockback.AttributeConnector is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

####################################################
# overrides
#   update: ->
####################################################
class kb.AttributeConnector
  constructor: (model, @key, @options={}) ->
    kb.utils.wrappedModel(this, model)
    @options = _.clone(@options)
    @__kb.value_observable = ko.observable()
    observable = kb.utils.wrappedObservable(this, ko.dependentObservable(
      read: _.bind(@read, @)
      write: _.bind(@write, @)
    ))

    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)
    observable.model = _.bind(@model, @)
    observable.update = _.bind(@update, @)

    # update to set up
    @__kb.initializing = true
    @update()
    @__kb.initializing = false

    return observable

  destroy: ->
    @__kb.value_observable = null
    kb.utils.wrappedObservable(this).dispose(); kb.utils.wrappedObservable(this, null)

  read: -> return @__kb.value_observable()
  write: (value) ->
    model = kb.utils.wrappedModel(this)
    return unless model

    if @options.read_only
      throw "Cannot write a value to a dependentObservable unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters." unless @__kb.initializing
    else
      set_info = {}; set_info[@key] = value
      model.set(set_info)

  model: (new_model) ->
    model = kb.utils.wrappedModel(this)
    return model if (arguments.length == 0) # get
    return if (model == new_model) # no change
    kb.utils.wrappedModel(this, new_model)
    @update()

  @inferType = (model, key) ->
    value = model.get(key)
    if not value
      return 'simple' unless (Backbone.RelationalModel and (model instanceof Backbone.RelationalModel))

      # check the relation
      relation = _.find(model.getRelations(), (test) -> return (test.key == key))
      return 'simple' unless relation
      return if relation.collectionKey then 'collection' else 'model'

    return 'collection' if (value instanceof Backbone.Collection)
    return 'model' if (value instanceof Backbone.Model) or (Backbone.ModelRef and (value instanceof Backbone.ModelRef))
    return 'simple'

  @createByType = (type, model, key, options) ->
    switch type
      when 'collection'
        attribute_options = if options then _.clone(options) else {}
        attribute_options.view_model = kb.ViewModel if not (options.view_model or options.view_model_create or options.children or options.create)
        options.store.addResolverToOptions(attribute_options, model.get(key)) if options.store
        return kb.collectionAttributeConnector(model, key, attribute_options)

      when 'model'
        attribute_options = if options then _.clone(options) else {}
        attribute_options.options = {} unless attribute_options.options
        attribute_options.view_model = kb.ViewModel if not (options.view_model or options.view_model_create or options.children or options.create)
        options.store.addResolverToOptions(attribute_options.options, model.get(key)) if options.store
        return kb.viewModelAttributeConnector(model, key, attribute_options)

      else
        return kb.simpleAttributeConnector(model, key, options)

  @createOrUpdate = (attribute_connector, model, key, options) ->
    # update an existing attribute_connector
    if attribute_connector
      # an attribute connector so update it
      if (kb.utils.observableInstanceOf(attribute_connector, kb.AttributeConnector))
        if attribute_connector.model() != model
          attribute_connector.model(model)
        else
          attribute_connector.update()
      return attribute_connector

    # create a new connector

    # INFER: simple type
    return kb.simpleAttributeConnector(model, key, options) unless model

    # a custom creator function
    if options.hasOwnProperty('create')
      throw new Error('kb.AttributeConnector: options.create is empty') if not options.create
      return options.create(model, key, options.options||{})

    value = model.get(key)

    # use passed view_model function
    if options.hasOwnProperty('view_model')
      throw new Error('kb.AttributeConnector: options.view_model is empty') if not options.view_model
      return new options.view_model(value, options.options||{})

    # use passed view_model_create function
    else if options.hasOwnProperty('view_model_create')
      throw new Error('kb.AttributeConnector: options.view_model_create is empty') if not options.view_model_create
      return options.view_model_create(value, options.options||{})

    # a collection
    else if options.hasOwnProperty('children')
      throw new Error('kb.AttributeConnector: options.children is empty') if not options.children
      if (typeof(options.children) == 'function')
        attribute_options = {view_model: options.children}
      else
        attribute_options = options.children||{}
      return kb.collectionAttributeConnector(model, key, attribute_options)

    # INFER: choose a type
    @createByType(@inferType(model, key), model, key, options)

class kb.SimpleAttributeConnector extends kb.AttributeConnector
  constructor: ->
    super
    return kb.utils.wrappedObservable(@)

  destroy: ->
    @current_value = null
    super

  update: ->
    model = kb.utils.wrappedModel(this)
    return unless model    # default is to retain the previous value if there is no model
    value = model.get(@key)
    current_value = @__kb.value_observable()

    if not _.isEqual(current_value, value)
      @__kb.value_observable(value)

  write: (value) ->
    model = kb.utils.wrappedModel(this)
    (@__kb.value_observable(value); return) if not model # CONVENTION: update the observable even if the model isn't loaded
    super

kb.simpleAttributeConnector = (model, key, options) -> new kb.SimpleAttributeConnector(model, key, options)

class kb.CollectionAttributeConnector extends kb.AttributeConnector
  constructor: ->
    super
    return kb.utils.wrappedObservable(@)

  destroy: ->
    current_value = @__kb.value_observable()
    current_value.release() if current_value and (typeof(current_value.refCount) == 'function') and (current_value.refCount() > 0) # it may have been released by the store
    super

  update: ->
    model = kb.utils.wrappedModel(this)
    return unless model    # default is to retain the previous value if there is no model
    value = model.get(@key)
    current_value = @__kb.value_observable()

    if not current_value
      if @options.store
        @__kb.value_observable(@options.store.resolveValue(value, => kb.collectionObservable(value, @options)))
      else
        @__kb.value_observable(kb.collectionObservable(value, @options))
    else
      if (current_value.collection() != value)
        current_value.collection(value); @__kb.value_observable.valueHasMutated()

  read: ->
    current_value = @__kb.value_observable()
    return if current_value then current_value() else undefined

kb.collectionAttributeConnector = (model, key, options) -> new kb.CollectionAttributeConnector(model, key, options)

class kb.ViewModelAttributeConnector extends kb.AttributeConnector
  constructor: ->
    super
    return kb.utils.wrappedObservable(@)

  destroy: ->
    current_value = @__kb.value_observable()
    current_value.release() if current_value and (typeof(current_value.refCount) == 'function') and (current_value.refCount() > 0) # it may have been released by the store
    super

  update: ->
    model = kb.utils.wrappedModel(this)
    return unless model    # default is to retain the previous value if there is no model
    value = model.get(@key)
    current_value = @__kb.value_observable()

    if not current_value
      view_model_options = if @options.options then _.clone(@options.options) else {}
      if view_model_options.store
        @__kb.value_observable(view_model_options.store.resolveValue(value, => if @options.view_model then (new @options.view_model(value, view_model_options)) else @options.view_model_create(value, view_model_options)))
      else
        @__kb.value_observable(if @options.view_model then (new @options.view_model(value, view_model_options)) else @options.view_model_create(value, view_model_options))
    else
      throw new Error("kb.viewModelAttributeConnector: unknown how to model a view model") unless current_value.model and (typeof(current_value.model) == 'function')
      if (current_value.model() != value)
        current_value.model(value); @__kb.value_observable.valueHasMutated()

kb.viewModelAttributeConnector = (model, key, options) -> new kb.ViewModelAttributeConnector(model, key, options)