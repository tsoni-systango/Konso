Preferences = new function(){
	this.LAST_CHAT_NOTIFICATION_TIMESTAMPS = "LAST_CHAT_NOTIFICATION_TIMESTAMPS";
	this.LAST_EMAIL_NOTIFICATION_TIMESTAMPS = "LAST_EMAIL_NOTIFICATION_TIMESTAMPS";
	this.IS_EMAIL_NOTIFICATIONS_DIALOG = "IS_EMAIL_NOTIFICATIONS_DIALOG";
	this.IS_EMAIL_NOTIFICATIONS_ROOM = "IS_EMAIL_NOTIFICATIONS_ROOM";
	this.IS_EMAIL_NOTIFICATIONS_CHANNEL = "IS_EMAIL_NOTIFICATIONS_CHANNEL";

	this.get = function(key, nonReactive){
		var field = {};
		key = constructFullKey(key);
		field[key] = 1;
		var user = Meteor.users.findOne(Meteor.userId(), {fields: field, reactive: !nonReactive});
		return Utils.multikeyVal(user, key);
	};
	this.set = function(key, value){
		key = constructFullKey(key);
		var updateQuery = {$set: {}};
		updateQuery.$set[key] = value;
		Meteor.users.update(Meteor.userId(), updateQuery);
	}


	//private
	function constructFullKey(key){
		return "profile.preferences." + key;
	}
}