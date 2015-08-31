Meteor.publish "checkIns", (ruleId, weekOffset)->
	if @userId
		Checkins.find(
			{
				ruleId: ruleId
				$and:[
					{date: $lt: moment().endOf("isoweek").add(weekOffset, "week").toDate().getTime()}
					{date: $gte: moment().startOf("isoweek").add(weekOffset, "week").toDate().getTime()}
				]
			}
		)
	else
		@ready()


Meteor.publish "checkInRule", (id)->
	CheckinRules.find _id: id

Meteor.publish "checkinRules", ->
	if @userId and PrivilegesUtils.canAddCheckins(Meteor.users.findOne(@userId))
		return CheckinRules.find()
	else if @userId
		return CheckinRules.find {userId: @userId}
	else
		@ready()

Meteor.publish "checkinRequired", ->
	if this.userId
		return CheckinRules.find {userId: this.userId}