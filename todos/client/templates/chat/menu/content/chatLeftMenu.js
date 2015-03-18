Template.chatLeftMenu.created = function () {
    var self = this;
    self.subscribe("dialogs")
    self.autorun(function () {
        $(".filter-dialogs input").val(IM.getFilterDialogsString());
    });
}

Template.chatLeftMenu.helpers({
    channels: function () {
        return Dialogs.find(
            {
                type: DialogTypes.CHANNEL
            }, {sort: {updated: -1}});
    },
    dialogs: function () {
        var currentDialog = IM.getCurrentDialog();
        var condition = {
            type: DialogTypes.ONE_TO_ONE,
            updated: {$ne: null}
        }
        if (currentDialog) {
            condition = {
                $and: [
                    {type: DialogTypes.ONE_TO_ONE},
                    {$or: [{updated: {$ne: null}}, {_id: currentDialog._id}]}
                ]
            }
        }
        return Dialogs.find(condition, {sort: {updated: -1}});
    },
    rooms: function () {
        return Dialogs.find(
            {
                type: DialogTypes.ROOM
            }, {sort: {updated: -1}});
    }
});
Template.chatLeftMenu.events({
    "click .chat-left-menu .create-channel": function (e) {
        GlobalUI.showDialog({
            data: {
                type: DialogTypes.CHANNEL
            },
            template: 'createDialog'
        })
    },
    "click .chat-left-menu .create-room": function (e) {
        GlobalUI.showDialog({
            data: {
                type: DialogTypes.ROOM
            },
            template: 'createDialog'
        })
    },
    "input .filter-dialogs": function (e) {
        IM.setDialogsFilterString($(e.target).val());
    }
});


