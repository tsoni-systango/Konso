/**
 * Growl-like notifications controller
 */
NotificationsController = null;
Meteor.startup(function () {
	NotificationsController = new function () {
		var self = this;
		this.emmitMessageNotificationIfNeeded = function (dialog, message) {
			if (Meteor.userId() && isPossible() && Meteor.userId() !== message.ownerId) {
				notifications.forEach(function (n) {
					if (self.isNotificationActive(n.id) && n.show(dialog, message) && !self.isShownBefore(dialog, message)) {
						Preferences.set(Preferences.LAST_CHAT_NOTIFICATION_TIMESTAMPS + "." + dialog._id, message.created);
						emit();
					}
				})
			}
			function emit() {
				var messageOwner = Meteor.users.findOne(message.ownerId, {reactive: false});
				var n = new Notification(Utils.getUsername(messageOwner), {body: message.text});
				n.onclick = function () {
					Router.go("chat", {id: dialog._id});
					window.focus();
				}
			}

		};
		this.getNotifications = function () {
			return notifications;
		};
		this.isNotificationActive = function (id) {
			return getUserOptions()[id];
		}
		this.setNotification = function (id, value) {
			var key = GrowlNotificationsNamespace + "." + id;
			var obj = {};
			obj[key] = value;
			Meteor.users.update(Meteor.userId(), {$set: obj});
		}
		this.isShownBefore = function (dialog, message) {
			var timestamp = Preferences.get(Preferences.LAST_CHAT_NOTIFICATION_TIMESTAMPS + "." + dialog._id, true) || 0;
			return message.created <= timestamp;
		}
	}

	var notifications = [
		{
			id: GrowlNotificationTypes.ALL_CHANNELS,
			title: "All channel messages",
			show: function (dialog, message) {
				return dialog.type === DialogTypes.CHANNEL;
			}
		},
		{
			id: GrowlNotificationTypes.ALL_ROOMS,
			title: "All room messages",
			show: function (dialog, message) {
				return dialog.type === DialogTypes.ROOM;
			}
		},
		{
			id: GrowlNotificationTypes.ALL_ONE_TO_ONE,
			title: "All one-to-one messages",
			show: function (dialog, message) {
				return dialog.type === DialogTypes.ONE_TO_ONE;
			}
		},
		{
			id: GrowlNotificationTypes.MENTION_YOU,
			title: "When @you mentioned",
			show: function (dialog, message) {
				return message.mentions && _.find(message.mentions, function (o) {
						return o.id === Meteor.userId()
					});
			}
		},
		{
			id: GrowlNotificationTypes.MENTION_ALL,
			title: "When @all mentioned",
			show: function (dialog, message) {
				return message.mentions && !!_.find(message.mentions, function (o) {
						return o.id === Mentions.ALL_ID
					});
			}
		}
	]

	var getUserOptions = function () {
		var u;
		if (u = Meteor.user()) {
			return Utils.getByKey(u, GrowlNotificationsNamespace) || {}
		}
		return {};
	}

	var isPossible = function () {
		return window.hasOwnProperty("Notification") && Notification.permission === "granted" && !!document.hasFocus && !document.hasFocus();
	}

})