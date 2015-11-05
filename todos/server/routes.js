Router.route('/download-report/:checkinId', function () {
	var id = this.params.checkinId;
	var rule = CheckinRules.findOne(id);
	if(rule){
		var title = Utils.getUsername(Meteor.users.findOne(rule.userId))+"_"+ moment(rule.startDate)
				.format('DD MM YYYY') + "__" + moment().format('DD MM YYYY');

		var fields = [
			{
				key: 'date',
				title: 'HK',
				transform: function(v, doc){
					return moment(v).format('DD MM YYYY');
				}
			},
			{
				key: 'data.hk',
				title: 'HK'
			},
			{
				key: 'data.prc',
				title: 'PRC'
			},
			{
				key: 'data.oc',
				title: 'Other Country'
			}
		];
		var data = Checkins.find({ruleId: rule._id}, {sort: {date: 1}}).fetch()

		var file = Excel.export(title, fields, data);
		var headers = {
			'Content-type': 'application/vnd.openxmlformats',
			'Content-Disposition': 'attachment; filename=' + title + '.xlsx'
		};
		this.response.writeHead(200, headers);
		this.response.end(file, 'binary');
	} else {
		this.response.writeHead(404);
	}
}, {where: 'server'});