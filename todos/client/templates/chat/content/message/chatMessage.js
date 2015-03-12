Template.chatMessage.helpers({
	ownerClass: function(){
		if(Meteor.userId() === this.ownerId){
			return "own";
		}
	},
	ownerName: function(){
		var user = Meteor.users.findOne(this.ownerId);
		return user.username;
	},
	isUnread: function(){
        var timestamp = IM.getCurrentDialogUnreadTimestamp();
		return this.created > timestamp && this.ownerId !== Meteor.userId();
	}
});
