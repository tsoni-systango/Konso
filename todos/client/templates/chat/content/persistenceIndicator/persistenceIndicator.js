Template.persistenceIndicator.helpers({
    cssClass: function () {
        var p = UserPresences.findOne({userId: this.userId});
        if (p && p.state === "idle") {
            return "idle";
        } else if (p) {
            return "online";
        }
        return "offline";
	}
});