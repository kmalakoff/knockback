/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
window.SingleExecutionViewModel = kb.ViewModel.extend({
  constructor(model, options) {
    return kb.ViewModel.prototype.constructor.call(this, model, {}, options);
  },
});

window.SingleExecutionCollection = kb.CollectionObservable.extend({
  constructor(collection, options) {
    return kb.CollectionObservable.prototype.constructor.call(this, collection, { view_model: SingleExecutionViewModel, options });
  },
});

window.WorkspaceViewModel = kb.ViewModel.extend({
  constructor(model, options) {
    kb.ViewModel.prototype.constructor.call(
      this,
      model,
      {
        requires: ['singleExecutions'],
        factories: {
          singleExecutions: SingleExecutionCollection,
        },
      },
      options
    );
    console.log('calling workspace view model');
  },

  init() {
    return this.subscribeEvents();
  },

  subscribeEvents() {
    return this.singleExecutions.subscribe((executionViewModels) => alert(executionViewModels));
  },
});

const Cls = (window.Workspace1 = class Workspace1 extends Backbone.Model {
  static initClass() {
    Workspace1.prototype.defaults = {
      singleExecutions: new Backbone.Collection(),
      batchExecutions: new Backbone.Collection(),
    };
  }
});
Cls.initClass();

const workspace = new Workspace1();
const workspaceViewModel = new WorkspaceViewModel(workspace);
workspaceViewModel.init();
workspace.get('singleExecutions').add(new Backbone.Model());
