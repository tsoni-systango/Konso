Meteor.subscribe("dialogs")
Meteor.subscribe('lastDialogMessage');
Meteor.subscribe('channels');
Template.chatLeftMenu.helpers({
	channels: function () {
		return Dialogs.find({channelId: {$ne: null},isPrivate: false}, {sort: {updated: -1}});
	},
	dialogs: function () {
		return Dialogs.find({isPrivate: true, channelId: null}, {sort: {updated: -1}});
	},
	rooms: function () {
		return Dialogs.find({channelId: {$ne: null}, isPrivate: true}, {sort: {updated: -1}});
	}
});
Template.chatLeftMenu.events({
	"click .chat-left-menu .create-channel": function (e) {
		GlobalUI.showDialog({
			data: {
				type: DIALOG_TYPE_CHANNEL
			},
			template: 'createDialog'
		})
	},
	"click .chat-left-menu .create-room": function (e) {
		GlobalUI.showDialog({
			data: {
				type: DIALOG_TYPE_ROOM
			},
			template: 'createDialog'
		})
	}
});


