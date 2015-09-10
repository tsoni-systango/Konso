Meteor.startup ->
	SyncedCron.add
		name: 'Generate new Checkins',
		schedule: (parser) ->
			return parser.text('every 10 minutes')
		,
		job: ->
			CheckinUtils.generateWeeklyCheckins()
			