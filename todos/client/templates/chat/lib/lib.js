IM = new function () {
    var self = this;
    self.CURRENT_DIALOG_ID_KEY = "CURRENT_DIALOG_ID_KEY";

    self.FILTER_DIALOGS_KEY = "FILTER_DIALOGS_KEY";
    self.FILTER_USERS_KEY = "FILTER_USERS_KEY";

    self.unreadMessagesForDialogsMap = {};
    self.messagesCountForDialogMap = {};

    self.setUsersFilterString = function (value) {
        Session.set(self.FILTER_USERS_KEY, value);
    };

    self.getUsersFilterString = function () {
        return Session.get(self.FILTER_USERS_KEY);
    };

    self.setDialogsFilterString = function (value) {
        Session.set(self.FILTER_DIALOGS_KEY, value);
    };

    self.getFilterDialogsString = function () {
        return Session.get(self.FILTER_DIALOGS_KEY);
    };

    self.updateMessageAttachmentsDraft = function(draft){
        var keyNamespace = "message-drafts.attachments."
        Session.set(keyNamespace + IM.getCurrentDialogId(), draft);
    };

    self.addMessageAttachmentsDraft = function(id){
        var drafts = IM.getMessageAttachmentsDraft();
        drafts = drafts || [];
        drafts.push(id);
        self.updateMessageAttachmentsDraft(drafts);
    };
    self.getMessageAttachmentsDraft = function(){
        var key = "message-drafts.attachments." + IM.getCurrentDialogId();
        return Session.get(key);
    };

    self.updateMessageTextDraft = function(draft){
        var key = "message-drafts.text." + self.getCurrentDialogId();
        Session.set(key, draft);
    };

    self.getMessageTextDraft = function(){
        var keyNamespace = "message-drafts.text."
        return Session.get(keyNamespace + IM.getCurrentDialogId());
    }

    self.setCurrentDialog = function (dialog) {
        var currDialog
        Tracker.nonreactive(function(){
            currDialog = Session.get(self.CURRENT_DIALOG_ID_KEY);
        })
        if (currDialog !== dialog) {
            Session.set(self.CURRENT_DIALOG_ID_KEY, dialog);
            self.setDialogsFilterString(null);
        }

    };
    self.getCurrentDialog = function () {
        return Session.get(self.CURRENT_DIALOG_ID_KEY);
    };
    self.getCurrentDialogId = function () {
        var d = self.getCurrentDialog();
        return d ? d._id : null;
    };

    self.getDialogUnreadTimestamp = function (dialogId) {
        var dialogId = dialogId || Tracker.nonreactive(self.getCurrentDialogId);
        if (!dialogId || !Tracker.nonreactive(Meteor.userId)) {
            return null;
        }
        var t = UserReadTimestamps.findOne({dialogId: dialogId});
        return t ? t.timestamp : 0;
    };
    self.setDialogUnreadTimestamp = function (timestamp, dialogId) {
        var dialogId = dialogId || Tracker.nonreactive(self.getCurrentDialogId);
        if (!dialogId || !Tracker.nonreactive(Meteor.userId)) {
            return null;
        }
        var t = UserReadTimestamps.findOne({dialogId: dialogId});
        if(t){
            UserReadTimestamps.update(t._id, {$set: {timestamp: timestamp}});
        } else {
            UserReadTimestamps.insert({dialogId: dialogId, timestamp: timestamp, userId: Meteor.userId()});
        }
    };
    self.getCurrentDialogUnreadMessageCount = function(){
        return self.unreadMessagesForDialogsMap[self.getCurrentDialogId()];
    };
    self.getChatName = function (dialog, template) {
        if (!dialog) {
            return null;
        }
        if (dialog.name) {
            return (dialog.type === DialogTypes.CHANNEL? "#": "") + dialog.name;
        } else {
            var dialogUsers = Meteor.users.find({
                _id: {
                    $in: _.without(dialog.userIds, Meteor.userId())
                }
            }).fetch();
            if (_.isEmpty(dialogUsers)) {
                return "Unknown Dialog";
            }
            return _.reduce(dialogUsers, function (m, el) {
                return m + " " + Utils.getUsername(el);
            }, "");
        }
    };
};