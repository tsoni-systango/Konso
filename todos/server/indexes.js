Meteor.startup(function () {
    Dialogs._ensureIndex({ "userIds": 1, "type": 1});
    UserReadTimestamps._ensureIndex({"userId": 1, "dialogId": 1});
    Messages._ensureIndex({"dialogId": 1, "created": 1});
    Meteor.users._ensureIndex({"authType": 1});
    Meteor.users._ensureIndex({"profile.sortName": 1});
    Meteor.users._ensureIndex({"profile.sortIndex": 1});
    Meteor.users._ensureIndex({"profile.presence": -1});
});