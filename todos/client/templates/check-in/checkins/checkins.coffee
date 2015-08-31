Template.checkins.onCreated ->
	@subscribe "checkinRules"

Template.checkins.onRendered ->
	$('.datepicker').pickadate();

Template.checkins.helpers
	'addingUser': ->
		Meteor.users.findOne(this.userId);
	'rules': ->
		CheckinRules.find({});
	'name': ->
		Meteor.users.findOne(this.userId).profile.displayName;
	'email': ->
		Meteor.users.findOne(this.userId).emails;
	'date': (v)->
		moment(v).format("DD MMMM, YYYY")


Template.checkins.events
	'click .add': (e, t) ->
		obj =
			userId: this.userId
			startDate: new Date($('#startDate').val()).setHours(0,0,0,0)
			endDate: new Date($('#endDate').val()).setHours(0,0,0,0)
		if !obj.startDate or !obj.endDate
			GlobalUI.errorToast("Start Date and End Date is required")
			return
		if obj.startDate >= obj.endDate
			GlobalUI.errorToast("Start Date should be earlier then End Date")
			return

		Meteor.call "newCheckinRule", obj, GlobalUI.generalCallback((id) ->
			GlobalUI.toast "Added new checkin rule"
			Router.go "checkins"
		)
	'click .remove': (e, t) ->
		if confirm("Are you sure? User reports also will be removed")
			id = $(e.currentTarget).closest(".checkinRule").attr("_id");
			Meteor.call("removeCheckinRule", id, GlobalUI.generalCallback());

