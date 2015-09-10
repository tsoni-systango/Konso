Template.checkin.onCreated ->
	self = this
	self.weekOffset = new ReactiveVar(0);
	self.subscribe("checkInRule", self.data.ruleId);
	@autorun ->
		self.subscribe("checkIns", self.data.ruleId, self.weekOffset.get());


Template.checkin.onRendered ->


Template.checkin.helpers
	name: ->
		if @ruleId
			rule = CheckinRules.findOne @ruleId
			user = Meteor.users.findOne(rule.userId);
			Utils.getUsername(user);
	checkins: ->
		Checkins.find {ruleId: @ruleId}, {limit: 7, sort: {date: 1}}
	week: ->
		start = Checkins.findOne {ruleId: @ruleId}, {sort: {date: 1}, limit: 1}
		end = Checkins.findOne {ruleId: @ruleId}, {sort: {date: -1}, limit: 1}
		if start and end
			moment(start.date).format("MMMM Do") + " - " + moment(end.date).format("MMMM Do YYYY");
	nextClass: ->
		end = Checkins.findOne {ruleId: @ruleId}, {sort: {date: -1}, limit: 1}
		rule = CheckinRules.findOne @ruleId
		if rule.lastDayGenerated > end.date then "" else "disabled"
	prevClass: ->
		start = Checkins.findOne {ruleId: @ruleId}, {sort: {date: 1}, limit: 1}
		rule = CheckinRules.findOne @ruleId
		if rule.startDate < start.date then "" else "disabled"

Template.checkin.events
	'click .week-back': (e, t) ->
		if !$(e.currentTarget).hasClass("disabled")
			t.weekOffset.set(t.weekOffset.get() - 1);
	'click .week-forward': (e, t) ->
		if !$(e.currentTarget).hasClass("disabled")
			t.weekOffset.set(t.weekOffset.get() + 1)