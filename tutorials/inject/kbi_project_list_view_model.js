var ProjectListViewModel = function(projects) {
  var _this = this;
  this.filter = ko.observable('');
  this.projects = kb.collectionObservable(projects, {
    view_model: ProjectViewModel,
    sort_attribute: 'name',
    filters: function(model) {
      var filter;
      filter = _this.filter();
      if (!filter) return false;
      return model.get('name').search(filter) < 0;
    }
  });
};