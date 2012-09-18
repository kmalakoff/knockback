var ProjectViewModel = kb.ViewModel.extend({
  constructor: function(project, projects) {
    var _this = this;
    kb.ViewModel.prototype.constructor.call(this, project, {requires: ['id', 'name', 'site', 'description']});

    var start_attributes = _.clone(project.attributes);
    this.model_changed = kb.triggeredObservable(project, 'change');
    this.isClean = ko.computed(function() {
      _this.model_changed(); //create a depdendency
      return _.isEqual(start_attributes, project.attributes);
    });
    this.onDelete = function() { // destroy() is reserved for ViewModel lifecycle
      if (!project.isNew()) project.destroy();
      loadUrl('');
      return false;
    };
    this.save = function() {
      if (project.isNew()) projects.add(project);
      project.save();
      loadUrl('');
      return false;
    };
  }
});