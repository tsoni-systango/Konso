Template.settings.created = function () {
    this.embeddedPosition = new ReactiveVar({bottom: 0, right: 0});
    this.embeddedHeight = new ReactiveVar(400);
    this.embeddedWidth = new ReactiveVar(256);
    //notification
    this.userGrowlNotificationStatus = new ReactiveVar(Notification.permission);
    this.allowingNotifications = new ReactiveVar(false);
}
Template.settings.helpers({
    scriptContent: function () {
        return '<script>var IM_CHAT_WIDGET_EMBEDDED = {' +
            'url: "' + Meteor.absoluteUrl('embedded') + '",width: ' + Template.instance().embeddedWidth.get()
            + ',height: ' +
            Template.instance().embeddedHeight.get() + ',position: ' + JSON.stringify(Template.instance().embeddedPosition.get()) + '}' +
            '</script><script src="' + Meteor.absoluteUrl('embedded/widget/chat.embedded.js') + '"></script>'
    },
    isNotificationsDisabled: function () {
        return Template.instance().userGrowlNotificationStatus.get() === "denied";
    },
    isNotificationsEnabled: function () {
        return Template.instance().userGrowlNotificationStatus.get() === "granted";
    },
    isNotificationsUnknown: function () {
        return Template.instance().userGrowlNotificationStatus.get() === "default";
    },
    allowingNotifications: function () {
        return Template.instance().allowingNotifications.get();
    },
    isNotificationChecked: function (name) {
        var n = Meteor.user().profile.growlNotifications || {}
        return n[name] ? "checked" : "";
    },
    getDialogTypes: function(){
        return DialogTypes;
    }
});
Template.settings.events({
    "change paper-radio-button": function (e, t) {
        var currPos = t.embeddedPosition.get();
        var pos = $(e.currentTarget).attr("name");
        if (pos === "top" || pos === "bottom") {
            delete currPos.top;
            delete currPos.bottom;
            currPos[pos] = 0;
        } else if (pos === "right" || pos === "left") {
            delete currPos.right;
            delete currPos.left;
            currPos[pos] = 0;
        }
        t.embeddedPosition.set(currPos);
    },
    "immediate-value-change .embedded-width": function (e, t) {
        t.embeddedWidth.set(e.currentTarget.immediateValue);
    },
    "immediate-value-change .embedded-height": function (e, t) {
        t.embeddedHeight.set(e.currentTarget.immediateValue);
    },
    "click .allow-notifications-button": function (e, t) {
        t.allowingNotifications.set(true);
        Notification.requestPermission(function (r) {
            t.allowingNotifications.set(false);
            t.userGrowlNotificationStatus = new ReactiveVar(Notification.permission);
        });
    },
    "change .notifications paper-checkbox": function (e) {
        var name = $(e.currentTarget).attr('name');
        var val = e.currentTarget.checked;
        var currNotifications = Meteor.user().profile.growlNotifications || {};
        currNotifications[name] = val;
        Meteor.users.update(Meteor.userId(), {$set: {"profile.growlNotifications": currNotifications}});
    }
})