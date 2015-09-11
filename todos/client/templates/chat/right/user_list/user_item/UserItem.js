Template.UserItem.onCreated(function(){

});
Template.UserItem.helpers({
    "data": function(){
        return Meteor.users.findOne(this._id);
    },
    isUserCouldBeAdded: function () {
        var curDialog = Dialogs.findOne(IM.getCurrentDialogId());
        return curDialog
            && curDialog.type === DialogTypes.ROOM
            && curDialog.ownerId === Meteor.userId()
            && !_.contains(curDialog.userIds, this._id);
    },
    isUserCouldBeRemoved: function () {
        var curDialog = Dialogs.findOne(IM.getCurrentDialogId());
        return curDialog
            && curDialog.type === DialogTypes.ROOM
            && curDialog.ownerId === Meteor.userId()
            && _.contains(curDialog.userIds, this._id);
    }
});

Template.UserItem.events({
    "click #user-properties": function(e, t){
        var $tgt = $(e.target);
        if ($tgt.closest(".add").length) {
            //t.isProcessingUser.set(true);
            Meteor.call('addUserToDialog', IM.getCurrentDialogId(), this._id, GlobalUI.generalCallback(onProcessingComplete));
        } else if ($tgt.closest(".remove").length) {
            //t.isProcessingUser.set(true);
            Meteor.call('removeUserFromDialog', IM.getCurrentDialogId(), this._id, GlobalUI.generalCallback(onProcessingComplete));
        } else if ($tgt.closest(".conversation").length) {
            Meteor.call('initOneToOneDialog', this._id, GlobalUI.generalCallback(function (dialogId) {
                Router.go("chat", {id: dialogId});
                onProcessingComplete();
            }));
        }
        function onProcessingComplete(){
            //t.isProcessingUser.set(false);
            t.$(".close-user-menu").click();
        }
    }
})