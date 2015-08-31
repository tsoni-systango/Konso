Meteor.startup ->
	Checkins.allow
		insert: ->
			return false
		update: (userId, doc, fieldNames, modifier) ->
			if (userId and Object.keys(modifier).length == 1 and
				modifier.$set and
				Object.keys(modifier.$set).length == 1 and
				modifier.$set.data) or
				(userId == CheckinRules.findOne(doc.ruleId).userId and
					PrivilegesUtils.isCheckinStillEditable(doc)) or
				(PrivilegesUtils.canAddCheckins Meteor.users.findOne(userId))
					return true

			return false