Template.createDialog.events({
    "submit form": function (e, t) {
        e.preventDefault();
        var self = this;
        var $form = $(e.currentTarget);
        if ($form) {
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
            Router.go("chat", {id: dialogId});
        }

        function onError(msg) {
            GlobalUI.errorToast(msg);
        }

        return false;
    }
});
