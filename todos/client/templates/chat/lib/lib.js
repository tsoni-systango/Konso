CURRENT_DIALOG_ID_KEY = "CURRENT_DIALOG_ID_KEY";
setCurrentDialog = function(dialog){
	Session.setAuth(CURRENT_DIALOG_ID_KEY, dialog);
}
getCurrentDialog = function(){
	return Session.get(CURRENT_DIALOG_ID_KEY);
}

getDialogName = function (dialog) {
	if(!dialog){
		return null;
	}
	if (dialog.channelId) {
		return "Some Channel";
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