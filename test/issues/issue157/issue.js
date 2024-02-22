var SortItemModel = Backbone.Model.extend({});

var ViewModel = kb.ViewModel.extend({
  i: 1,

  addItem: function () {
    var obj = { name: "test" + this.i++ };
    var line = new SortItemModel(obj);
    this.model().get("lines").push(line);
    console.log("CollectionObservable length:", this.lines().length);
    console.log("Collection length:", this.model().get("lines").length);
  },
});

ko.applyBindings(view_model, $("#some-div")[0]);
