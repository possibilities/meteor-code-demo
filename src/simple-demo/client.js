GitHubSources = new Meteor.Collection('gitHubSources');

Handlebars.registerHelper('code', function(path) {
  Meteor.defer(prettyPrint);

  return Meteor.ui.chunk(function() {
    var code = GitHubSources.findOne({ path: path });
    if (code) {
      return Template.code(code);
    } else {
      return '';
    }
  });
});
