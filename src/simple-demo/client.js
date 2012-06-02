GitHubSources = new Meteor.Collection('gitHubSources');

Handlebars.registerHelper('code', function(path) {
  var code = GitHubSources.findOne({
    path: path
  });
  if (code) {
    return Template.code(code);
  }
});
