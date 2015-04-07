Template.chatMessage.destroyed = function () {
    $(window).off('mouseup', this.onWindowClick);
}
Template.chatMessage.rendered = function () {
    var self = this;
    this.onWindowClick = function(e) {
        var tgt = $(e.target);
        var message = $(e.target).closest(".chat-message");
        if(!tgt.is("#"+self.data._id+" .delete-message") && !tgt.is("#"+self.data._id+" .edit-message")){
            $(self.firstNode).removeClass("edit-mode");
        }
    };
    $(window).on('mouseup', this.onWindowClick);
    $(this.firstNode).trigger("message-added");
}
Template.chatMessage.helpers({
    ownerClass: function () {
        if (Meteor.userId() === this.ownerId) {
            return "own";
        }
    },
    isRemoved: function(){
      return this.removed;
    },
    systemClass: function () {
        if (!this.ownerId) {
            return "system-message";
        }
    },
    ownerName: function () {
        if (this.ownerId) {
            var user = Meteor.users.findOne(this.ownerId);
            return Utils.getUsername(user);
        }
    },
    isUnread: function () {
        var timestamp = IM.getCurrentDialogUnreadTimestamp();
        return this.created > timestamp && this.ownerId !== Meteor.userId();
    },
    time: function () {
        return moment(this.created).format('MMM Do, h:mm a');
    },
    canEdit: function () {
        return Meteor.userId() === this.ownerId;
    }
});
Template.chatMessage.events({
    "click .edit": function (e, t) {
        $(t.firstNode).toggleClass("edit-mode");
    },
    "click .delete-message": function (e, t) {
        Meteor.call("removeMessage", this._id, GlobalUI.generalCallback());
    },
    "click .undo": function (e, t) {
        Meteor.call("recoverMessage", this._id, GlobalUI.generalCallback());
    }
});