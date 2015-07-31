Template.generalUserItem.onCreated(function () {
    this.name = Utils.getUsername(this.data);
    this.isProcessingUser = new ReactiveVar(false);
});
Template.generalUserItem.helpers({
    avatarUrl: function () {
        return '/icon/user/rand_1.png';
    },
    username: function () {
        return Template.instance().name;
    },
    isProcessingUser: function () {
        return Template.instance().isProcessingUser.get();
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
})
Template.generalUserItem.events({
    "click .general-user-item": function (e, t) {
        return
        if(t.isProcessingUser.get()){
            return false;
        }
        var $tgt = $(e.target);
        var dialog = IM.getCurrentDialog();
        if ($tgt.closest(".add-to-dialog").length) {
            t.isProcessingUser.set(true);
            Meteor.call('addUserToDialog', dialog._id, this._id, GlobalUI.generalCallback(onProcessingComplete));
        } else if ($tgt.closest(".remove-from-dialog").length) {
            t.isProcessingUser.set(true);
            Meteor.call('removeUserFromDialog', dialog._id, this._id, GlobalUI.generalCallback(onProcessingComplete));
        } else {
            Meteor.call('initOneToOneDialog', this._id, GlobalUI.generalCallback(function (dialogId) {
                Router.go("chat", {id: dialogId});
            }));
        }
        function onProcessingComplete(){
            t.isProcessingUser.set(false);
        }
    }
})

