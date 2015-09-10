Template.checkin_reports.onCreated ->
	self = this
	self.autorun(->
		self.subscribe("customReports", Session.get("REPORT_FILTER"))
	)


Template.checkin_reports.onRendered ->


Template.checkin_reports.helpers
	'checkins': ->
		filter = Session.get("REPORT_FILTER")
		if filter and filter.userIds and filter.userIds.length != 0
			return CheckinRules.find({userId: {$in: filter.userIds}})
		CheckinRules.find({})

Template.checkin_reports.events
	'click .someclass': (e, t) ->
		false