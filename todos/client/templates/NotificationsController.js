/**
 * Growl-like notifications controller
 */
NotificationsController = new function () {
    var self = this;
    this.emmitMessageNotificationIfNeeded = function (dialog, message) {
        if (Meteor.userId() && isPossible() && Meteor.userId() !== message.ownerId) {
            notifications.forEach(function (n) {
                if (self.isNotificationActive(n.id) && n.show(dialog, message)) {
                    emit();
                }
            })
        }
        function emit() {
            var messageOwner = Meteor.users.findOne(message.ownerId, {reactive: false});
            var n = new Notification(Utils.getUsername(messageOwner), {body: message.text});
            n.onclick = function () {
                Router.go("chat", {id: dialog._id});
                window.focus();
            }
        }
    };
    this.getNotifications = function () {
        return notifications;
    };
    this.isNotificationActive = function (id) {
        return getUserOptions()[id];
    }
    this.setNotification = function (id, value) {
        var key = notificationsNamespace + "." + id;
        var obj = {};
        obj[key] = value;
        Meteor.users.update(Meteor.userId(), {$set: obj});
    }
}
var notificationsNamespace = "profile.growlNotifications";

var notifications = [
    {
        id: "channels",
        title: "All channel messages",
        show: function (dialog, message) {
            return dialog.type === DialogTypes.CHANNEL;
        }
    },
    {
        id: "rooms",
        title: "All room messages",
        show: function (dialog, message) {
            return dialog.type === DialogTypes.ROOM;
        }
    },
    {
        id: "one-to-one",
        title: "All one-to-one messages",
        show: function (dialog, message) {
            return dialog.type === DialogTypes.ONE_TO_ONE;
        }
    },
    {
        id: "mention_you",
        title: "When @you mentioned",
        show: function (dialog, message) {
            return message.mentions && _.find(message.mentions, function (o) {
                    return o.id === Meteor.userId()
                });
        }
    },
    {
        id: "mentions_all",
        title: "When @all mentioned",
        show: function (dialog, message) {
            return message.mentions && !!_.find(message.mentions, function (o) {
                    return o.id === Mentions.ALL_ID
                });
        }
    }
]

var getUserOptions = function () {
    var u;
    if (u = Meteor.user()) {
        return Utils.getByKey(u, notificationsNamespace) || {}
    }
    return {};
}

var isPossible = function () {
    return window.hasOwnProperty("Notification") && Notification.permission === "granted" && !!document.hasFocus && !document.hasFocus();
}
