// A really dumb example so we have some code to show!

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
