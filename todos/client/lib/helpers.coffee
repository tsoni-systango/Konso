Template.registerHelper "canAddCheckin", () ->
	Utils.isUserInGroup Meteor.user(), Meteor.settings.public.privileges.addCheckins
