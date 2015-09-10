Template.checkin_filter.onCreated ->
Template.checkin_filter.onDestroyed ->


Template.checkin_filter.onRendered ->
	self = this
	@$('input[type=date]').pickadate({
		container: 'body'
	});

	@$(".usersSelect").select2({
		width: "style"
	})
	f = Session.get("REPORT_FILTER");
	if f
		f.fromDate && $('#startDate').val(f.fromDate)
		f.toDate && $('#endDate').val(f.toDate)
		f.userIds && $('.usersSelect').select2('val', f.userIds)



	@formChanged = ->
		res = {
			fromDate: $('#startDate').val()
			toDate: $('#endDate').val()
			userIds: $(".usersSelect").val()
		}
		if !res.fromDate and !res.toDate and (!res.userIds or res.userIds.length == 0)
			res = null
		Session.set("REPORT_FILTER", res)
	closed = !Session.get("REPORT_FILTER");
	$(".filter-reports").on('click', (e)->
		if closed
			$(self.firstNode).removeClass('hide')
			$(self.firstNode).removeClass('slideOutUp')
			$(self.firstNode).addClass('slideInDown')
			closed = false;
			self.formChanged()
		else
			$(self.firstNode).addClass('slideOutUp')
			$(self.firstNode).removeClass('slideInDown')
			Meteor.setTimeout(->
				$(self.firstNode).addClass('hide')
				Session.set("REPORT_FILTER", null)
			, 300)
			closed = true;
	)

Template.checkin_filter.helpers
	'users': ->
		Meteor.users.find()
	"class": ->
		if !Session.get("REPORT_FILTER")
			return "hide"
		'slideInDown'

Template.checkin_filter.events
	'click .clear': (e, t) ->
		t.$(".usersSelect").select2('val', '');
	'change .usersSelect,#endDate,#startDate': (e, t)->
		t.formChanged && t.formChanged()