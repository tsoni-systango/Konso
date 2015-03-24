Meteor.startup(function () {
	//Messages.remove({});
	//Dialogs.remove({});
	//Meteor.users.remove();
  Inject.rawModHtml('addUnresolved', function(html){
      return html.replace('<body>', '<body unresolved fit layout vertical>');
  });

	var allUsers = Meteor.users.find({}).fetch();
	_.each(allUsers, function(user){
		if(!user.profile.displayName){
			Meteor.users.update(user._id, {$set: {"profile.displayName":user.username}});
		}
	})
	allUsers = Meteor.users.find({}).fetch();
	_.each(allUsers, function(user){
		if(!user.profile.sortName){
			Meteor.users.update(user._id, {$set: {"profile.sortName":user.profile.displayName.toLowerCase()}});
		}
		if(!user.profile.readTimestamps){
			Meteor.users.update(user._id, {$set: {"profile.readTimestamps":{} }});
		}
	})
});

Accounts.onCreateUser(function(options, user) {
	if (options.profile){
		user.profile = options.profile;
	}
	if(!user.profile){
		user.profile = {};
	}
	if(!user.profile.displayName){
		user.profile.displayName = user.username;
	}
	user.profile.readTimestamps = {};
	return user;
});