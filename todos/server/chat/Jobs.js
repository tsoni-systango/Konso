findAndSendUnreadMessagesToEmails = function () {

	Dialogs.find({}).forEach(function (dialog) {
		dialog.userIds.forEach(function (userId) {
			var user = Meteor.users.findOne(userId);
			if (needToSendEmail(dialog, user) && typeof user.emails === "string") {
				var emailTimestamp = Utils.multikeyVal(user, "profile.preferences.LAST_EMAIL_NOTIFICATION_TIMESTAMPS." + dialog._id) || 0;
				var readTimestamp = Utils.multikeyVal(UserReadTimestamps.findOne({
						userId: user._id,
						dialogId: dialog._id
					}), "timestamp") || 0;
				var email = "";
				Messages.find({
						dialogId: dialog._id,
						$and: [{created: {$gt: emailTimestamp}}, {created: {$gt: readTimestamp}}]
					},
					{sort: {created: 1}}).forEach(function (message) {
					email += construct(message);
					emailTimestamp = message.created;
				});
				if (email) {
					MailSender.send(userId, dialog._id, email);
					var modifier = {$set: {}};
					modifier.$set["profile.preferences.LAST_EMAIL_NOTIFICATION_TIMESTAMPS." + dialog._id] = emailTimestamp;
					Meteor.users.update({_id: user._id}, modifier);
				}
			}
		});
	});

}
function needToSendEmail(dialog, user) {
	return dialog.type === DialogTypes.ONE_TO_ONE && Utils.multikeyVal(user, "profile.preferences.IS_EMAIL_NOTIFICATIONS_DIALOG") ||
		dialog.type === DialogTypes.ROOM && Utils.multikeyVal(user, "profile.preferences.IS_EMAIL_NOTIFICATIONS_ROOM") ||
		dialog.type === DialogTypes.CHANNEL && Utils.multikeyVal(user, "profile.preferences.IS_EMAIL_NOTIFICATIONS_CHANNEL");
}

function construct(message) {
	var displayName = Meteor.users.findOne(message.ownerId).profile.displayName;
	return "<p><b>" + displayName + "</b></p><p>" + message.text + "</p>";
}