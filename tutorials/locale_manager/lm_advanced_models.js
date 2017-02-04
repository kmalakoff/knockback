var ko = kb.ko;

var LocaleManager = function() {
  this.translations_by_locale = translations_by_locale;
  this.current_locale = ko.observable(locale_identifier);

  this.get = function(string_id) {
    if (!this.translations_by_locale[this.current_locale()]) { return '(no translation)'; }
    if (!this.translations_by_locale[this.current_locale()].hasOwnProperty(string_id)) { return '(no translation)'; }

    var string = this.translations_by_locale[this.current_locale()][string_id];
    if (arguments === 1) { return string; }     // no arguments

    // add arguments
    arguments = Array.prototype.slice.call(arguments, 1);
    for (var index = _i = 0; _i < arguments.length; index = ++_i) { string = string.replace("{" + index + "}", arguments[index]); }
    return string;
  };

  this.getLocale = function() { return this.current_locale(); };
  this.setLocale = function(locale_identifier) {
    this.current_locale(locale_identifier);
    this.trigger('change', this);
    var map = this.translations_by_locale[this.current_locale()];
    for (key in map) { this.trigger("change:" + key, map[key]); }
  };

  this.getLocales = function() {
    var locales = [];
    for (var string_id in this.translations_by_locale) {
      value = this.translations_by_locale[string_id];
      locales.push(string_id);
    }
    return locales;
  };
};

_.extend(LocaleManager.prototype, Backbone.Events);