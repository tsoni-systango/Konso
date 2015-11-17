Template.persistenceIndicator.helpers({
    cssClass: function () {
        var p = UserPresences.findOne({userId: this.userId});
        if (p && p.state === "idle") {
            return "idle";
        } else if (p) {
            return "online";
        }
        return "offline";
        // Alternative version via Meteor.users
        //var p = Meteor.users.findOne({_id: this.userId});
        //if (p&&p.profile.presence === 1){
        //    return "idle";
        //} else if (p.profile.presence === 2){
        //    return "online";
        //}
        //return "offline";
	}
});