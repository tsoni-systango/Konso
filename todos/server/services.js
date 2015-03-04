getCurrentUserOrDie = function () {
	if(!Meteor.user()){
		Errors.throw(Errors.NOT_AUTHENTICATED);
	}
	return Meteor.user();
}
getDialogOrDie = function (dialogId) {
	var dialog = Dialogs.findOne(dialogId);
	if (!dialog) {
		Errors.throw(Errors.DIALOG_NOT_EXISTS);
	}
	return dialog;
}
getUserOrDie = function (userId) {
	var user = Meteor.users.findOne(userId);
	if (!user) {
		Errors.throw(Errors.USER_NOT_EXISTS);
	}
	return user;
}
getChannelOrDie = function (channelId) {
	var channel = Channels.findOne(channelId)
	if (!channel) {
		Errors.throw(Errors.CHANNEL_NOT_EXISTS);
	}
	return channel;
}
timestamp = function(){
	return new Date().getTime();
}
