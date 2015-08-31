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

Router.onBeforeAction(function () {
	if (!Meteor.userId()) {
		this.layout(null);
		this.render('login');
	} else {
		this.next();
	}
});

Router.map(function () {
	this.route('/login', {
		name: "login"
	});
	this.route('/chat/:id?', {
		name: 'chat',
		yieldTemplates: {
			"chatLeftMenu": {to: "leftMenu"}
		},
		waitOn: function () {
			return [
				Meteor.subscribe("usersList"),
				Meteor.subscribe('dialogs'),
				Meteor.subscribe('userPresences')
			];
		},
		onBeforeAction: function () {
			if (this.params.id) {
				var dialog = Dialogs.findOne(this.params.id);
				IM.setCurrentDialog(dialog);
			}

			this.next();
		}
	});
	this.route('/todos', {
		name: 'todos',
		yieldTemplates: {
			"todosLeftMenu": {to: "leftMenu"}
		},
		onBeforeAction: function () {

			this.next();
		}
	});

	this.route('/', {
		name: 'home',
		action: function () {
			Router.go('chat');
		}
	});

	this.route('/embedded', {
		name: 'embedded',
		action: function () {
			Session.set("embedded", "embedded");
			Router.go('chat');
		}
	});
	this.route('uploads', {
		path: '/cfs/files/uploads',
		action: function () {
			Router.go('chat');
		}
	});

	/*
	 * Checkin
	 */

	this.route('/checkin/:ruleId', {
		name: 'checkin',
		template: "checkin",
		yieldTemplates: {
			"left_menu_checkin": {to: "leftMenu"},
			"allUserList": {to: "rightMenu"}
		},
		waitOn: function () {
			return [Meteor.subscribe("usersList")]
		},
		onBeforeAction: function () {
			this.next();
		},
		data: function () {
			if (this.params.ruleId) {
				return {
					ruleId: this.params.ruleId
				}
			}
		}
	});
	this.route('/checkins/:userId?', {
		name: 'checkins',
		template: "checkins",
		yieldTemplates: {
			"left_menu_checkin": {to: "leftMenu"},
			"allUserList": {to: "rightMenu"}
		},
		waitOn: function () {
			return [Meteor.subscribe("usersList"), Meteor.subscribe("checkinRules")]
		},
		onBeforeAction: function () {
			this.next();
		},
		data: function () {
			return {
				userId: this.params.userId
			}
		}
	});
	this.route('/checkin-reports', {
		name: 'checkin_reports',
		template: "checkin_reports",
		yieldTemplates: {
			"left_menu_checkin": {to: "leftMenu"},
			"allUserList": {to: "rightMenu"}
		},
		waitOn: function () {
			return [Meteor.subscribe("usersList"), Meteor.subscribe("checkinRules")]
		},
		onBeforeAction: function () {
			this.next();
		}
	});
});
