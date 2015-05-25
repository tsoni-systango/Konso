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
        self.isCurrentlySubscribingToMessages = true;
        var dialogId = IM.getCurrentDialogId();
        self.subscribe("messages", dialogId, self.messagesToShow.get(), function(){
           GlobalUI.closeLeftMenu();
        });
    });
}
Template.chat.rendered = function () {
    var self = this;
    self.$chatContainer = self.$('.chat');
    self.$messagesContainer = self.$('.messages-container');
    self.$newMessageForm = self.$('#chat-message-form');
    self.$dialogMenu = self.$('.dialog-menu');

    self.readController = new ReadMessageController();

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
    self.readController.destroy();
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
                dialogId: currentDialog._id
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

