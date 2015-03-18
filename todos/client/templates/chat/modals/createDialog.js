Template.createDialog.helpers({
	label: function () {
        if (this.type === DialogTypes.CHANNEL) {
			return "Channel name";
        } else if (this.type === DialogTypes.ROOM) {
			return "Room name";
		}
	}
});
Template.createDialog.events({
	"submit [data-action=new-dialog]": function (e) {
        e.preventDefault();
        var t = Template.instance();
        if(t.submited){
            return false;
        }
        t.submited = true;
		var self = this;
		var $form = $(e.target);
		if ($form[0].valid) {
			var dialogName = $form.find("#dialogName").val();
			var isPrivate;
			Meteor.call(
					"createDialog",
					dialogName,
                self.type,
					GlobalUI.generalModalCallback(onSuccess, onError)
					);
		}
		function onSuccess(dialogId) {
			var newDialog = Dialogs.findOne(dialogId);
            IM.setCurrentDialog(newDialog);
            t.submited = false;
		}
        function onError(msg) {
            t.submited = false;
		}
        return false;
	}
});
