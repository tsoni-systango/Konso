isUserAuthorizedInDialog = function (dialog, userId) {
	if (dialog.type !== DialogTypes.CHANNEL){
		var currentUserId = userId || getCurrentUserOrDie()._id;
		var allowedUserIds = dialog.userIds || [];
		if(!_.contains(allowedUserIds, currentUserId) && dialog.ownerId !== currentUserId){
			Errors.throw(Errors.CONVERSATION_IS_PRIVATE);
		}
	}
	return true;
}
isUserOwnerOfDialog = function (dialog, userId) {
    if (dialog.ownerId !== userId) {
        Errors.throw(Errors.PERMISSION_DENIED);
    }
    return true;
}
isUserHasPrivilegesToCreateChannels = function(){
	console.log("WOWOWOWOWOWOW")
	if(!PrivilegesUtils.canCreateChannels()){
		Errors.throw(Errors.PERMISSION_DENIED);
	}
	return true;
}