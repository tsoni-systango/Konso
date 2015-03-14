Router.configure({
	autoRender: false,
	autoStart: false,
	// we use the  appBody template to define the layout for the entire app
	layoutTemplate: 'layout',
	// the notFound template is used for unknown routes and missing lists
	notFoundTemplate: 'notFound',
	// show the loading template whilst the subscriptions below load their data
	loadingTemplate: 'loading',
});

Router.map(function () {

	this.route('chat', {
		path: '/chat/',
		yieldTemplates: {
            "chatLeftMenu": {to: "leftMenu"},
            "chatLeftMenuHeader": {to: "leftMenuHeader"}
		},
		waitOn: function () {
			// return one handle, a function, or an array
			return [
				Meteor.subscribe('userPresences'),
				Meteor.subscribe('allUsers')
			];
		},
		onBeforeAction: function () {
			Session.setAuth('route', 'chat');
			this.next();
		}

	});
	this.route('todos', {
		path: '/todos/',
		yieldTemplates: {
			"todosLeftMenu": {to: "leftMenu"}
		},
		onBeforeAction: function () {
			Session.setAuth('route', 'todos');
			this.next();
		}
	});

	this.route('home', {
		path: '/',
		action: function () {
			Router.go(Session.get('route') || 'chat');
		}
	});
});
