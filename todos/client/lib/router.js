Router.configure({
	autoRender: true,
	autoStart: true,
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
				var dialog = Dialogs.findOne(this.params.id);
				IM.setCurrentDialog(dialog);
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
	this.route('embedded', {
		path: '/embedded',
		action: function () {
			Session.set("embedded", "embedded");
			Router.go('chat');
		}
	});
	this.route('uploads', {
		path: '/cfs/files/uploads',
		action: function () {
			Session.set("embedded", "embedded");
			Router.go('chat');
		}
	});

});
