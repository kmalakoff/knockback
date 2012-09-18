var PROJECTS_BASE_URL = 'https://api.mongolab.com/api/1/databases/angularjs/collections/projects';
var PROJECTS_API_KEY_PARAM = 'apiKey=4f847ad3e4b08a2eed5f3b54';

var Project = Backbone.Model.extend({
  url: function() { return "" + PROJECTS_BASE_URL + "/" + this.id + "?" + PROJECTS_API_KEY_PARAM;}
});