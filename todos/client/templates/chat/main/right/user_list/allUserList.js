Template.allUserList.helpers({
    roomUsers: function () {
        var dialog = IM.getCurrentDialog();
        if(dialog && dialog.type === DialogTypes.ROOM && dialog.ownerId === Meteor.userId()){
            if(!(dialog = Dialogs.findOne(dialog._id))){
                return;
            };
            var usersIds = _.without(dialog.userIds, Meteor.userId());
            return Meteor.users.find({_id: {$in: usersIds}},
                {sort: {"profile.sortName": 1} });
        }
    },
    users: function () {
        var dialog = IM.getCurrentDialog();
        if(dialog && dialog.type === DialogTypes.ROOM && dialog.ownerId === Meteor.userId()){
            if(!(dialog = Dialogs.findOne(dialog._id))){
                return;
            };
            var usersIds = dialog.userIds.concat(Meteor.userId());
            return Meteor.users.find({_id: {$nin: usersIds}},
                {sort: {"profile.sortName": 1} });
        }
        return Meteor.users.find({_id: {$ne: Meteor.userId()}},
            {sort: {"profile.sortName": 1} });
    },
    i18nSearchUsers : function () {
        return '搜索用户';
    }
})  

Template.allUserList.events({
    "input .filter-users": function (e) {
        IM.setUsersFilterString($(e.target).val());
    }
})