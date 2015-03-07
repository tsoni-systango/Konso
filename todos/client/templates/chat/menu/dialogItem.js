Template.dialogItem.created = function () {
	var self = this;
	Meteor.subscribe("lastDialogMessage", self.data._id);

	self.data.lastMessage = new ReactiveVar();
	self.data.unreadMessageCount = new ReactiveVar();
	self.data.onlineUsers = new ReactiveVar();
	self.data.offlineUsers = new ReactiveVar();

	Tracker.autorun(function () {
		if (!Meteor.userId()) {
			return;
		}
		var message = Messages.findOne({dialogId: self.data._id}, {
			sort: {created: -1}
		});
		self.data.lastMessage.set(message);
		Meteor.call("getUnreadMessagesCountForTimestamp",
				self.data._id,
				Meteor.user().profile.readTimestamps[self.data._id] || 0,
				Meteor.userId(), function (er, count) {
			self.data.unreadMessageCount.set(count);
		});
	});

	Tracker.autorun(function () {
		if (!Meteor.userId()) {
			return;
		}
		var reactiveDialog = Dialogs.findOne(self.data._id);
		var userPersences = UserPresences.find({userId: {$in: reactiveDialog.userIds, $ne: Meteor.userId()}}).fetch();
		var onlineCount = 0;
		userPersences.forEach(function (obj) {
			if (obj.state === "online" || obj.state === "idle") {
				onlineCount++;
			}
		});
		self.data.offlineUsers.set(reactiveDialog.userIds.length - 1 - onlineCount);
		self.data.onlineUsers.set(onlineCount);
	});
}
Template.dialogItem.helpers({
	title: function () {
		var dialog = Dialogs.findOne(this._id);
		return getDialogName(dialog);
	},
	selected: function () {
		var currentDialog = getCurrentDialog();
		if (currentDialog && currentDialog._id === this._id) {
			return "selected";
		}
	},
	unreadCount: function () {
		return this.unreadMessageCount.get();
	},
	lastMessage: function () {
		return this.lastMessage.get();
	},
	onlineCount: function () {
		return this.onlineUsers.get();
	},
	offlineCount: function () {
		return this.offlineUsers.get();
	},
	presenceStyle: function () {
		return this.onlineUsers.get() ? "online": "offline";
	}
});
Template.dialogItem.events({
	"click .dialog-item": function () {
		setCurrentDialog(this);
	}
});