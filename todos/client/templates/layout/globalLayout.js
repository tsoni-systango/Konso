Template.globalLayout.events({
    "click #main-dialog-ok": function (e, t) {
        t.$("#main-modal").find("form").submit();
    },
    "click #main-dialog-cancel": function (e, t) {
        GlobalUI.closeDialog();
    }

});
Template.globalLayout.helpers({
    isStatus: function (val) {
        /*connected
         connecting
         failed
         waiting
         offline
         */
        return Meteor.status().status === val;
    },
    isErrorToast: function () {
        return GlobalUI.isErrorToast.get();
    },
    progressCSSDisplay: function () {
        return GlobalUI.isProgressVisible.get() ? "block" : "none";
    },
    contentCSSDisplay: function () {
        return GlobalUI.isProgressVisible.get() ? "none" : "block";
    },
    showSettings: function () {
        return Session.get("global.ui.showSettings");
    }
});

Template.globalLayout.onRendered(function () {
    var self = this;
    var wasConnected = true;
    Meteor.setTimeout(function () {
        self.autorun(function () {
            console.log(Meteor.status().status)
            if (Meteor.status().connected && !wasConnected) {
                GlobalUI.htmlToast('<i class="light-green-text text-darken-1 mdi-hardware-cast-connected left small"></i> '+ TAPi18n.__("connection.online"))
            }
            wasConnected = Meteor.status().connected;
        });
    }, 5000);

    var html = $('html'),
        body = $('body'),
        showDrag = false,
        timeout = -1;

    html.bind('dragenter', function () {
        body.addClass('dragging');
        showDrag = true;
    });
    html.bind('dragover', function () {
        showDrag = true;
    });
    html.bind('drop', function () {
        body.removeClass('dragging');
        showDrag = false;
    });
    html.bind('dragleave', function (e) {
        showDrag = false;
        Meteor.clearTimeout(timeout);
        timeout = Meteor.setTimeout(function () {
            if (!showDrag) {
                body.removeClass('dragging');
            }
        }, 200);
    });

    $(document).on("keyup", function (e) {
        if (e.keyCode === 27) {
            GlobalUI.closeDialog();
            GlobalUI.closeSettings();
            GlobalUI.closeAttachmentView();
        }
    })
});