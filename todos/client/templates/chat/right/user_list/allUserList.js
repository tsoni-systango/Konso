Template.allUserList.onCreated(function(){
    var self = this;
    self.autorun(function() {
        var filterString = IM.getUsersFilterString();
        var opts = {limit: 100};
        if(typeof filterString != "undefined" && filterString.toString().length > 1){
            opts.searchString = filterString;
        }
        self.subscribe('users', opts);
    });

    self.onSearchInput = _.debounce(function(val){
        IM.setUsersFilterString(val);
    },  1000);
})
Template.allUserList.helpers({
    roomUsers: function () {
        var dialog = IM.getCurrentDialog();
        if(dialog && dialog.type === DialogTypes.ROOM){
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
        if(dialog && dialog.type === DialogTypes.ROOM){
            if(!(dialog = Dialogs.findOne(dialog._id))){
                return;
            };
            var usersIds = dialog.userIds.concat(Meteor.userId());
            return Meteor.users.find({_id: {$nin: usersIds}},
                {sort: {"profile.sortName": 1} });
        }
        return Meteor.users.find({_id: {$ne: Meteor.userId()}},
            {sort: {"profile.sortName": 1} });
    }
})  

Template.allUserList.events({
    "input .filter-users": function (e,t) {
        t.onSearchInput($(e.target).val());
    }
})