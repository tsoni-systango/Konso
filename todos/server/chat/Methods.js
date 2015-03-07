Meteor.methods({
	sendMessage: function (text, dialogId) {
		if (text.trim() === "") {
			Errors.throw("Message is empty");
		}
		var message = {};
		message.ownerId = getCurrentUserOrDie()._id;
		message.text = text;
		var dialog = getDialogOrDie(dialogId)
		isUserAuthorizedInDialog(dialog);
		message.dialogId = dialogId;
		message.created = timestamp();
		message._id = Messages.insert(message);
		return message;
	},
	initOneToOneDialog: function (userId) {
		var currentUser = getCurrentUserOrDie();
		var dialogUser = getUserOrDie(userId);
		var dialog = Dialogs.findOne({
			isPrivate: true,
			channelId: null,
			userIds: {$all:
						[
							currentUser._id,
							dialogUser._id
						]
			}});

		if (!dialog) {
			dialog = {
				created: timestamp(),
				isPrivate: true,
				channelId: null,
				userIds: [currentUser._id, dialogUser._id]
			};
			dialog._id = Dialogs.insert(dialog);
		}
		return dialog._id;
	},
	getUnreadMessagesCountForTimestamp:
			function (dialogId, timestamp, excludeUserId) {
				check(dialogId, String);
				check(timestamp, Number);
				check(excludeUserId, String);
				var count = Messages.find({
					dialogId: dialogId, 
					created: {$gt: timestamp},
					ownerId: {$ne: excludeUserId}
				}).count();
				return count;
			}
})