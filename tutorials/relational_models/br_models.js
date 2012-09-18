var House = Backbone.RelationalModel.extend({
  relations: [{
    type: Backbone.HasMany,
    key: 'occupants',
    relatedModel: 'Person',
    reverseRelation: {
      key: 'livesIn'
    }
  }]
});

var Person = Backbone.RelationalModel.extend({});