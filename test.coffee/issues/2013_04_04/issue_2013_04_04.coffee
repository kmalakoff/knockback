window.SingleExecutionViewModel = kb.ViewModel.extend({
  constructor : (model,options)->
    kb.ViewModel.prototype.constructor.call(@,model,{},options )
})

window.SingleExecutionCollection = kb.CollectionObservable.extend({
  constructor: (collection, options) ->
    return kb.CollectionObservable.prototype.constructor.call(@, collection, {view_model: SingleExecutionViewModel, options: options})
})


window.WorkspaceViewModel = kb.ViewModel.extend({
  constructor: (model,options)->
    kb.ViewModel.prototype.constructor.call(@,model,{
      requires: ['singleExecutions']
      factories:
        'singleExecutions': SingleExecutionCollection
    },options)
    console.log("calling workspace view model")
    return


  init: ->
    @subscribeEvents()

  subscribeEvents: -> @singleExecutions.subscribe( (executionViewModels) => alert(executionViewModels) )
})

class window.Workspace1 extends Backbone.Model
  defaults:
    singleExecutions: new Backbone.Collection()
    batchExecutions: new Backbone.Collection()

  constructor: -> super()

workspace = new Workspace1()
workspaceViewModel= new WorkspaceViewModel(workspace)
workspaceViewModel.init()
workspace.get('singleExecutions').add(new Backbone.Model())