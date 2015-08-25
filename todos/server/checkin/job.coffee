@.generateCheckins = (checkinRuleId)->
	checkinRule = CheckinRules.findOne checkinRuleId
	nextDay = checkinRule.startDate
	i = 0
	while nextDay < checkinRule.endDate
		nextDay = moment(checkinRule.startDate).add(i, "day").toDate().getTime()
		Checkins.insert
			ruleId: checkinRuleId
			date: nextDay
			checkedIn: false

		i++

	#Checkins.insert()