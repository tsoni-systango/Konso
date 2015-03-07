Template.chatMessage.helpers({
	ownerClass: function(){
		if(Meteor.userId() === this.ownerId){
			return "own";
		}
	}
});