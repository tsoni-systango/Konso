Template.chatMessage.helpers({
	ownerClass: function(){
		console.log(this)
		if(Meteor.userId() === this.ownerId){
			return "own";
		}
	}
});