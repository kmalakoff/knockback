var ko = kb.ko;

var ProjectListViewModel = function(projects) {
  var _this = this;
  this.filter = ko.observable('');
  this.projects = kb.collectionObservable(projects, {
    view_model: ProjectViewModel,
    sort_attribute: 'name',
    filters: [function(model) {
      var filter = _this.filter();
      if (!filter) return true;
      return model.get('name') && (model.get('name').search(filter) >= 0);
    }]
  });
};