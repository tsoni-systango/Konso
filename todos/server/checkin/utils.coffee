@CheckinUtils = new (->
	@.generateCheckins = (checkinRuleId)->
		checkinRule = CheckinRules.findOne checkinRuleId
		if !checkinRule
			Errors.throw(Errors.CHECKIN_NOT_FOUND)
		nextDayTimestamp = checkinRule.lastDayGenerated || checkinRule.startDate
		i = 0
		endOfWeekOrEndCheckinTimestamp = moment().endOf("isoweek").toDate().getTime();
		while nextDayTimestamp <= Math.min(checkinRule.endDate || endOfWeekOrEndCheckinTimestamp,
			endOfWeekOrEndCheckinTimestamp)
			if !(i == 0 && checkinRule.lastDayGenerated != checkinRule.startDate)
				Checkins.insert
					ruleId: checkinRuleId
					date: nextDayTimestamp
			i++
			nextDayTimestamp = moment(nextDayTimestamp).add(1, "day").toDate().getTime()

		lastDayRendered = moment(nextDayTimestamp).add(-1, "day").toDate().getTime()
		uncheckedCount = checkinRule.uncheckedCount || 0
		checkedCount = checkinRule.checkedCount || 0
		if checkinRule.lastDayGenerated != checkinRule.startDate
			uncheckedCount += i - 1
		else
			uncheckedCount += i
		CheckinRules.update checkinRuleId, {
			$set: {
				lastDayGenerated: lastDayRendered,
				uncheckedCount: uncheckedCount,
				checkedCount: checkedCount
				generatedAll: lastDayRendered == checkinRule.endDate
			}
		}
	@generateWeeklyCheckins = ->
		weekStart = moment().startOf("isoweek").toDate().getTime()
		rules = CheckinRules.find({generatedAll: false, lastDayGenerated: {$lt: weekStart}}).fetch();
		rules.forEach((rule)->
			CheckinUtils.generateCheckins(rule._id);
		)
	return
)