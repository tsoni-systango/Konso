Template.chat.created = function () {
    var self = this;
    this.autorun(function () {
        var currentDialog = IM.getCurrentDialog();
        if (currentDialog) {
            self.subscribe("messages", currentDialog._id);
        }
    });
}
Template.chat.rendered = function () {
    var self = this;
    self.$messagesContainer = $('.messages-container');
    self.$newMessageForm = $('#chat-message-form');
    self.$allUsersButton = $('.all-users-button');
    var currentTimeout;
    this.autorun(function () {
        currentTimeout && Meteor.clearTimeout(currentTimeout);
        if (IM.getCurrentDialog()) {
            Meteor.setTimeout(function () {
                self.$messagesContainer.scrollTo('#unread-separator');
                Meteor.clearTimeout(currentTimeout);
            }, 1000);
        }
    });

    var actionHappened;
    self.intervalId = Meteor.setInterval(function () {
        if (actionHappened) {
            IM.evaluateAndUpdateReadTimestamp();
            actionHappened = false;
        }
    }, 3000);

    var debouncedTimestampUpdater = function () {
        actionHappened = true;
    }

    self.$messagesContainer.on('track mousemove scroll click', debouncedTimestampUpdater);
    self.$newMessageForm.on('keyup', debouncedTimestampUpdater);
    self.$allUsersButton.on("click", function () {
        $(".chat")[0].openDrawer();
    })

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
        self.$newMessageForm.find('textarea').asuggest(self.suggestions);
    });

    $('body #style-block')
        .html(
        "<style> " +
        ".chat-message [mentions=" + Meteor.userId() + "]," +
        ".chat-message [mentions=all]" +
        "{" +
        "background: #3b73af;" +
        "border: 1px solid #3b73af;" +
        "color: #fff; " +
        "} " +
        "</style>")

}
Template.chat.destroyed = function () {
    var self = this;
    Meteor.clearInterval(self.intervalId);
    self.$messagesContainer.off()
    self.$newMessageForm.off()
    self.$allUsersButton.off()
}

Template.chat.helpers({
    chatMessages: function () {
        var currentDialog = IM.getCurrentDialog();
        if (currentDialog) {
            return Messages.find({
                dialogId: currentDialog._id,
                created: {$lte: IM.getCurrentDialogUnreadTimestamp()}
            }, {sort: {"created": -1}});
        }
    },
    chatMessagesUnread: function () {
        var currentDialog = IM.getCurrentDialog();
        if (currentDialog) {
            return Messages.find({
                dialogId: currentDialog._id,
                created: {$gt: IM.getCurrentDialogUnreadTimestamp()}
            }, {sort: {"created": -1}});
        }
    },
    currentDialogName: function () {
        return IM.getChatName(IM.getCurrentDialog());
    },
    isMessagesReady: function () {
        if (IM.getCurrentDialog()) {
            return Template.instance().subscription.ready()
        }
    }
});

Template.chat.events({
    "keydown #chat-message-form textarea": function (e) {
        var $textarea = $(e.currentTarget);
        var text = $textarea.val();
        if (e.keyCode === 13 && text.trim()) {
            e.preventDefault();
            $textarea.val('');
            var suggestions = Template.instance().suggestions;
            var suggestionsMap = Template.instance().suggestionsMap;
            suggestions.forEach(function (s) {
                var mentionSubject = suggestionsMap[s]._id;
                var regexp = new RegExp(s, "g");
                text = text.replace(regexp,
                    '<span class="mention" mentions="' + mentionSubject + '">' + s + '</span>'
                )
            })
            Meteor.call('sendMessage', text, IM.getCurrentDialog()._id, function (e, r) {

            })
        }
    }
});

