Template.persistenceIndicator.helpers({
	isOnline:function(){
		return UserPresences.findOne({userId: this.userId});
	}
});