Meteor.publish("tasks", function (dialogId) {
    if (dialogId){
        return Tasks.find({dialogId: dialogId});
    }else{
        return Tasks.find({});
    }
});
