Meteor.methods({
    sendMessage: function (text, attachmentIds, mentions, dialogId) {
        if (text.trim() === "") {
            Errors.throw("Message is empty");
        }
        var message = {};
        message.ownerId = getCurrentUserOrDie()._id;
        message.text = text;
        message.attachmentIds = attachmentIds;
        message.mentions = mentions;
        var dialog = getDialogOrDie(dialogId)
        isUserAuthorizedInDialog(dialog, message.ownerId);
        message.dialogId = dialogId;
        message.created = _.now();
        message._id = Messages.insert(message);
        Dialogs.update(dialogId, {$set: {updated: message.created}});
        return message;
    },
    removeMessage: function(messageId){
        check(messageId, String);
        var message = Messages.findOne(messageId);
        if(message.ownerId !== getCurrentUserOrDie()._id){
            Errors.throw(Errors.PERMISSION_DENIED);
        }
        Messages.update(messageId, {$set: {removed: true, text: null, attachmentIds:null, mentions: null, removedContent:{text: message.text, attachmentIds: message.attachmentIds, mentions: message.mentions}}});
    },
    recoverMessage: function(messageId){
        check(messageId, String);
        var message = Messages.findOne(messageId);
        if(message.ownerId !== getCurrentUserOrDie()._id || !message.removed){
            Errors.throw(Errors.PERMISSION_DENIED);
        }
        Messages.update(messageId, {$set: {removed: false, text: message.removedContent.text, attachmentIds: message.removedContent.attachmentIds, mentions: message.removedContent.mentions, removedContent: null}});
    },
    getMessageCount: function (dialogId) {
        return Messages.find({dialogId: dialogId}).count();
    },
    initOneToOneDialog: function (userId) {
        var currentUser = getCurrentUserOrDie();
        var dialogUser = getUserOrDie(userId);
        var dialog = Dialogs.findOne({
            channelId: null,
            type: DialogTypes.ONE_TO_ONE,
            userIds: {
                $all: [
                    currentUser._id,
                    dialogUser._id
                ]
            }
        });

        if (!dialog) {
            dialog = {
                created: _.now(),
                ownerId: currentUser._id,
                updated: null,
                type: DialogTypes.ONE_TO_ONE,
                channelId: null,
                userIds: [currentUser._id, dialogUser._id]
            };
            dialog._id = Dialogs.insert(dialog);
        }
        return dialog._id;
    },
    getUnreadMessagesCountForTimestamp: function (dialogId, timestamp, excludeUserId) {
        check(dialogId, String);
        check(timestamp, Number);
        check(excludeUserId, String);
        var count = Messages.find({
            dialogId: dialogId,
            created: {$gt: timestamp},
            ownerId: {$ne: excludeUserId}
        }).count();
        return count;
    },
    createDialog: function (name, type) {
        check(name, String);
        type === DialogTypes.CHANNEL && isUserHasPrivilegesToCreateChannels();
        !name.trim() && Errors.throw("Name is empty");

        var currentUser = getCurrentUserOrDie();
        var dialog = {
            ownerId: currentUser._id,
            created: _.now(),
            updated: null,
            name: name,
            type: type,
            userIds: [currentUser._id]
        };
        dialog._id = Dialogs.insert(dialog);
        console.log("created dialog: ", dialog._id);
        return dialog;
    },
    addUserToDialog: function (dialogId, userId) {
        check(dialogId, String);
        check(userId, String);
        var dialog = getDialogOrDie(dialogId);
        var user = getUserOrDie(userId);
        isUserOwnerOfDialog(dialog, Meteor.userId());
        if (_.contains(dialog.userIds, userId)) {
            Error.throw("User has been added already");
        }
        dialog.userIds.push(userId);
        Dialogs.update(dialogId, {$set: {userIds: dialog.userIds}})
        addSystemMessage(dialogId,
            Utils.getUsername(Meteor.user())
            + " added "
            + Utils.getUsername(user)
            + " to conversation")
    },
    removeUserFromDialog: function (dialogId, userId) {
        check(dialogId, String);
        check(userId, String);
        var dialog = getDialogOrDie(dialogId);
        var user = getUserOrDie(userId);
        isUserOwnerOfDialog(dialog, Meteor.userId());
        if (!_.contains(dialog.userIds, userId)) {
            Error.throw("User does not belong to this dialog");
        }
        Dialogs.update(dialogId, {$set: {userIds: _.without(dialog.userIds, userId)}})
        addSystemMessage(dialogId,
            Utils.getUsername(Meteor.user())
            + " removed  "
            + Utils.getUsername(user)
            + " from conversation")
    }
});

addSystemMessage = function (dialogId, text) {
    var message = {};
    message.ownerId = null;
    message.text = text;
    message.dialogId = dialogId;
    message.created = _.now();
    message._id = Messages.insert(message);
}