  var model = new Backbone.Model({date: new Date()});

  var view_model = {
    date: kb.observable(model, {key: 'date', localizer: LongDateLocalizer})
  };