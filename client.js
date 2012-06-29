GitHubSources = new Meteor.Collection('gitHubSources');

Handlebars.registerHelper('code', function(path) {
  return Meteor.ui.chunk(function() {
    Meteor.defer(prettyPrint);

    var rawCode = GitHubSources.findOne({ path: path });
    return (rawCode) ? Template.code(rawCode) : '';
  });
});
