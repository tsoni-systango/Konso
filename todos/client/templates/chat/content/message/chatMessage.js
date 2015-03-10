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
		var timestamp = getUnreadTimestamp(getCurrentDialog()._id);
		return this.created > timestamp && this.ownerId !== Meteor.userId();
	}
});
