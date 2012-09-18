var ProjectCollection = Backbone.Collection.extend({
  url: "" + PROJECTS_BASE_URL + "?" + PROJECTS_API_KEY_PARAM,
  parse: function(data) { return _.map(data, function(item) { item.id = item._id.$oid; return item; }); },
  model: Project
});