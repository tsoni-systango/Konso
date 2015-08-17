Template.checkIn_required.onCreated ->


Template.checkIn_required.onRendered ->


Template.checkIn_required.helpers
	'checkin-weeks': ->
		CheckinRules.find {},

Template.checkIn_required.events
	'click .someclass': (e, t) ->
		false