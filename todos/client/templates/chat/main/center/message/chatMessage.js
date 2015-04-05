Template.chatMessage.rendered = function(){
    $(this.firstNode).trigger("message-added");
}
Template.chatMessage.helpers({
	ownerClass: function(){
		if(Meteor.userId() === this.ownerId){
			return "own";
		}
    },
    systemClass: function () {
        if (!this.ownerId) {
            return "system-message";
        }
	},
	ownerName: function(){
        if (this.ownerId) {
            var user = Meteor.users.findOne(this.ownerId);
            return Utils.getUsername(user);
        }
	},
	isUnread: function(){
        var timestamp = IM.getCurrentDialogUnreadTimestamp();
		return this.created > timestamp && this.ownerId !== Meteor.userId();
	},
    time: function(){
		return moment(this.created).format('MMM Do, h:mm a');
	}
});
