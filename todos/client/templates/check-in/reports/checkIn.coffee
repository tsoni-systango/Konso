Template.checkIn.onCreated ->
	console.log "rendered checkin"

Template.checkIn.onRendered ->


Template.checkIn.helpers
	'data': ->
		this

Template.checkIn.events
	'click .someclass': (e, t) ->
		false