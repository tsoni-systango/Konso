Meteor.publish "checkIns", (ruleId, weekOffset)->
	if @userId
		Checkins.find(
			{
				ruleId: ruleId
				$and:[
					date: $lte: moment().endOf("week").add(weekOffset, "week").toDate().getTime()
					date: $gt: moment().startOf("week").add(weekOffset, "week").toDate().getTime()
				]
			},
			{
				limit: 7
			}
		)

	else
		@ready()


Meteor.publish "checkInRule", (id)->
	CheckinRules.find _id: id