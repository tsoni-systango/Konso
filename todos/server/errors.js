Errors = {
	NOT_AUTHENTICATED: "Not authenticated",
	USER_NOT_EXISTS: "User does not exist",
	DIALOG_NOT_EXISTS: "Dialog does not exist",
	CHANNEL_NOT_EXISTS: "Channel does not exist",
	DIALOG_IS_PRIVATE: "You are not authorized to access to this dialog",
	"throw": function (errorId, details) {
		errorId = errorId || "Unknown error";
		throw new Meteor.Error(errorId, details)
	}
}

