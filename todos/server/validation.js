isUserAuthorizedInDialog = function (dialog, userId) {
	if (dialog.isPrivate){
		var currentUserId = userId || getCurrentUserOrDie()._id;
		if(!dialog.userIds || dialog.userIds.indexOf(currentUserId) === -1){
			Errors.throw(Errors.CHANNEL_IS_PRIVATE);
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