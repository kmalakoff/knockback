var children = new Backbone.Collection([new Backbone.Model({ name: 'Charles' }), new Backbone.Model({ name: 'Eve' })]);

var parent = new Backbone.Model({
  name: 'Bob',
  children: children,
});

var subFactory = function (model) {
  var subVm = new kb.ViewModel(model);
  subVm.cid = kb.ko.computed(function () {
    return model.cid;
  });
  return subVm;
};

var vm = new kb.ViewModel(null, {
  excludes: ['children'],
  factories: { 'children.models': subFactory },
});

// Passing in parent instead of null works but in my case I don't have parent
// here so I must be able to set it later using vm.model(parent).
vm.children = kb.observable(null, 'children', vm.shareOptions());

vm.model(parent);

ko.applyBindings(vm, document.getElementById('some-div'));

console.log(vm.name());
console.log(vm.children()[0].cid());
