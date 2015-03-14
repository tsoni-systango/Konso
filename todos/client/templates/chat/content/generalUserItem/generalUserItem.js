Template.generalUserItem.created = function () {
    this.name = Utils.getUsername(this.data);
}
Template.generalUserItem.helpers({
    avatarUrl: function () {
        return '/icon/user/rand_1.png';
    },
    username: function () {
        return Template.instance().name;
    },
    isVisible: function () {
        var filterString = IM.getFilterUsersString();
        if (!filterString) {
            return true;
        }
        var name = Template.instance().name;
        return name.toLowerCase().indexOf(filterString.toLowerCase()) > -1;
    },
    isUserCouldBeAdded: function () {
        var curDialog = Dialogs.findOne(IM.getCurrentDialog()._id);
        return curDialog
            && curDialog.type === DialogTypes.ROOM
            && curDialog.ownerId === Meteor.userId()
            && !_.contains(curDialog.userIds, this._id);
    },
    isUserCouldBeRemoved: function () {
        var curDialog = Dialogs.findOne(IM.getCurrentDialog()._id);
        return curDialog
            && curDialog.type === DialogTypes.ROOM
            && curDialog.ownerId === Meteor.userId()
            && _.contains(curDialog.userIds, this._id);
    }
})
Template.generalUserItem.events({
    "click .general-user-item": function (e) {
        var $tgt = $(e.target);
        var dialog = IM.getCurrentDialog();
        if ($tgt.is(".add-to-dialog")) {
            Meteor.call('addUserToDialog', dialog._id, this._id);
        } else if ($tgt.is(".remove-from-dialog")) {
            Meteor.call('removeUserFromDialog', dialog._id, this._id);
        } else {
            Meteor.call('initOneToOneDialog', this._id, function (error, dialogId) {
                IM.setCurrentDialog(Dialogs.findOne(dialogId));
            });
        }
    }
})

