###
  knockback_model_observable.js
  (c) 2011, 2012 Kevin Malakoff.
  Knockback.Observable is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

####################################################
# options
#   * key - required to look up the model's attributes
#   * read - called to get the value and each time the locale changes
#   * write - called to set the value
#   * args - arguments passed to the read and write function
####################################################

class kb.ModelObservable
  constructor: (@model, @observable) ->
    kb.utils.throwMissing(this, 'model') unless @model
    kb.utils.throwMissing(this, 'observable') unless @observable
    kb.utils.throwMissing(this, 'model()') unless typeof(@observable.model) == 'function'
    kb.utils.throwMissing(this, 'update()') unless typeof(@observable.update) == 'function'

    # bind callbacks
    @__kb or= {}
    @__kb._onModelChange = _.bind(@_onModelChange, @)
    @__kb._onModelLoaded = _.bind(@_onModelLoaded, @)
    @__kb._onModelUnloaded = _.bind(@_onModelUnloaded, @)

    # a model ref
    if Backbone.ModelRef and (@model instanceof Backbone.ModelRef)
      @model_ref = @model; @model_ref.retain()
      @model_ref.bind('loaded', @_onModelLoaded)
      @model_ref.bind('unloaded', @_onModelUnloaded)
      @model = @model_ref.model()
  
    # publish public interface on the observable and return instead of this
    observable.destroy = _.bind(@destroy, @)

    # start now
    @_onModelLoaded(@model) if not @model_ref or @model_ref.isLoaded()

  destroy: ->
    # end now
    @_onModelUnloaded() if not @model_ref or @model_ref.isLoaded()

    # unbind
    if @model_ref
      @model_ref.unbind('loaded', @_onModelLoaded)
      @model_ref.unbind('unloaded', @_onModelUnloaded)
      @model_ref.release(); @model_ref = null
    kb.utils.wrappedDestroy(@)

  ####################################################
  # Internal
  ####################################################
  _onModelLoaded: (model) ->
    @model = model
    model.bind('change', @__kb._onModelChange)
    if Backbone.RelationalModel and (model instanceof Backbone.RelationalModel)
      model.bind('add', @__kb._onModelChange)
      model.bind('remove', @__kb._onModelChange)
      model.bind('update', @__kb._onModelChange)
    @observable.model(model)

  _onModelUnloaded: (model) ->
    @model = null
    model.unbind('change', @__kb._onModelChange)
    if Backbone.RelationalModel and (model instanceof Backbone.RelationalModel)
      model.unbind('add', @__kb._onModelChange)
      model.unbind('remove', @__kb._onModelChange)
      model.unbind('update', @__kb._onModelChange)
    @observable.model(null)

  _onModelChange: ->
    return if (@model and @model.hasChanged) and not @model.hasChanged(ko.utils.unwrapObservable(@key)) # no change, nothing to do
    @observable.update()

# factory function
kb.modelObservable = (model, observable) -> return new kb.ModelObservable(model, observable)