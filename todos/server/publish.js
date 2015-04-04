Meteor.publish("userPresences", function () {
    return UserPresences.find();
});
Meteor.publish("allUsers", function () {
    return Meteor.users.find({}, {fields: {username: 1, emails: 1, profile: 1}});
});
Meteor.publish("dialogs", function () {
    if (this.userId) {
        return Dialogs.find({$or: [{userIds: {$in: [this.userId]}}, {type: DialogTypes.CHANNEL}]});
    }
});
Meteor.publish("messages", function (dialogId, limit) {
    if (this.userId) {
        check(dialogId, String);
        console.log(1)
        isUserAuthorizedInDialog(Dialogs.findOne(dialogId), this.userId);
        console.log(2)
        var limit = limit || 50;
        console.log(limit)
        return Messages.find({dialogId: dialogId}, {sort: {created: -1}, limit: limit});
    }
});
Meteor.publish("lastDialogMessage", function (dialogId) {
    var self = this;
    check(dialogId, String);
    var dialog = getDialogOrDie(dialogId);
    isUserAuthorizedInDialog(dialog, self.userId)
    return Messages.find({dialogId: dialogId},
        {
            limit: 1,
            sort: {created: -1}
        });


});