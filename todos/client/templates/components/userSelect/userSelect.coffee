Template.userSelect.onCreated ->
	@selected = new ReactiveVar({});

Template.userSelect.onRendered ->


Template.userSelect.helpers
	'users': ->
		Meteor.users.find({_id: {$nin: Object.keys(Template.instance().selected.get())}})
	'selectedUsers': ->
		Meteor.users.find({_id: {$in: Object.keys(Template.instance().selected.get())}})

Template.userSelect.events
	'click .user': (e, t) ->
		target = $(e.currentTarget)
		s = t.selected.get()
		if target.closest(".all-users").length
			s[target.attr("_id")] = true;
		else
			delete s[target.attr("_id")]
		t.selected.set(s);