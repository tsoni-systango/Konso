Meteor.publish("userPresences", function () {
  return UserPresences.find();
});
Meteor.publish("allUsers", function () {
   return Meteor.users.find({}, {fields: {username: 1,emails: 1, profile: 1}});
});
Meteor.publish("messages", function (dialogId, limit) {
	var limit = limit || 50;
   return Messages.find({dialogId: dialogId}, {sort: {timestamp: 1}, limit: limit });
});