Meteor.methods({
	sendMessage: function(text, dialogId){
		if(text.trim() === ""){
			return;
		}
		var message = {};
		message.ownerId = getCurrentUserOrDie()._id;
		message.text = text;
		var dialog = getDialogOrDie(dialogId)
		isUserAuthorizedInDialog(dialog);
		message.dialogId = dialogId;
		message.created = timestamp();
	}
})