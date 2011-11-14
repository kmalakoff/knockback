var Contact, ContactsCollection, NameSortedContactsCollection;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Contact = (function() {
  __extends(Contact, Backbone.Model);
  function Contact() {
    Contact.__super__.constructor.apply(this, arguments);
  }
  Contact.prototype.defaults = {
    name: '',
    number: 0,
    date: new Date()
  };
  return Contact;
})();
ContactsCollection = (function() {
  __extends(ContactsCollection, Backbone.Collection);
  function ContactsCollection() {
    ContactsCollection.__super__.constructor.apply(this, arguments);
  }
  ContactsCollection.prototype.model = Contact;
  return ContactsCollection;
})();
NameSortedContactsCollection = (function() {
  __extends(NameSortedContactsCollection, Backbone.Collection);
  function NameSortedContactsCollection() {
    NameSortedContactsCollection.__super__.constructor.apply(this, arguments);
  }
  NameSortedContactsCollection.prototype.model = Contact;
  NameSortedContactsCollection.prototype.comparator = function(model) {
    return model.get('name');
  };
  return NameSortedContactsCollection;
})();