// A really dumb example to show how this works

Template.demo.uuid = function() {
  return Session.get('uuid');
};

Template.demo.events = {
  'click': function() {
    Meteor.call('getId', function(err, uuid) {
      Session.set('uuid', uuid);
    });
  }
};
