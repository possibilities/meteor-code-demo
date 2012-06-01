// Yay!

Meteor.methods({
  getId: function() {
    return _.first(Meteor.uuid().split('-'));
  }
});
