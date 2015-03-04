isUserAuthorizedInDialog = function (dialog) {
	if (dialog.isPrivate){
		var currentUser = getCurrentUserOrDie();
		if(!dialog.userIds || dialog.userIds.indexOf(currentUser._id) === -1){
			Errors.throw(Errors.CHANNEL_IS_PRIVATE);
		}
	}
}