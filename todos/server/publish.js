Meteor.publish("userPresences", function () {
    return UserPresences.find();
});
Meteor.publish("allUsers", function () {
    return Meteor.users.find({}, {fields: {username: 1, emails: 1, profile: 1, groups: 1}});
});
Meteor.publish("dialogs", function () {
    if (this.userId) {
        return Dialogs.find({$or: [{userIds: {$in: [this.userId]}}, {type: DialogTypes.CHANNEL}]});
    }
});
Meteor.publish("uploads", function (ids) {
    if (this.userId && ids) {
        return Uploads.find({_id: {$in: ids}});
    }
});
Meteor.publish("messages", function (dialogId, limit) {
    if (this.userId && dialogId) {
        check(dialogId, String);
        isUserAuthorizedInDialog(Dialogs.findOne(dialogId), this.userId);
        var limit = limit || 50;
        return Messages.find({dialogId: dialogId}, {sort: {created: -1}, limit: limit, fields: {removedContent: false}});
    }
});
Meteor.publish("lastDialogMessage", function (dialogId) {
    if (this.userId && dialogId) {
        var self = this;
        check(dialogId, String);
        var dialog = getDialogOrDie(dialogId);
        isUserAuthorizedInDialog(dialog, self.userId)
        return Messages.find({dialogId: dialogId},
            {
                limit: 1,
                sort: {created: -1}
            });

    }
});