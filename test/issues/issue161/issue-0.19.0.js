var children = new Backbone.Collection([
  new Backbone.Model({ name: "Charles" }),
  new Backbone.Model({ name: "Eve" }),
]);

var parent = new Backbone.Model({
  name: "Bob",
  children: children,
});

var subFactory = function (model) {
  var subVm = new kb.ViewModel(model);
  subVm.cid = kb.ko.computed(function () {
    return model.cid;
  });
  return subVm;
};

var vm = new kb.ViewModel(null, { excludes: ["children"] });

vm.shareOptions().factory.addPathMapping("children.models", subFactory);
vm.createObservables(null, ["children"]);

vm.model(parent);

ko.applyBindings(vm, document.getElementById("some-div"));

console.log(vm.name());
console.log(vm.children()[0].cid());
