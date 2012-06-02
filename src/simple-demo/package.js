Package.describe({
  summary: "A simple way to display your app's source code in your app"
});

Package.on_use(function (api) {
  api.use('underscore', 'server');
  api.use('party', 'server');
  api.use('http', 'client');
  api.use('templating', 'client');
  api.use('simple-secure', 'server');
  api.add_files('vendor/underscore.strings.js', 'server');
  api.add_files('server.js', 'server');
  api.add_files('client.js', 'client');
  api.add_files('base.css', 'client');
  api.add_files('templates.html', 'client');
});
