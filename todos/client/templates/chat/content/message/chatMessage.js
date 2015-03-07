Template.chatMessage.helpers({
	ownerClass: function(){
		if(Meteor.userId() === this.ownerId){
			return "own";
		}
	},
	ownerName: function(){
		var user = Meteor.users.findOne(this.ownerId);
		return user.username;
	}
});