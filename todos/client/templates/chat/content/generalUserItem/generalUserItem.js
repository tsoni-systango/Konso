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
    }
})
Template.generalUserItem.events({
    "click .general-user-item": function (e) {

        Meteor.call('initOneToOneDialog', this._id, function (error, dialogId) {
            IM.setCurrentDialog(Dialogs.findOne(dialogId));
        });
    }
})

