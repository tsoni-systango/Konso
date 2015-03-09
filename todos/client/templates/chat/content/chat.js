Meteor.subscribe('channels');
Tracker.autorun(function () {
	var currentDialog = getCurrentDialog();
	if (currentDialog) {
		Meteor.subscribe("messages", currentDialog._id);
	}
});

Template.chat.helpers({
	allUsers: function () {
		return Meteor.users.find({_id: {$ne: Meteor.userId()}});
	},
	chatMessages: function () {
		var currentDialog = getCurrentDialog();
		if (currentDialog) {
			return Messages.find({dialogId: currentDialog._id}, {sort: {"created": -1}});
		}
	},
	currentDialogName: function () {
		return getDialogName(getCurrentDialog());
	}
});

Template.chat.events({
	"keydown #chat-message-form textarea": function (e) {
		var $textarea = $(e.currentTarget);
		var text = $textarea.val();
		if (e.keyCode === 13 && text.trim()) {
			e.preventDefault();
			$textarea.val('');
			Meteor.call('sendMessage', text, getCurrentDialog()._id, function (e, r) {

			})
		}
		updateReadTimestamp();
	},
	"mouseover .messages-container": function (e) {
		//updateReadTimestamp();
	}
});

function updateReadTimestamp() {
	var profile = Meteor.user().profile;
	profile.readTimestamps[getCurrentDialog()._id] = timestamp();
	Meteor.users.update(Meteor.userId(),
			{
				$set: {
					profile: profile
				}
			});
}