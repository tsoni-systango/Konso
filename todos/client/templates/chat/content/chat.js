Template.chat.created = function () {
    var self = this;
    self.dialogId = IM.getCurrentDialogId();
    self.dialogMessageCount = new ReactiveVar();
    self.messagesToShow = new ReactiveVar(50);
    this.autorun(function () {
        if(IM.getCurrentDialogId() !== self.dialogId){
            self.messagesToShow.set(50);
            self.dialogId =IM.getCurrentDialogId();
        }
        Meteor.call('getMessageCount', self.dialogId, function(err, count){
            var count = count || 0;
            self.dialogMessageCount.set(count);
        })
    });
    this.autorun(function () {
        self.subscribe("messages", IM.getCurrentDialogId(), self.messagesToShow.get());
    });
}
Template.chat.rendered = function () {
    var self = this;
    self.$chatContainer = self.$('.chat');
    self.$messagesContainer = self.$('.messages-container');
    self.$newMessageForm = self.$('#chat-message-form');
    self.$dialogMenu = self.$('.dialog-menu');

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

    self.adjustMessagesContainerHeight = function (){
        var height = self.$chatContainer.height() - 46 - 81;
        self.$messagesContainer.height(height);
    }

    $(window).resize(self.adjustMessagesContainerHeight);
    self.adjustMessagesContainerHeight();
    var onScrollDebounced = _.debounce(function (){
        var scrollTop = self.$messagesContainer.scrollTop(),
            height = self.$messagesContainer.height(),
            scrollHeight = self.$messagesContainer[0].scrollHeight;
        var scroll = scrollHeight-scrollTop-height;
        if(!scroll){
            self.currentScrollPosition = Number.MAX_VALUE;
        } else {
            self.currentScrollPosition = scrollTop;
        }
    }, 250);
    var onMessageAddedDebounced = _.debounce(function(){
        self.$messagesContainer.animate({
            scrollTop: self.currentScrollPosition
        }, 2000);
    }, 250)
    self.$messagesContainer.on("message-added", onMessageAddedDebounced );
    self.$messagesContainer.on("scroll", onScrollDebounced);

}
Template.chat.destroyed = function () {
    var self = this;
    Meteor.clearInterval(self.intervalId);
    self.$messagesContainer.off()
    self.$newMessageForm.off()
    $(window).off('resize', self.adjustMessagesContainerHeight);
}

Template.chat.helpers({
    currentDialog: function(){
      return IM.getCurrentDialog();
    },
    hasMoreMessages: function(){
      return  Template.instance().messagesToShow.get() < Template.instance().dialogMessageCount.get();
    },
    chatMessages: function () {
        var currentDialog = IM.getCurrentDialog();
        if (currentDialog) {
            return Messages.find({
                dialogId: currentDialog._id,
                created: {$lte: IM.getCurrentDialogUnreadTimestamp()}
            }, {sort: {"created": 1}});
        }
    },
    chatMessagesUnread: function () {
        var currentDialog = IM.getCurrentDialog();
        if (currentDialog) {
            return self.messages = Messages.find({
                dialogId: currentDialog._id,
                created: {$gt: IM.getCurrentDialogUnreadTimestamp()}
            }, {sort: {"created": 1}});
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
    },
    "click .welcome-btn, click .all-users-button": function(e){
        $(".chat")[0].togglePanel();
    },
    "click .show-more": function(){
        Template.instance().$messagesContainer.scrollTop(1);
        var current = Template.instance().messagesToShow.get();
        Template.instance().messagesToShow.set(current + 50);
    },
    "trackend .messages-container": function(){
        console.log("trackend");
    }
});

