IM = {};
(function () {
    IM.CURRENT_DIALOG_ID_KEY = "CURRENT_DIALOG_ID_KEY";

    IM.setCurrentDialog = function (dialog) {
        Session.setAuth(IM.CURRENT_DIALOG_ID_KEY, dialog);
    };

    IM.getCurrentDialog = function () {
        return Session.get(IM.CURRENT_DIALOG_ID_KEY);
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
        var $messagesContainer = $('.messages-container');
        var y = $messagesContainer.offset().top + $messagesContainer.height() - 10;
        var x = $messagesContainer.offset().left + 5;
        var el = $(document.elementFromPoint(x, y)).closest(".chat-message");
        var created = Number(el.attr("created"));

        if (created) {
            console.log("updated")
            IM.updateReadTimestamp(created);
        }
    }
})();