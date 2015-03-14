Template.allUserList.helpers({
    users: function () {
        return Meteor.users.find({_id: {$ne: Meteor.userId()}});
    }
})

Template.allUserList.events({
    "input .filter-users": function (e) {
        IM.setUsersFilterString($(e.target).val());
    }
})