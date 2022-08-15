var Book = Backbone.RelationalModel.extend({
    defaults: {
      name: "untitled",
    },
    idAttribute: "_id",
  }),
  Author = Backbone.RelationalModel.extend({
    defaults: {
      name: "untitled",
    },
    idAttribute: "_id",
    relations: [
      {
        type: "HasMany",
        key: "books",
        relatedModel: Book,
        includeInJSON: "_id",
        reverseRelation: {
          key: "author",
          includeInJSON: "_id",
        },
      },
    ],
  }),
  BookStore = Backbone.RelationalModel.extend({
    relations: [
      {
        type: "HasMany",
        key: "books",
        relatedModel: Book,
      },
      {
        type: "HasMany",
        key: "authors",
        relatedModel: Author,
      },
    ],
  });

Author.setup();
BookStore.setup();

var bs = new BookStore({
  books: [
    {
      _id: "b1",
      name: "Book One",
      author: "a1",
    },
    {
      _id: "b2",
      name: "Book Two",
      author: "a1", // does not work
      //            author: "a2"               // works
    },
  ],
  authors: [
    {
      name: "fred",
      _id: "a1",
      books: ["b1", "b2"], // does not work
      //                books: ["b1"]         // works
    },
    {
      name: "ted",
      _id: "a2",
      books: [], // does not work
      //                books: ["b2"]         // works
    },
  ],
});

var bookViewModel = kb.ViewModel.extend({
  constructor: function (model) {
    kb.ViewModel.prototype.constructor.apply(this, arguments);
    this.editMode = ko.observable();
    this.author = ko.computed(function () {
      var a = model.get("author");
      if (a) return a.get("name");
      return null;
    });
    this.edit = function () {
      model._save = model.toJSON();
      this.editMode(true);
    };
    this.confirm = function () {
      model._save = null;
      this.editMode(false);
    };
    this.cancel = function () {
      model.set(model._save);
      this.editMode(false);
    };
  },
});

function bookVmcreate(model) {
  return {
    name: kb.observable(model, "name"),
    author: ko.computed(function () {
      var a = model.get("author");
      if (a) return a.get("name");
      return null;
    }),
    editMode: ko.observable(),
    edit: function () {
      model._save = model.toJSON();
      this.editMode(true);
    },
    confirm: function () {
      model._save = null;
      this.editMode(false);
    },
    cancel: function () {
      model.set(model._save);
      this.editMode(false);
    },
  };
}

var view_model = {
  books: kb.collectionObservable(bs.get("books"), {
    view_model: bookViewModel,
    factories: {
      "models.author.books.models": bookViewModel,
    },
  }),
}; // does not work when two books refer same author
//view_model_create: bookVmcreate}) };   // fixes not working
ko.applyBindings(view_model);
