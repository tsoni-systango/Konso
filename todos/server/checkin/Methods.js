Meteor.methods({
	newCheckinRule: function(checkinRule){
		if(!Utils.isUserInGroup(Meteor.user(), Meteor.settings.public.privileges.addCheckins)){
			Errors.throw(Errors.PERMISSION_DENIED);
		}
		check(checkinRule.startDate, String);
		if (new Date(checkinRule.startDate).getTime()) {
			checkinRule.startDate = moment(checkinRule.startDate).toDate().getTime();
		} else {
			Errors.throw(Errors.START_DATE_REQUIRED);
		}
		if(new Date(checkinRule.endDate).getTime()){
			checkinRule.endDate = moment(checkinRule.endDate).toDate().getTime();
		} else {
			delete checkinRule.endDate
		}
		checkinRule.generatedAll = false;
		checkinRule.lastDayGenerated = checkinRule.startDate;
		var id = CheckinRules.insert(checkinRule);
		CheckinUtils.generateCheckins(id);
		return id;
	},
	removeCheckinRule: function(id){
		if(!Utils.isUserInGroup(Meteor.user(), Meteor.settings.public.privileges.addCheckins)){
			Errors.throw(Errors.PERMISSION_DENIED);
		}
		CheckinRules.remove({_id: id});
		Checkins.remove({ruleId: id});
	}
})