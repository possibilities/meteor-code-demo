// Pointless Meteor.method for the demo, yay!

Meteor.methods({
  getId: function() {
    return _.first(Meteor.uuid().split('-'));
  }
});

// This is how I load myself into myself

SimpleDemo.load({
  user: 'possibilities',
  repo: 'meteor-simple-demo',
  ref: 'master'
});
