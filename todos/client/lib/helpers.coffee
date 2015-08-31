Template.registerHelper "canAddCheckin", () ->
	PrivilegesUtils.canAddCheckins();

Template.registerHelper "formatDate", (date, format) ->
	moment(date).format(format)
