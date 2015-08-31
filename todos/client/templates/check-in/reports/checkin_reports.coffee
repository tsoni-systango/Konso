Template.checkin_reports.onCreated ->
	console.log "rendered checkin"

Template.checkin_reports.onRendered ->


Template.checkin_reports.helpers
	'checkins': ->
		CheckinRules.find({})

Template.checkin_reports.events
	'click .someclass': (e, t) ->
		false