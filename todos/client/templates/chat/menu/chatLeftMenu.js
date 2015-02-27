Template.chatLeftMenu.helpers({
    users: function(){
        return Meteor.users.find();
    }
})

Template.userItem.helpers({
    isHere: function(){
        return Meteor.users.find();
    }
})

