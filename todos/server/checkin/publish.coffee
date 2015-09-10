Meteor.publish "checkIns", (ruleId, weekOffset)->
	if @userId
		r = CheckinRules.findOne(ruleId);
		m = moment();

		if r.endDate && m.toDate().getTime() > r.endDate
			m = moment(r.endDate - 1);
		else if m.toDate().getTime() < r.startDate
			m = moment(r.startDate + 1);
		m.add(weekOffset, "week")
		Checkins.find(
			{
				ruleId: ruleId
				$and: [
					{
						date:
							$lt: m.endOf("isoweek").toDate().getTime()
					}
					{
						date:
							$gte: m.startOf("isoweek").toDate().getTime()
					}
				]
			}
		)
	else
		@ready()


Meteor.publish "checkInRule", (id)->
	CheckinRules.find _id: id

Meteor.publish "checkinRules", ->
	if @userId and PrivilegesUtils.canAddCheckins(Meteor.users.findOne(@userId))
		return CheckinRules.find()
	else if @userId
		return CheckinRules.find {userId: @userId}
	else
		@ready()

Meteor.publish "checkinRequired", ->
	if this.userId
		return CheckinRules.find {userId: this.userId}

Meteor.publish "customReports", (opts)->
	if this.userId
		if !opts
			return @ready()
		else
			specificRules = []
			if opts.userIds and opts.userIds.length != 0
				specificRules = CheckinRules.find({userId: {$in: opts.userIds}}, {fields: {_id: 1}}).map((el)->
					el._id
				);
			q = {}
			console.log "specificRules ", specificRules
			if specificRules.length != 0
				q.ruleId = {$in: specificRules}
			if opts.fromDate and opts.toDate
				q.$and = [
					{
						date:
							$lte: new Date(opts.toDate).getTime()
					}
					{
						date:
							$gte: new Date(opts.fromDate).getTime()
					}
				]
			if opts.fromDate
				q.date = {$gte: new Date(opts.fromDate).getTime()}
			if opts.toDate
				q.date = {$lte: new Date(opts.toDate).getTime()}
			console.log "query", q
			return Checkins.find q