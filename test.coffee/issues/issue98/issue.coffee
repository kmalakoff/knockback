MainClass = Backbone.RelationalModel.extend
  defaults:
    number1: 1
  relations: [
    {
      type: Backbone.HasMany
      key: 'categories'
      relatedModel: 'Category'
      collectionType: 'Categories'
      reverseRelation:
        key: 'main',
        includeInJSON: false
    }
  ]

window.Category = Backbone.RelationalModel.extend
  relations: [
    {
      type: Backbone.HasMany
      key: 'subcategories'
      relatedModel: 'Subcategory'
      collectionType: 'Subcategories'
      reverseRelation:
        key: 'category',
        includeInJSON: false
    }
  ]

window.Subcategory = Backbone.RelationalModel.extend
  defaults:
    number1: 1
    number2: 1

window.Categories = Backbone.Collection.extend
  model: Category

window.Subcategories = Backbone.Collection.extend
  model: Subcategory

SubcategoryVm = null
CategoryVm = null
MainClassVm = null

class SubcategoryVm extends kb.ViewModel
  constructor: (model, options) ->
    super model,
      factories:
        'category': CategoryVm
      options: options
    @computed = ko.computed => @category().main().number1() + @number1() + @number2()

class CategoryVm extends kb.ViewModel
  constructor: (model, options) ->
    super model,
      requires: ['main']
      factories:
        'subcategories.models': SubcategoryVm
        'main': MainClassVm
      options: options

class MainClassVm extends kb.ViewModel
  constructor: (model, options) ->
    super model,
      factories:
        'categories.models': CategoryVm
      options: options

model = new MainClass
  categories: [{subcategories: [{}]}]

try
  model_vm = new MainClassVm(model);
catch error
  jQuery('#errorPanel').html(error)