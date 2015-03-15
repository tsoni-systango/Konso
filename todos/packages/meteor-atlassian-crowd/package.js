

// ---------------------------------------------
// Description

Package.describe({

	name: 'zuzel:meteor-atlassian-crowd',
	version: '0.0.1',
	summary: 'A Meteor package for atlassian crowd nodejs module.',
	documentation: 'README.md'

});


// ---------------------------------------------
// Use

Package.onUse(function(api) {

	api.versionsFrom('1.0.3.1');
    api.use(['templating'], 'client');
    api.use(['accounts-base', 'accounts-password'], 'server');
	api.add_files( ['lib/meteor-atlassian-crowd.js'], 'server' );
	api.add_files( ['lib/crowd_client.js'], 'client' );
	api.add_files( ['lib/crowd_server.js'], 'server' );

	api.export('AtlassianCrowd', 'server');
    api.export('ATLASSIAN_CROWD_CONFIG', 'server');


});


// ---------------------------------------------
// Tests

Package.onTest(function(api) {

	api.use('tinytest');
	api.use('meteor-atlassian-crowd');
	api.addFiles('meteor-atlassian-crowd-tests.js');

});

// ---------------------------------------------
// NPM Dependency

Npm.depends({ 'atlassian-crowd': '0.4.4' });


