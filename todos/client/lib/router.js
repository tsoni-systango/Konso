Router.configure({
	autoRender: false,
	autoStart: false,
	// we use the  appBody template to define the layout for the entire app
	layoutTemplate: 'layout',
	// the notFound template is used for unknown routes and missing lists
	notFoundTemplate: 'notFound',
	// show the loading template whilst the subscriptions below load their data
	loadingTemplate: 'loading'
});

Router.onBeforeAction(function(){
	if(!Meteor.user()){
		this.layout(null);
		this.render('login');
	} else {
		this.next();
	}
});

Router.map(function () {
	this.route('login', {
		path: "/login/"
	});
	this.route('chat', {
		path: '/chat/:id?',
		yieldTemplates: {
            "chatLeftMenu": {to: "leftMenu"}
		},
		waitOn: function () {
			return [
                Meteor.subscribe('allUsers'),
				Meteor.subscribe('userPresences')
			];
		},
		onBeforeAction: function () {
			if(this.params.id) {
				IM.setCurrentDialog(Dialogs.findOne(this.params.id));
			}
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
