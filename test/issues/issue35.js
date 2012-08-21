var
    Book = Backbone.RelationalModel.extend({
       defaults:{
        name: 'untitled'
       },
       idAttribute: "_id"
    }),
    Author = Backbone.RelationalModel.extend({
       defaults:{
         name: 'untitled'
        },
        idAttribute: "_id",
        relations:[
            {
            type: 'HasMany',
             key: 'books',
             relatedModel: Book,
             includeInJSON: "_id",
             reverseRelation: {
             key: 'author',
             includeInJSON: "_id"
        }}
        ]
    }),
    BookStore = Backbone.RelationalModel.extend({
       relations:[
      {
          type: 'HasMany',
          key: 'books',
          relatedModel: Book
      },
      {
          type: 'HasMany',
          key: 'authors',
          relatedModel: Author
      }
      ]
    });

Author.setup();
BookStore.setup();


var
    bs = new BookStore({
        books:[
            {
            _id:"b1",
            name: "Book One",
            author: "a1"
            },
            {
            _id:"b2",
            name: "Book Two",
            author: "a1"               // does not work
//            author: "a2"               // works
            },
        ],
        authors:[
            {
                name: 'fred',
                _id: "a1",
                books: ["b1","b2"]    // does not work
//                books: ["b1"]         // works
            },
            {
                name: 'ted',
                _id: "a2",
                books: []             // does not work
//                books: ["b2"]         // works

            }
        ]
    });

function bookVmcreate(model){
    var vm = {
        name: kb.observable(model,'name'),
        author: kb.observable(model,'author'),
        editMode: ko.observable(),
        edit:function(){
              model._save = model.toJSON();
              this.editMode(true);},
        confirm:function(){
            model._save = null;
            this.editMode(false);},
        cancel:function(){
            model.set(model._save);
            this.editMode(false);
        },
        model: model
    };
    vm.authorName = vm.author().name
    return vm;
};

function authorVMcreate(model){
    return {
        name: kb.observable(model,'name'),
        books: kb.collectionObservable(model.get('books'), {models_only: true}),
        // books: kb.observable(model,{
        //     key: 'books',
        //     read: function(){
        //         return model.get('books').models;
        //     },
        //     write: function(val){
        //         model.get('books').reset(val);
        //     }
        // }),
        model: model

    }
}

view_model = {   books: kb.collectionObservable(bs.get('books'), {
                        create: bookVmcreate}) ,
                 authors: kb.collectionObservable(bs.get('authors'), {
                        create: authorVMcreate}),
        showBS:  function(){
          alert(JSON.stringify(bs.toJSON()));
        },
        changeInCode:function(){
              bs.get('books').at(0).set('author',bs.get('authors').at(1));
        }
};
ko.applyBindings(view_model);