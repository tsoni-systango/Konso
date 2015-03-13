Template.generalUserItem.helpers({
	avatarUrl:function(){
		return '/icon/user/rand_1.png';
    },
    username: function () {
        return Utils.getUsername(this);
    }
})
Template.generalUserItem.events({
	"click .general-user-item": function(e){
		
		Meteor.call('initOneToOneDialog', this._id, function(error, dialogId){
            IM.setCurrentDialog(Dialogs.findOne(dialogId));
		});
	}
})

