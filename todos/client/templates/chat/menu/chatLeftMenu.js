Meteor.subscribe("dialogs")
Meteor.subscribe('lastDialogMessage');

Template.chatLeftMenu.helpers({
    channels: function(){
        return Dialogs.find({channelId: {$ne:null}, isPrivate: false});
    },
	dialogs: function(){
		return Dialogs.find({}, {sort: {created: -1}});
	},
	rooms: function(){
		return Dialogs.find({channelId: {$ne:null}, isPrivate: true});
	}
})


