Template.checkIn.onCreated ->
	console.log "rendered checkin"

Template.checkIn.onRendered ->


Template.checkIn.helpers
	'checkins': ->
		Checkins.find({})

Template.checkIn.events
	'click .someclass': (e, t) ->
		false