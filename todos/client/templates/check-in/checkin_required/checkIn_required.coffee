Template.checkIn_required.onCreated ->
	self = this
	self.weekOffset = new ReactiveVar(0);
	self.subscribe("checkInRule", self.data.ruleId);
	@autorun ->
		self.subscribe("checkIns", self.data.ruleId, self.weekOffset.get());

Template.checkIn_required.onRendered ->


Template.checkIn_required.helpers
	'checkins': ->
		Checkins.find {ruleId: @ruleId}, {limit: 7, sort: {date: 1}}
	date: ->
		moment(this.date).format "dddd, MMMM Do YYYY"
	canSubmit: ->
		true;
	week: ->
		start = Checkins.findOne {ruleId: @ruleId}, {sort: {date: 1}, limit: 1}
		end = Checkins.findOne {ruleId: @ruleId}, {sort: {date: -1}, limit: 1}
		if start and end
			moment(start.date).format("MMMM Do") + " - " + moment(end.date).format("MMMM Do YYYY");

Template.checkIn_required.events
	'click .week-back': (e, t) ->
		t.weekOffset.set(t.weekOffset.get() - 1);
	'click .week-forward': (e, t) ->
		t.weekOffset.set(t.weekOffset.get() + 1)