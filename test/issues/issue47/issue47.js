const ForumTopic = Backbone.RelationalModel.extend({});

const Forum = Backbone.RelationalModel.extend({
  urlRoot: '/forums',
  relations: [{
    type: Backbone.HasMany,
    key: 'topics',
    relatedModel: 'ForumTopic',
    collectionType: 'ForumTopicCollection',
    reverseRelation: {
      key: 'forum',
      keySource: 'forum_id',
      includeInJSON: 'id',
    },
  }] });
const ForumViewModel = kb.ViewModel.extend({
  constructor(model, options, view_model) {
    kb.ViewModel.prototype.constructor.call(this, model, { requires: ['id'], options });
    this.forum_link = ko.computed(function () {
      return `#forum/${this.id()}`;
    }, this);

    return this;
  },
});

const TopicViewModel = kb.ViewModel.extend({
    // new functions definitions, non override any existing functions
});

const topic = new ForumTopic();
const view_model = new TopicViewModel(topic, {
  requires: ['title', 'body'],
  factories: {
    forum: ForumViewModel,
  },
});

ko.applyBindings(view_model);
