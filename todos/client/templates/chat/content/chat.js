Template.chat.created = function () {
    var self = this;
    this.autorun(function () {
        var currentDialog = IM.getCurrentDialog();
        if (currentDialog) {
            self.subscription = Meteor.subscribe("messages", currentDialog._id);
        }
    });
}
Template.chat.rendered = function () {
    var self = this;
    self.$messagesContainer = $('.messages-container');
    self.$newMessageForm = $('#chat-message-form');
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


    this.autorun(function () {
        var users = Meteor.users.find({_id: {$ne: Meteor.userId()}}).fetch();
        var suggestions = _.pluck(users, "username");
        suggestions.push(["All"]);
        self.$newMessageForm.find('textarea').asuggest(suggestions);
    });

}
Template.chat.destroyed = function () {
    var self = this;
    Meteor.clearInterval(self.intervalId);
    self.$messagesContainer.off()
    self.$newMessageForm.off()
}

Template.chat.helpers({
    allUsers: function () {
        return Meteor.users.find({_id: {$ne: Meteor.userId()}});
    },
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
            Meteor.call('sendMessage', text, IM.getCurrentDialog()._id, function (e, r) {

            })
        }
    }
});

