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
	var limit = limit || 50;
	return Messages.find({dialogId: dialogId}, {sort: {timestamp: 1}, limit: limit});
});