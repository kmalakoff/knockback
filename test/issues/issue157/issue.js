const SortItemModel = Backbone.Model.extend({});

const ViewModel = kb.ViewModel.extend({
  i: 1,

  addItem() {
    const obj = { name: `test${this.i++}` };
    const line = new SortItemModel(obj);
    this.model().get('lines').push(line);
    console.log('CollectionObservable length:', this.lines().length);
    console.log('Collection length:', this.model().get('lines').length);
  },
});

ko.applyBindings(view_model, $('#some-div')[0]);
