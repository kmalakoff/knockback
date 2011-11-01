var LocaleManager;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
LocaleManager = (function() {
  function LocaleManager(locale_identifier, id_to_string_map_by_culture) {
    this.id_to_string_map_by_culture = id_to_string_map_by_culture;
    this.setLocale(locale_identifier);
  }
  LocaleManager.prototype.get = function(string_id) {
    var culture_map;
    culture_map = this.id_to_string_map_by_culture[this.locale_identifier];
    if (!culture_map) {
      return '';
    }
    if (culture_map.hasOwnProperty(string_id)) {
      return culture_map[string_id];
    } else {
      return '';
    }
  };
  LocaleManager.prototype.getLocale = function() {
    return this.locale_identifier;
  };
  LocaleManager.prototype.setLocale = function(locale_identifier) {
    var culture_map, key, value, _results;
    this.locale_identifier = locale_identifier;
    Globalize.culture = Globalize.findClosestCulture(locale_identifier);
    this.trigger('change', this);
    culture_map = this.id_to_string_map_by_culture[this.locale_identifier];
    if (!culture_map) {
      return;
    }
    _results = [];
    for (key in culture_map) {
      value = culture_map[key];
      _results.push(this.trigger("change:" + key, value));
    }
    return _results;
  };
  return LocaleManager;
})();
__extends(LocaleManager.prototype, Backbone.Events);