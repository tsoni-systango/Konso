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
			var next = this.next;
			var dialogId = this.params.id;
			if (dialogId) {
				var dialog = Dialogs.findOne(dialogId);
				IM.setCurrentDialog(dialog);
				//ensure unread counts and message counts ready for dialog
				function isCountsReady() {
					return typeof IM.unreadMessagesForDialogsMap[dialogId] !== "undefined" &&
							typeof IM.messagesCountForDialogMap[dialogId] !== "undefined";
				}
				if (isCountsReady()) {
					next();
					return;
				}
				var intervalId = Meteor.setInterval(function () {
					if (isCountsReady()) {
						Meteor.clearInterval(intervalId);
						next();
						return;
					}
				}, 50);
			} else {
				next();
				return;
			}
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
			return [Meteor.subscribe("usersList"), Meteor.subscribe('userPresences')]
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
			return [Meteor.subscribe("usersList"),Meteor.subscribe("checkinRules"), Meteor.subscribe('userPresences')]
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
			return [Meteor.subscribe("usersList"), Meteor.subscribe("checkinRules"), Meteor.subscribe('userPresences')]
		},
		onBeforeAction: function () {
			this.next();
		}
	});
});

