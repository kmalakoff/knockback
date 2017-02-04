var ko = kb.ko;

var model = new Backbone.Model({number: 33});

var ViewModel = function(model) {
  this.number = kb.observable(model, 'number');
  this.formatted_number = kb.observable(model, {
    key: 'number',
    read: function() { return "#: " + (this.number()); },
    write: function(value) { return this.number(value.substring(3)); }
  }, {}, this);
};

var view_model = new ViewModel(model);

ko.applyBindings(view_model, $('#kboo_read_write')[0]);