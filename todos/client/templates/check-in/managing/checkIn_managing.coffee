Template.checkIn_managing.onCreated ->


Template.checkIn_managing.onRendered ->
	$('.datepicker').pickadate();

Template.checkIn_managing.helpers
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


Template.checkIn_managing.events
	'click .add': (e, t) ->
		obj =
			userId: this.userId
			startDate: new Date($('#startDate').val()).getTime()
			endDate: new Date($('#endDate').val()).getTime()

		Meteor.call "newCheckinRule", obj, GlobalUI.generalCallback((id) ->
			GlobalUI.toast "Added new checkin rule"
			Router.go "checkIn-managing"
		)
	'click .remove': (e, t) ->
		if confirm("Are you sure? User reports also will be removed")
			id = $(e.currentTarget).closest(".checkinRule").attr("_id");
			Meteor.call("removeCheckinRule", id, GlobalUI.generalCallback());

