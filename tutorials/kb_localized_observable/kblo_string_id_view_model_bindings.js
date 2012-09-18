var texts = new Backbone.Model({main_text_id: 'body'});

view_model = {
  main_text: kb.observable(texts, {key: 'main_text_id', localizer: LocalizedStringLocalizer}),
  toggleLocale: function() {
    return kb.locale_manager.setLocale(kb.locale_manager.getLocale() === 'en-GB' ? 'fr-FR' : 'en-GB');
  }
};

ko.applyBindings(view_model, $('#kblo_read_only')[0]);