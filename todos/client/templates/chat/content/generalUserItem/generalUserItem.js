Template.generalUserItem.helpers({
	avatarUrl:function(){
		return '/icon/user/rand_1.png';
	}
})
Template.generalUserItem.events({
	"click .general-user-item": function(e){
		
		Meteor.call('initOneToOneDialog', this._id, function(error, dialogId){
			setCurrentDialog(Dialogs.findOne(dialogId));
		});
	}
})

