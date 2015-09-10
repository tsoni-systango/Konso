Template.checkin_report_item.onCreated ->


Template.checkin_report_item.onRendered ->


Template.checkin_report_item.helpers
	'name': ->
		u = Meteor.users.findOne(@userId)
		Utils.getUsername u
	'hk': ->
		getCount(this, "hk")
	'prc': ->
		getCount(this, "prc")
	'oc': ->
		getCount(this, "oc")
	'uncheckedCount': ->
		if !Session.get("REPORT_FILTER")
			return this.uncheckedCount
		Checkins.find(
			ruleId: this._id
			$or: [{"data": {$exists: false}}, {"data.oc": false, "data.prc": false, "data.hk": false}]
		).count();

Template.checkin_report_item.events
	'click .someclass': (e, t) ->
		false

getCount = (context, key)->
	if !Session.get("REPORT_FILTER")
		if !context.report
			return 0
		return context.report[key]
	q = {ruleId: context._id}
	q["data." + key] = true
	Checkins.find(q).count();