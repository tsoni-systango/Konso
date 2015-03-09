Template.createDialog.events({
	"submit [data-action=new-dialog]": function(e){
		var self = this;
		var $form = $(e.target);
        if($form[0].valid){
			var dialogName = $form.find("#dialogName").val();
			var methodName;
			if(self.type === DIALOG_TYPE_CHANNEL){
				methodName = "createChannel";
			} else if(self.type === DIALOG_TYPE_ROOM){
				methodName = "createRoom";
			}
			Meteor.call(methodName, dialogName, generalCallback);
		}
	}
});
