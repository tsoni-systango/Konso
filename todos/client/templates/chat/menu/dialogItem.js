Template.dialogItem.created = function () {
	var self = this;
	Meteor.subscribe("lastDialogMessage", self.data._id);

	self.lastMessage = new ReactiveVar();
	self.unreadMessageCount = new ReactiveVar();
	self.onlineUsers = new ReactiveVar();
	self.offlineUsers = new ReactiveVar();

	this.autorun(function () {
		if (!Meteor.userId()) {
			return;
		}
		var message = Messages.findOne({dialogId: self.data._id}, {
			sort: {created: -1}
		});
		self.lastMessage.set(message);
		Meteor.call("getUnreadMessagesCountForTimestamp",
				self.data._id,
				Meteor.user().profile.readTimestamps[self.data._id] || 0,
				Meteor.userId(), function (er, count) {
			self.unreadMessageCount.set(count);
		});
	});

	this.autorun(function () {
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
		self.offlineUsers.set(reactiveDialog.userIds.length - 1 - onlineCount);
		self.onlineUsers.set(onlineCount);
	});
}
Template.dialogItem.helpers({
	title: function () {
		var dialog = Dialogs.findOne(this._id);
		return getChatName(dialog);
	},
	selected: function () {
		var currentDialog = getCurrentDialog();
		if (currentDialog && currentDialog._id === this._id) {
			return "selected";
		}
	},
	unreadCount: function () {
		return Template.instance().unreadMessageCount.get();
	},
	lastMessage: function () {
		return Template.instance().lastMessage.get();
	},
	onlineCount: function () {
		return Template.instance().onlineUsers.get();
	},
	offlineCount: function () {
		return Template.instance().offlineUsers.get();
	},
	presenceStyle: function () {
		return Template.instance().onlineUsers.get() ? "online": "offline";
	}
});
Template.dialogItem.events({
	"click .dialog-item": function () {
		setCurrentDialog(this);
	}
});
