Template.createDialog.helpers({
	label: function () {
		if (this.type === DIALOG_TYPE_CHANNEL) {
			return "Channel name";
		} else if (this.type === DIALOG_TYPE_ROOM) {
			return "Room name";
		}
	}
});
Template.createDialog.events({
	"submit [data-action=new-dialog]": function (e) {
		var self = this;
		var $form = $(e.target);
		if ($form[0].valid) {
			var dialogName = $form.find("#dialogName").val();
			var isPrivate;
			if (self.type === DIALOG_TYPE_CHANNEL) {
				isPrivate = false;
			} else if (self.type === DIALOG_TYPE_ROOM) {
				isPrivate = true;
			}
			Meteor.call(
					"createDialog",
					dialogName,
					isPrivate,
					GlobalUI.generalModalCallback(onSuccess)
					);
		}
		function onSuccess(dialogId) {
			var newDialog = Dialogs.findOne(dialogId);
			setCurrentDialog(newDialog);
		}
	}
});
