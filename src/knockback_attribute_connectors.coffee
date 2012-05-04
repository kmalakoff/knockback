###
  knockback_attribute_connectors.js
  (c) 2012 Kevin Malakoff.
  Knockback.AttributeConnector is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###
throw new Error('Knockback: Dependency alert! knockback_core.js must be included before this file') if not @Knockback

####################################################
# overrides
#   update: ->
####################################################
class Knockback.AttributeConnector
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

class Knockback.SimpleAttributeConnector extends Knockback.AttributeConnector
  constructor: ->
    super; return kb.utils.wrappedObservable(this)

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

Knockback.simpleAttributeConnector = (model, key, options) -> new Knockback.SimpleAttributeConnector(model, key, options)

class Knockback.CollectionAttributeConnector extends Knockback.AttributeConnector
  constructor: ->
    super; return kb.utils.wrappedObservable(this)

  destroy: ->
    @__kb.value_observable()?.release()
    super

  update: ->
    model = kb.utils.wrappedModel(this)
    return unless model    # default is to retain the previous value if there is no model
    value = model.get(@key)
    current_value = @__kb.value_observable()

    if not current_value
      if @options.__kb_store
        @__kb.value_observable(@options.__kb_store.resolve(value, => kb.collectionObservable(value, @options)))
      else
        @__kb.value_observable(kb.collectionObservable(value, @options))
    else
      if (current_value.collection() != value)
        current_value.collection(value); @__kb.value_observable.valueHasMutated()

  read: ->
    current_value = @__kb.value_observable()
    return if current_value then current_value() else undefined

Knockback.collectionAttributeConnector = (model, key, options) -> new Knockback.CollectionAttributeConnector(model, key, options)

class Knockback.ViewModelAttributeConnector extends Knockback.AttributeConnector
  constructor: ->
    super; return kb.utils.wrappedObservable(this)

  destroy: ->
    @__kb.value_observable()?.release?()
    super

  update: ->
    model = kb.utils.wrappedModel(this)
    return unless model    # default is to retain the previous value if there is no model
    value = model.get(@key)
    current_value = @__kb.value_observable()

    if not current_value
      view_model_options = if @options.options then _.clone(@options.options) else {}
      if view_model_options.__kb_store
        @__kb.value_observable(view_model_options.__kb_store.resolve(value, => if @options.view_model then (new @options.view_model(value, view_model_options)) else @options.view_model_create(value, view_model_options)))
      else
        @__kb.value_observable(if @options.view_model then (new @options.view_model(value, view_model_options)) else @options.view_model_create(value, view_model_options))
    else
      throw new Error("Knockback.viewModelAttributeConnector: unknown how to model a view model") unless current_value.model and _.isFunction(current_value.model)
      if (current_value.model() != value)
        current_value.model(value); @__kb.value_observable.valueHasMutated()

Knockback.viewModelAttributeConnector = (model, key, options) -> new Knockback.ViewModelAttributeConnector(model, key, options)

Knockback.createOrUpdateAttributeConnector = (attribute_connector, model, key, options) ->
  # update an existing attribute_connector
  if attribute_connector
    # an attribute connector so update it
    if (kb.utils.observableInstanceOf(attribute_connector, kb.AttributeConnector))
      if attribute_connector.model() != model
        attribute_connector.model(model)
      else
        attribute_connector.update()

  # create a new connector
  else
    value = if model then model.get(key) else null

    # use passed view_model function
    if options.hasOwnProperty('view_model')
      attribute_connector = new options.view_model(value, options.options)

    # use passed view_model_create function
    else if options.hasOwnProperty('view_model_create')
      attribute_connector = options.view_model_create(value, options.options)

    # a collection
    else if options.hasOwnProperty('children')
      if _.isFunction(options.children)
        attribute_options = {view_model: options.children}
      else
        attribute_options = options.children
      options.__kb_store.addResolverToOptions(attribute_options, value) if options.__kb_store
      attribute_connector = kb.collectionAttributeConnector(model, key, attribute_options)

    # a custom creator function
    else if options.hasOwnProperty('create')
      attribute_connector = options.create(value, options.options)

    # INFERRED: kb.CollectionObservable
    else if (value instanceof Backbone.Collection)
      attribute_options = {view_model: kb.ViewModel}
      options.__kb_store.addResolverToOptions(attribute_options, value) if options.__kb_store
      attribute_connector = kb.collectionAttributeConnector(model, key, attribute_options)

    # INFERRED: kb.ViewModel
    else if (value instanceof Backbone.Model) or (Backbone.ModelRef and (value instanceof Backbone.ModelRef))
      attribute_options = {view_model: kb.ViewModel, options: options.options||{}}
      options.__kb_store.addResolverToOptions(attribute_options.options, value) if options.__kb_store
      attribute_connector = kb.viewModelAttributeConnector(model, key, attribute_options)

    # INFERRED: simple type
    else
      attribute_connector = kb.simpleAttributeConnector(model, key, options)

  return attribute_connector