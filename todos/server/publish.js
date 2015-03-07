Meteor.publish("userPresences", function () {
	return UserPresences.find();
});
Meteor.publish("allUsers", function () {
	return Meteor.users.find({}, {fields: {username: 1, emails: 1, profile: 1}});
});
Meteor.publish("dialogs", function () {
	var self = this;
	if (self.userId) {
		return Dialogs.find({userIds: {$in: [self.userId]}});
	}
});
Meteor.publish("messages", function (dialogId, limit) {
	check(dialogId, String);
	var limit = limit || 50;
	return Messages.find({dialogId: dialogId}, {sort: {created: -1}, limit: limit});
});
Meteor.publish("lastDialogMessage", function (dialogId) {
	if(!dialogId){
		return;
	}
	var self = this;
	check(dialogId, String);
	var dialog = getDialogOrDie(dialogId);
	if(isUserAuthorizedInDialog(dialog, self.userId)){
		console.log('Publishing last message ', dialogId);
		return Messages.find({dialogId: dialogId}, 
			{
				limit: 1,
				sort: {created: -1}
			});
	}
	
});