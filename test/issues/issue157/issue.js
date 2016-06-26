var SortItemModel = Backbone.Model.extend({});

var ViewModel = kb.ViewModel.extend({
  i: 1,
  constructor: function (model, options)
  {
    options          = options || {};
    options.excludes = ['lines'];
    this.lines = new kb.CollectionObservable(model.get('lines'), kb.ViewModel);
    kb.ViewModel.apply(this, [model, options]);
    return this;
  },

  addItem: function ()
  {
    var obj = {name: "test" + (this.i++)};
    var line = new SortItemModel(obj);
    this.lines.push(new kb.ViewModel(line));
    console.log("CollectionObservable length:", this.lines.length);
    console.log("Collection length:", this.lines.collection().length);
  }
});

var view_model = new ViewModel(new Backbone.Model({lines: new Backbone.Collection()}));

ko.applyBindings(view_model, $('#some-div')[0]);
