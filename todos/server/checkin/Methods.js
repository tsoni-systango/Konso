Meteor.methods({
	newCheckinRule: function(checkinRule){
		if(!Utils.isUserInGroup(Meteor.user(), Meteor.settings.public.privileges.addCheckins)){
			Errors.throw(Errors.PERMISSION_DENIED);
		}
		check(checkinRule.startDate, Number)
		check(checkinRule.endDate, Number)

		var id = CheckinRules.insert(obj);

	},
	removeCheckinRule: function(id){
		if(!Utils.isUserInGroup(Meteor.user(), Meteor.settings.public.privileges.addCheckins)){
			Errors.throw(Errors.PERMISSION_DENIED);
		}
		CheckinRules.remove({_id: id});
	}
})