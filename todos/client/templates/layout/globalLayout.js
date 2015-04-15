var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var CONNECTION_ISSUE_TIMEOUT = 5000;



Template.globalLayout.helpers({
    connected: function () {
        if (!Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
            return Meteor.status().connected;
        } else {
            return true;
        }
    },
	isErrorToast: function(){
		return GlobalUI.isErrorToast.get();
	},
	progressCSSDisplay: function(){
		return GlobalUI.isProgressVisible.get() ? "block": "none";
	},
	contentCSSDisplay: function(){
		return GlobalUI.isProgressVisible.get() ? "none": "block";
	},
	showSettings: function(){
		return Session.get("global.ui.showSettings");
	}
});