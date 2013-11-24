# use Parse
if @Parse
  kb.Parse = @Parse
  kb.Collection = @Parse.Collection
  kb.Model = @Parse.Object
  kb.Events = @Parse.Events
else
  kb.Backbone = @Backbone or require('backbone')
  kb.Collection = kb.Backbone.Collection
  kb.Model = kb.Backbone.Model
  kb.Events = kb.Backbone.Events
