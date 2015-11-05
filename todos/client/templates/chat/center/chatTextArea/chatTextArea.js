Template.chatTextArea.helpers({
    attachments: function () {
        return IM.getMessageAttachmentsDraft();
    }
});

Template.chatTextArea.rendered = function () {
    //this is for @mentions
    var self = this;
    self.$newMessageForm = self.$('#chat-message-form');
    self.$textarea = self.$newMessageForm.find('textarea');
    this.autorun(function () {
        var users = Meteor.users.find({}).fetch();
        self.suggestionsMap = {};
        self.suggestions = _.map(users, function (user) {
            var key = "@" + Utils.getUsername(user);
            self.suggestionsMap[key] = user;
            return key;
        });
        self.suggestions.push("@all");
        self.suggestionsMap["@all"] = {_id: "all"};
        self.suggestions.push("@All");
        self.suggestionsMap["@All"] = {_id: "all"};
        self.$textarea.asuggest(self.suggestions);
    });
//=========================
    self.sendMessage = function () {
        IM.updateMessageTextDraft(self.$textarea.val());
        var suggestions = self.suggestions;
        var suggestionsMap = self.suggestionsMap;
        var attachmentIds = IM.getMessageAttachmentsDraft();
        attachmentIds = _.filter(attachmentIds, function(el){
           var uploaded = el.uploaded.get();
           return uploaded && !uploaded.e && uploaded.r
        });
        attachmentIds = _.map(attachmentIds, function(el){
            return el.uploaded.get().r._id;
        });
        var text = IM.getMessageTextDraft();
        var mentions = [];
        if (text) {
            suggestions.forEach(function (s) {
                var mentionSubject = suggestionsMap[s]._id;
                var regexp = new RegExp(s, "g");
                if (text.match(regexp)) {
                    mentions.push({text: s, id: mentionSubject})
                }
            });
            text = text.replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
        Meteor.call('sendMessage',
            text,
            attachmentIds,
            mentions,
            IM.getCurrentDialog()._id,
            GlobalUI.generalCallback(function () {
                IM.updateMessageTextDraft("");
                IM.updateMessageAttachmentsDraft([]);
                self.$textarea.val("")
            }));
    }
    //=========================
    self.autorun(function () {
        if (IM.getCurrentDialogId()) {
            self.$textarea.val(IM.getMessageTextDraft())
        }
    });
    //=========================File upload==================

    self.uploadFile = function (file, name) {
        var re = FileUtils.uploadMessageAttachment(file, name);
        console.log(re)
        IM.addMessageAttachmentsDraft(re);
    };
}
Template.chatTextArea.events({
    "input #chat-message-form textarea": function (e, t) {
        var $textarea = t.$(e.currentTarget);
        var text = $textarea.val();
        IM.updateMessageTextDraft(text);
    },
    "paste #chat-message-form textarea": function (jQueryEvent, t) {
        var e = jQueryEvent.originalEvent;
        var wasFile = false;
        var items = e.clipboardData.items;
        for (var i = 0; i < items.length; i++) {
            var name = items[i-1];
            var file = items[i];
            if(file.kind === "file") {
                wasFile = true;
                var blob = file.getAsFile();
                if(name && file && name.kind === "string"){
                    name.getAsString(function (_name) {
                        t.uploadFile(blob, _name);
                    });
                } else {
                    t.uploadFile(blob);
                }
            }
        }
        if(wasFile){
            return false;
        }
    },
    "drop .drop-zone": function (jQueryEvent) {
        var e = jQueryEvent.originalEvent;
        var files = e.dataTransfer.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            Template.instance().uploadFile(file);
        }
    },
    "keydown #chat-message-form textarea": function (e, t) {
        var $textarea = t.$(e.currentTarget);
        var text = $textarea.val();
        var attachments = IM.getMessageAttachmentsDraft() || [];
        if (e.keyCode === 13 && !e.shiftKey && (text.trim() !== "" || attachments.length)) {
            console.log(e)
            e.preventDefault();
            t.sendMessage();
        }
    },
    "click .btn-send": function (e, t) {
        var $textarea = t.$('#chat-message-form textarea');
        var text = $textarea.val();
        var attachments = IM.getMessageAttachmentsDraft() || [];
        if ((text.trim() !== "" || attachments.length)) {
            e.preventDefault();
            t.sendMessage();
        }
    },
    "click .btn-attach": function (e, t) {
        //t.$(".upload-control.start").click()
        //t.$(".upload-control.leftButton").click()
    }
});