Template.registerHelper "canAddCheckin", () ->
	PrivilegesUtils.canAddCheckins();

Template.registerHelper "formatDate", (date, format) ->
	if(!date)
		return "N/A"
	moment(date).format(format)
