Meteor.publish "checkIns", (ruleId, weekOffset)->
	if @userId
		r = CheckinRules.findOne(ruleId);
		m = moment();
		if m.toDate().getTime() > r.endDate
			m = moment(r.endDate-1);
		else if m.toDate().getTime() < r.startDate
			m = moment(r.startDate+1);
		m.add(weekOffset, "week")
		v = Checkins.find(
			{
				ruleId: ruleId
				$and:[
					{date: $lt: m.endOf("isoweek").toDate().getTime()}
					{date: $gte: m.startOf("isoweek").toDate().getTime()}
				]
			}
		)
		console.log(v.fetch())
		v
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