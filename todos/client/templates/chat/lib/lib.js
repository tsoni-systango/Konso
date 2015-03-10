CURRENT_DIALOG_ID_KEY = "CURRENT_DIALOG_ID_KEY";
DIALOG_TYPE_CHANNEL = "DIALOG_TYPE_CHANNEL";
DIALOG_TYPE_ROOM = "DIALOG_TYPE_ROOM";
setCurrentDialog = function (dialog) {
	Session.setAuth(CURRENT_DIALOG_ID_KEY, dialog);
}
getCurrentDialog = function () {
	return Session.get(CURRENT_DIALOG_ID_KEY);
}
getUnreadTimestamp = function (dialogId) {
	return Meteor.user().profile.readTimestamps[dialogId] || 0;
}

getChatName = function (dialog) {
	if (!dialog) {
		return null;
	}
	if (dialog.channelId) {
		var channel = Channels.findOne(dialog.channelId);
		if(channel){
			return channel.name;
		} else {
			return "Unknown channel";
		}
	} else {
		var dialogUsers = Meteor.users.find({_id: {$in: dialog.userIds}});
		var defaultName = "";
		dialogUsers.forEach(function (el) {
			if (el._id !== Meteor.user()._id) {
				defaultName += el.username;
			}
		})
		return defaultName;
	}
}
setReadedTimestamp = function (dialogId) {
	var dialogTimestamp = {};
	dialogTimestamp[dialogId] = timestamp();
	Meteor.users.update(
			Meteor.userId(),
			{
				$set: {
					profile: {
						readedTimestamps: dialogTimestamp
					}
				}
			});
}