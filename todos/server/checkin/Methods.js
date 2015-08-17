Meteor.methods({
	newCheckinRule: function(checkinRule){
		if(!Utils.isUserInGroup(Meteor.user(), Meteor.settings.public.privileges.addCheckins)){
			Errors.throw(Errors.PERMISSION_DENIED);
		}
		var obj = {
			userId: checkinRule.userId,
			startDate: checkinRule.startDate
		}
		if(checkinRule.endDate){
			obj.endDate = checkinRule.endDate
		}
		var id = CheckinRules.insert(obj);
		
	},
	removeCheckinRule: function(id){
		if(!Utils.isUserInGroup(Meteor.user(), Meteor.settings.public.privileges.addCheckins)){
			Errors.throw(Errors.PERMISSION_DENIED);
		}
		CheckinRules.remove({_id: id});
	}
})