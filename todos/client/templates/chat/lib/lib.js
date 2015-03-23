IM = {};
(function () {
    IM.CURRENT_DIALOG_ID_KEY = "CURRENT_DIALOG_ID_KEY";
    IM.CURRENT_DIALOG_UNREAD_COUNT_KEY = "CURRENT_DIALOG_UNREAD_COUNT_KEY";

    IM.FILTER_DIALOGS_KEY = "FILTER_DIALOGS_KEY";
    IM.FILTER_USERS_KEY = "FILTER_USERS_KEY";

    IM.setUsersFilterString = function (value) {
        Session.set(IM.FILTER_USERS_KEY, value);
    };

    IM.getFilterUsersString = function () {
        return Session.get(IM.FILTER_USERS_KEY);
    };

    IM.setDialogsFilterString = function (value) {
        Session.set(IM.FILTER_DIALOGS_KEY, value);
    };

    IM.getFilterDialogsString = function () {
        return Session.get(IM.FILTER_DIALOGS_KEY);
    };

    IM.setCurrentDialog = function (dialog) {
        var currDialog = Session.get(IM.CURRENT_DIALOG_ID_KEY);
        if (!currDialog || currDialog._id !== dialog._id) {
            Session.setAuth(IM.CURRENT_DIALOG_ID_KEY, dialog);
            IM.setDialogsFilterString(null);
        }
    };

    IM.getCurrentDialog = function () {
        return Session.get(IM.CURRENT_DIALOG_ID_KEY);
    };
    IM.getCurrentDialogId = function () {
        var d = IM.getCurrentDialog();
        return d ? d._id : null;
    };

    IM.getCurrentDialogUnreadTimestamp = function () {
        var dialog = IM.getCurrentDialog();
        if (!dialog) {
            return null;
        }
        return Meteor.user().profile.readTimestamps[dialog._id] || 0;
    };

    IM.getChatName = function (dialog) {
        if (!dialog) {
            return null;
        }
        if (dialog.name) {
            return dialog.name;
        } else {
            console.log(Meteor.users.find({}).fetch())
            var dialogUsers = Meteor.users.find({
                _id: {
                    $in: _.without(dialog.userIds, Meteor.userId())
                }
            }).fetch();
            console.log("users: ", dialogUsers)
            if (_.isEmpty(dialogUsers)) {
                return "Unknown Dialog";
            }
            return _.reduce(dialogUsers, function (m, el) {
                return m + " " + Utils.getUsername(el);
            }, "");
        }
    };
    IM.setCurrentDialogUnreadMessageCount = function(value){
        Session.set(IM.CURRENT_DIALOG_UNREAD_COUNT_KEY, value);
    };
    IM.getCurrentDialogUnreadMessageCount = function(){
        return Session.get(IM.CURRENT_DIALOG_UNREAD_COUNT_KEY);
    };
    IM.updateReadTimestamp = function (value) {
        var profile = Meteor.user().profile;
        var currentTimestamp = IM.getCurrentDialogUnreadTimestamp();
        var newValue = value || _.now();
        if (newValue < currentTimestamp) {
            return;
        }
        profile.readTimestamps[IM.getCurrentDialog()._id] = value || _.now();
        Meteor.users.update(Meteor.userId(),
            {
                $set: {
                    profile: profile
                }
            });
    };
    IM.evaluateAndUpdateReadTimestamp = function () {
        if(!IM.getCurrentDialogUnreadMessageCount()){
            return;
        }
        var $messagesContainer = $('.messages-container');
        var y = $messagesContainer.offset().top + $messagesContainer.height() - 10;
        var x = $messagesContainer.offset().left + 5;
        var el = $(document.elementFromPoint(x, y)).closest(".chat-message");
        var created = Number(el.attr("created"));

        if (created) {
            console.log("updated")
            IM.updateReadTimestamp(created);
        }
    };
})();