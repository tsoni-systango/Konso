Template.checkin_report_item.onCreated ->


Template.checkin_report_item.onRendered ->


Template.checkin_report_item.helpers
	'name': ->
		u = Meteor.users.findOne(@userId)
		Utils.getUsername u

Template.checkin_report_item.events
	'click .someclass': (e, t) ->
		false