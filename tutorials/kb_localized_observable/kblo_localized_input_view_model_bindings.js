var model = new Backbone.Model({date: new Date()});

view_model = {
  date: kb.observable(model, {key: 'date', localizer: LongDateLocalizer}),
  toggleLocale: function() {
    return kb.locale_manager.setLocale(kb.locale_manager.getLocale() === 'en-GB' ? 'fr-FR' : 'en-GB');
  }
};

ko.applyBindings(view_model, $('#kblo_read_write')[0]);