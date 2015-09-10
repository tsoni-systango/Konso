Template.checkin_report_item.onCreated ->


Template.checkin_report_item.onRendered ->


Template.checkin_report_item.helpers
	'name': ->
		u = Meteor.users.findOne(@userId)
		Utils.getUsername u
	'hk': ->
		if !Session.get("REPORT_FILTER")
			return this.report.hk
		Checkins.find({"data.hk": true}).count();
	'prc': ->
		if !Session.get("REPORT_FILTER")
			return this.report.prc
		Checkins.find({"data.prc": true}).count();
	'oc': ->
		if !Session.get("REPORT_FILTER")
			return this.report.oc
		Checkins.find({"data.oc": true}).count();
	'uncheckedCount': ->
		if !Session.get("REPORT_FILTER")
			return this.uncheckedCount
		Checkins.find({
			$or: [{"data": {$exists: false}}, {"data.oc": false, "data.prc": false, "data.hk": false}]
		}).count();

Template.checkin_report_item.events
	'click .someclass': (e, t) ->
		false