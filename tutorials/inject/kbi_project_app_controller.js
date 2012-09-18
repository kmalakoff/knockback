var ProjectAppController = function(view_model, element) {
  var knockback_model = {id: 'id_kb', name: 'Knockback.js', description: 'Backbone.js + Knockout.js is amazingly!', site: 'http://kmalakoff.github.com/knockback/'};
  var projects = new ProjectCollection([knockback_model]);
  projects.fetch();

  var active_el = null;
  var loadPage = function(el) {
    if (active_el) ko.removeNode(active_el);
    return element.appendChild(active_el = el);
  };
  router = new Backbone.Router();
  router.route('*path', null, function() {_.defer(loadUrlFn('')); });
  router.route('', null, function() {
    return loadPage(kb.renderTemplate('list.html', new ProjectListViewModel(projects)));
  });
  router.route('new', null, function() {
    return loadPage(kb.renderTemplate('detail.html', new ProjectViewModel(new Project(), projects)));
  });
  router.route('edit/:projectId', null, function(project_id) {
    var project;
    if (!(project = projects.get(project_id))) {loadUrl(''); return; } // not a valid project
    return loadPage(kb.renderTemplate('detail.html', new ProjectViewModel(project)));
  });
};

// start outside of the binding loop
var projectAppStartRouting = function() {
  if (!Backbone.History.started) {
    Backbone.history.start({pushState: true, root: window.location.pathname});
  }
};