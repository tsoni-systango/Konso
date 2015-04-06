IM = new function () {
    var self = this;
    self.CURRENT_DIALOG_ID_KEY = "CURRENT_DIALOG_ID_KEY";

    self.FILTER_DIALOGS_KEY = "FILTER_DIALOGS_KEY";
    self.FILTER_USERS_KEY = "FILTER_USERS_KEY";

    self.unreadMessagesForDialogsMap = {};

    self.setUsersFilterString = function (value) {
        Session.set(self.FILTER_USERS_KEY, value);
    };

    self.getFilterUsersString = function () {
        return Session.get(self.FILTER_USERS_KEY);
    };

    self.setDialogsFilterString = function (value) {
        Session.set(self.FILTER_DIALOGS_KEY, value);
    };

    self.getFilterDialogsString = function () {
        return Session.get(self.FILTER_DIALOGS_KEY);
    };

    self.setCurrentDialog = function (dialog) {
        var currDialog = Session.get(self.CURRENT_DIALOG_ID_KEY);
        if (currDialog !== dialog) {
            Session.setAuth(self.CURRENT_DIALOG_ID_KEY, dialog);
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

    self.getCurrentDialogUnreadTimestamp = function () {
        var dialog = self.getCurrentDialog();
        if (!dialog || !Meteor.user()) {
            return null;
        }
        return Meteor.user().profile.readTimestamps[dialog._id] || 0;
    };

    self.getChatName = function (dialog) {
        if (!dialog) {
            return null;
        }
        if (dialog.name) {
            return dialog.name;
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
    self.getCurrentDialogUnreadMessageCount = function(){
        return self.unreadMessagesForDialogsMap[self.getCurrentDialogId()];
    };
    self.updateReadTimestamp = function (value) {
        var profile = Meteor.user().profile;
        var currentTimestamp = self.getCurrentDialogUnreadTimestamp();
        var newValue = value || _.now();
        if (newValue < currentTimestamp) {
            return;
        }
        profile.readTimestamps[self.getCurrentDialog()._id] = value || _.now();
        Meteor.users.update(Meteor.userId(),
            {
                $set: {
                    profile: profile
                }
            });
    };
    self.evaluateAndUpdateReadTimestamp = function () {
        if(!self.getCurrentDialogUnreadMessageCount()){
            return;
        }
        var $messagesContainer = $('.messages-container');
        var y = $messagesContainer.offset().top + $messagesContainer.height() - 10;
        var x = $messagesContainer.offset().left + 5;
        var el = $(document.elementFromPoint(x, y)).closest(".chat-message");
        var created = Number(el.attr("created"));

        if (created) {
            console.log("updated read timestamp")
            self.updateReadTimestamp(created);
        }
    };
};