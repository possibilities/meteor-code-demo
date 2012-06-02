// Load underscore strings
_.mixin(_.string.exports());

// A place to keep everything
GitHubSources = new Meteor.Collection('gitHubSources');
Secure.noDataMagic('gitHubSources');

SimpleDemo = {
  load: function(options) {
    
    // Init github repo
    var repo = new GitHubRepo(options);

    // Wait for the event loop
    Meteor.defer(function() {
      
      // Pull everything in from github
      var sources = repo.fetchAllSources();

      // Delete old ones, insert new ones
      GitHubSources.remove({});
      _.each(sources, function(source) {
        GitHubSources.insert(source);
      });
      // console.log(sources.length);
    });
  }
};

// Expose sources

Meteor.publish(null, function() {
  return GitHubSources.find();
});

// Github API

GitHubRepo = function(params) {
  this.baseUri = 'api.github.com';
  this.ssl = true;

  this.ref = params.ref || 'master';
  _.extend(this, params);
};
_.extend(GitHubRepo.prototype, Party.prototype);

GitHubRepo.prototype._head = function(ref) {
  return this.get('repos/' + this.user + '/' + this.repo + '/git/refs/heads/' + ref);
};

GitHubRepo.prototype._tree = function(sha) {
  return this.get('repos/' + this.user + '/' + this.repo + '/git/trees/' + sha);
};

GitHubRepo.prototype._blobContent = function(blob) {
  var content = this.get('repos/' + this.user + '/' + this.repo + '/git/blobs/' + blob.sha).content;
  return new Buffer(content, 'base64').toString();
};

GitHubRepo.prototype.fetchAllSources = function() {  
  var self = this;
  var types = ['html', 'js', 'txt', 'md', 'css'];
  var sources = [];

  var refHead = this._head(this.ref);

  if (refHead) {
    var refHeadSha = refHead.object.sha;
    this._walkTree(refHeadSha, function handleBlob(blob) {
      var ext = _.last(blob.path.split('.'));
      if (_.contains(types, ext)) {
        var source = {
          content: self._blobContent(blob),
          path: blob.fullPath
        };
        source.env = self._getEnv(source);
        sources.push(source);
      }
    });
  }
  
  return sources;
};

GitHubRepo.prototype._getEnv = function(source) {
  var env;

  // Some not super elegant logic to figure out what the
  // environment label should be for a chunk of code
  if (source.path.search(/html/) >= 0
    && source.content.search(/<head>/) >= 0
    && source.content.search(/<body>/) >= 0
  ) {
    env = 'html';
  } else if (source.path.search(/template/) >= 0) {
    env = 'templates';
  } else if (source.path.search(/client/) >= 0) {
    env = 'client';
  } else if (source.path.search(/server/) >= 0) {
    env = 'server';
  }
  
  return env;
};

GitHubRepo.prototype._walkTree = function(startSha, handleBlob, handleTree) {
  var self = this;
  self.pathParts || (self.pathParts = []);

  var tree = self._tree(startSha);
  _.each(tree.tree, function(blobOrTree) {
    blobOrTree.fullPath = (self.pathParts.length === 0) ? blobOrTree.path : self.pathParts.join('/') + '/' + blobOrTree.path;
    if (blobOrTree.type === 'blob') {
      handleBlob && handleBlob(blobOrTree);
    } else if (blobOrTree.type === 'tree') {
      self.pathParts.push(blobOrTree.path);
      handleTree && handleTree(blobOrTree);
      self._walkTree(blobOrTree.sha, handleBlob, handleTree);
    }
  });
  self.pathParts.pop();
};
