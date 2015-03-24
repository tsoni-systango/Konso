Meteor.startup(function () {
	//Messages.remove({});
	//Dialogs.remove({});
	//Meteor.users.remove({});
  Inject.rawModHtml('addUnresolved', function(html){
      return html.replace('<body>', '<body unresolved fit layout vertical>');
  });
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