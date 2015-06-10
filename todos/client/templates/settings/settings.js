Template.settings.onRendered(function () {
    var self = this;
    self.autorun(function () {
        if (self.userGrowlNotificationStatus.get() === "granted") {
            self.$(".a-chat-notifications input").removeAttr("disabled");
        } else {
            self.$(".a-chat-notifications input").attr("disabled", "disabled");
        }
    });
    self.$('#settings-content select').material_select();
})
Template.settings.onCreated(function () {
    this.embeddedPosition = new ReactiveVar({bottom: 0, right: 0});
    this.embeddedHeight = new ReactiveVar(400);
    this.embeddedWidth = new ReactiveVar(300);
    //notification
    this.userGrowlNotificationStatus = new ReactiveVar(window.hasOwnProperty("Notification")? Notification.permission : null);
    this.allowingNotifications = new ReactiveVar(false);
})
Template.settings.helpers({
    scriptContent: function () {
        return '<script>var IM_CHAT_WIDGET_EMBEDDED = {' +
            'host: "' + window.location.host + '",width: ' + Template.instance().embeddedWidth.get()
            + ',height: ' +
            Template.instance().embeddedHeight.get() + ',position: ' + JSON.stringify(Template.instance().embeddedPosition.get()) + '}' +
            '</script><script src="//' + window.location.host + '/widget/chat.embedded.js"></script>'
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
    notificationControls: function (id) {
        return NotificationsController.getNotifications();
    },
    isNotificationChecked: function (id) {
        return NotificationsController.isNotificationActive(id) ? "checked" : "";
    },
    getDialogTypes: function () {
        return DialogTypes;
    },
    widgetWidth: function () {
        return Template.instance().embeddedWidth.get();
    },
    widgetHeight: function () {
        return Template.instance().embeddedHeight.get();
    },
    isLanguageSelected: function(id){
        return id === SETTINGS.language()? "selected":"";
    },
    allLanguages: function () {
        var l = TAPi18n.getLanguages();
        var r = [];
        _.keys(l).forEach(function (key) {
            r.push({
                id: key,
                name: l[key].name,
                en: l[key].en
            })
        })
        return r;
    }
});
Template.settings.events({
    "change .embeddable-script input": function (e, t) {
        var currPos = t.embeddedPosition.get();
        var pos = $(e.currentTarget).attr("id");
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
    "input .embedded-width input": function (e, t) {
        t.embeddedWidth.set($(e.currentTarget).val());
    },
    "input .embedded-height input": function (e, t) {
        t.embeddedHeight.set($(e.currentTarget).val());
    },
    "click .allow-notifications-button": function (e, t) {
        t.allowingNotifications.set(true);
        Notification.requestPermission(function (r) {
            t.allowingNotifications.set(false);
            t.userGrowlNotificationStatus = new ReactiveVar(Notification.permission);

            //bug or whatever
            if (Notification.permission === "granted") {
                t.$(".a-chat-notifications input").removeAttr("disabled");
            } else {
                t.$(".a-chat-notifications input").attr("disabled", "disabled");
            }
        });
    },
    "change .a-chat-notifications input": function (e) {
        var id = $(e.currentTarget).attr('id');
        var val = e.currentTarget.checked;
        NotificationsController.setNotification(id, val);
    },
    "change #language-select": function (e) {
        SETTINGS.language($(e.currentTarget).val())
    }
})