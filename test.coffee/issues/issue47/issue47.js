var ForumTopic = Backbone.RelationalModel.extend({});

var Forum = Backbone.RelationalModel.extend({
    urlRoot: '/forums',
    relations: [{
        type: Backbone.HasMany,
        key: 'topics',
        relatedModel: 'ForumTopic',
        collectionType: 'ForumTopicCollection',
        reverseRelation: {
            key: 'forum',
            keySource: 'forum_id',
            includeInJSON: 'id'
        }
}]});
var ForumViewModel = kb.ViewModel.extend({
    constructor: function(model, options, view_model) {
        kb.ViewModel.prototype.constructor.call(this, model, {requires: ['id'], options: options});
        this.forum_link = ko.computed(function() {
            return '#forum/' + this.id();
        }, this);

        return this;
    }
});

var TopicViewModel = kb.ViewModel.extend({
    //new functions definitions, non override any existing functions
});

var topic = new ForumTopic();
var view_model = new TopicViewModel(topic, {
    requires: ['title', 'body'],
    factories: {
        'forum': ForumViewModel
    }
});

ko.applyBindings(view_model);