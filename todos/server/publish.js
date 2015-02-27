Meteor.publish("userPresences", function () {
  return UserPresences.find();
});
Meteor.publish("allUsers", function () {
   return Meteor.users.find({}, {fields: {username: 1,emails: 1, profile: 1}});
});