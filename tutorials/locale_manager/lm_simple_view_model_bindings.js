// create and initialize the locale manager with two languages
var simple_locale_manager = new LocaleManager('en', {
  'en': {
    name: 'Name: '
  },
  'fr': {
    name: 'Nom: '
  }
});

var bob = new Backbone.Model({name: 'Bob'});

var view_model = kb.viewModel(bob);

// add a localized label for 'name' and a function for toggling the current locale
view_model.label_name = kb.observable(simple_locale_manager, 'name');
view_model.toggleLocale = function() {
  return simple_locale_manager.setLocale(simple_locale_manager.getLocale() === 'en' ? 'fr' : 'en');
};

ko.applyBindings(view_model, $('#lm_simple')[0]);