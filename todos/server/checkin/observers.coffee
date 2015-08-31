Checkins.find().observe
	changed: (newDocument, oldDocument)->
		isOldCheckedIn = oldDocument.data and (oldDocument.data.hk or oldDocument.data.prc or oldDocument.data.oc)
		isNewCheckedIn = newDocument.data.hk or newDocument.data.prc or newDocument.data.oc
		r = CheckinRules.findOne oldDocument.ruleId
		report = r.report ? {
			hk: 0,
			prc: 0,
			oc: 0
		}
		if not isOldCheckedIn and isNewCheckedIn
			u = r.uncheckedCount
			c = r.checkedCount
			CheckinRules.update {_id: r._id}, {$set: {uncheckedCount: u-1, checkedCount: c+1}}
		if isOldCheckedIn and not isNewCheckedIn
			u = r.uncheckedCount
			c = r.checkedCount
			CheckinRules.update {_id: r._id}, {$set: {uncheckedCount: u+1, checkedCount: c-1}}
		recalculateReport = (key)->
			if newDocument.data[key] and (!oldDocument.data or newDocument.data[key] != oldDocument.data[key])
				report[key] = report[key] + 1
			if !newDocument.data[key] and oldDocument.data and oldDocument.data[key]
				report[key] = report[key] - 1

		recalculateReport "hk"
		recalculateReport "prc"
		recalculateReport "oc"
		CheckinRules.update {_id: r._id}, {$set: {report: report}}
