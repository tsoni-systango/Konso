Template.chat.created = function () {
    var self = this;
    self.dialogId = IM.getCurrentDialogId();
    self.dialogMessageCount = new ReactiveVar();
    self.messagesToShow = new ReactiveVar(50);
    self.autorun(function () {
        if (IM.getCurrentDialogId() !== self.dialogId) {
            self.messagesToShow.set(50);
            self.dialogId = IM.getCurrentDialogId();
        }
        Meteor.call('getMessageCount', self.dialogId, function (err, count) {
            var count = count || 0;
            self.dialogMessageCount.set(count);
        });
    });
    self.autorun(function () {
        var dialogId = IM.getCurrentDialogId();
        self.subscribe("messages", dialogId, self.messagesToShow.get(), function(){
           GlobalUI.closeLeftMenu();
           $('.chat')[0].closeDrawer();
        });
        self.subscribe("uploads", dialogId);
    });
}
Template.chat.rendered = function () {
    var self = this;
    self.$chatContainer = self.$('.chat');
    self.$messagesContainer = self.$('.messages-container');
    self.$newMessageForm = self.$('#chat-message-form');
    self.$dialogMenu = self.$('.dialog-menu');

//this is to mark messages read
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
//========================

    var onScrollDebounced = _.debounce(function () {
        var scrollTop = self.$messagesContainer.scrollTop(),
            height = self.$messagesContainer.height(),
            scrollHeight = self.$messagesContainer[0].scrollHeight;
        var scroll = scrollHeight - scrollTop - height;
        if (!scroll) {
            self.currentScrollId = Number.MAX_VALUE;
        } else {
            self.currentScrollId = scrollTop;
        }
    }, 250);
    this.autorun(function(){
       var lastMessage = Messages.findOne({dialogId: IM.getCurrentDialogId()}, {sort: {"created": -1}, limit: 1});
        if(lastMessage) {
            self.currentScrollId = lastMessage._id;
        }
    });

    self.currentScrollId = "last-message";
    var onMessageAddedDebounced = _.debounce(function () {
        window.location.hash = self.currentScrollId;
    }, 50)
    self.$messagesContainer.on("message-added", onMessageAddedDebounced);
    //self.$messagesContainer.on("scroll", onScrollDebounced);
}
Template.chat.destroyed = function () {
    var self = this;
    Meteor.clearInterval(self.intervalId);
    self.$messagesContainer.off()
    self.$newMessageForm.off()
}

Template.chat.helpers({
    currentDialog: function () {
        return IM.getCurrentDialog();
    },
    hasMoreMessages: function () {
        return Template.instance().messagesToShow.get() < Template.instance().dialogMessageCount.get();
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
            return Messages.find({
                dialogId: currentDialog._id,
                created: {$gt: IM.getCurrentDialogUnreadTimestamp()}
            }, {sort: {"created": 1}});
        }
    },
    hasUnreadMessages: function(){
        var count = Messages.find({ownerId: {$ne: Meteor.userId()}, dialogId: IM.getCurrentDialogId(), created: {$gt: IM.getCurrentDialogUnreadTimestamp()}}).count();
        return !!count;
    },
    currentDialogName: function () {
        return IM.getChatName(IM.getCurrentDialog());
    },
    isMessagesReady: function () {
        if (IM.getCurrentDialog()) {
            return Template.instance().subscription.ready()
        }
    },
    i18nTypeYourMessage: function(){
        return '输入信息';
    },
    i18nChooseUserToChat: function(){
        return '选择聊天伙伴';
    }
});

Template.chat.events({
    "click .welcome-btn, click .all-users-button": function (e) {
        $(".chat")[0].togglePanel();
    },
    "click .show-more": function () {
        Template.instance().$messagesContainer.scrollTop(1);
        var current = Template.instance().messagesToShow.get();
        Template.instance().messagesToShow.set(current + 50);
    },
    "trackend .messages-container": function () {
        console.log("trackend");
    },
    "click .minify-btn": function(e, t){
        postMessageParent("collapse");
        t.$(".maximize-btn").show();
        t.$(".minify-btn").hide();
        t.$(".all-users-button").hide();
    },
    "click .maximize-btn": function(e, t){
        postMessageParent("expand");
        t.$(".maximize-btn").hide();
        t.$(".minify-btn").show();
        t.$(".all-users-button").show();
    },
    "mousedown .dialog-menu": function(e, t){
        postMessageParent("startdrag")
    }
});

