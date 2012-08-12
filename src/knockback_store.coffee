###
  knockback_store.js
  (c) 2012 Kevin Malakoff.
  Knockback.Store is freely distributable under the MIT license.
  See the following for full license details:
    https://github.com/kmalakoff/knockback/blob/master/LICENSE
###

class kb.Store
  constructor: ->
    @objects = []
    @view_models = []

  destroy: ->
    @objects = null

    # first break cycles in the collections since relations are the typical source of recursion
    for index, view_model of @view_models
      continue unless kb.utils.observableInstanceOf(view_model, kb.CollectionObservable)

      @view_models[index] = null # releasing
      view_model.release() while (view_model.refCount() > 0)

    # then release the view models
    for index, view_model of @view_models
      continue unless view_model

      @view_models[index] = null # releasing
      if (view_model instanceof kb.RefCountable)
        view_model.release() while (view_model.refCount() > 0)
      else
        kb.utils.release(view_model)
    @view_models = null

  registerValue: (obj, view_model) ->
    view_model.retain() if (view_model instanceof kb.RefCountable)
    index = _.indexOf(@objects, obj)
    if (index >= 0)
      @view_models[index] = view_model
    else
      @objects.push(obj)
      @view_models.push(view_model)
    return view_model

  resolveValue: (obj, factory, path) ->
    # use an existing
    index = _.indexOf(@objects, obj)
    if (index >= 0)
      # view_model is in the store (not still being resolved)
      if @view_models[index]
        # reference is out-of-date, clear it out
        if (@view_models[index] instanceof kb.RefCountable) and (@view_models[index].refCount() <= 0)
          @view_models[index] = null
        else
          return if (@view_models[index] instanceof kb.RefCountable) then @view_models[index].retain() else @view_models[index]

    # stub out a new view_model
    else
      index = @objects.length
      @objects.push(obj)
      @view_models.push(undefined)

    # create and wrap the view_model
    view_model = factory.createForPath(obj, path, this)
    kb.utils.wrappedModel(view_model, obj)

    # update the stored view_model
    if @objects[index] != obj
      @registerValue(obj, view_model)
    else if not @view_models[index]
      view_model.retain() if (view_model instanceof kb.RefCountable)
      @view_models[index] = view_model

    return view_model

  releaseValue: (view_model) ->
    return unless (view_model instanceof kb.RefCountable)
    view_model.release()
    return if (view_model.refCount() > 0)
    index = _.indexOf(@view_models, view_model)
    return unless index >= 0
    @view_models[index] = 0

  addResolverToOptions: (options, obj) ->
    return _.extend(options, {store: this, store_obj: obj})

  @resolveFromOptions: (options, view_model) ->
    return unless options.store and options.store_obj
    options.store.registerValue(options.store_obj, view_model)