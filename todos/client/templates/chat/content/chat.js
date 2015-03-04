Tracker.autorun(function () {
	var currentDialog = getCurrentDialog();
	if (currentDialog) {
		Meteor.subscribe("messages", currentDialog._id);
	}
})

Template.chat.rendered = function () {

}

Template.chat.helpers({
	allUsers: function () {
		return Meteor.users.find();
	},
	chatMessages: function () {
		return Messages.find({}, {sort: {"created": -1}});
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
				console.log(e)
				console.log(r)
			})
		}
	}
});


