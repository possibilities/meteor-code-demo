GitHubSources = new Meteor.Collection('gitHubSources');

Handlebars.registerHelper('code', function(path) {
  Meteor.defer(prettyPrint);

  var code = GitHubSources.findOne({
    path: path
  });

  if (code) {
    return Template.code(code);
  }
});
