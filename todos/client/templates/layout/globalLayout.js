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
    isAuthenticated: function () {
        return Meteor.user();
    },
	isErrorToast: function(){
		return GlobalUI.isErrorToast.get();
	},
	progressCSSDisplay: function(){
		return GlobalUI.isProgressVisible.get() ? "block": "none";
	},
	contentCSSDisplay: function(){
		return GlobalUI.isProgressVisible.get() ? "none": "block";
	}
	
});

Template.globalLayout.events({
    "submit [data-action=log-in], shadow-submit [data-action=log-in]": function (e) {
        console.log(e)
        var form = $(e.target);
        if(form[0].valid){
            var username = form.find("#username").val()
            var pass = form.find("#password").val()
            if (Meteor.settings.public.defaultAuth === "ldap") {
                Meteor.loginWithLDAP(username, pass, {
                    dn: "uid=" + username + ",dc=example,dc=com"
                }, GlobalUI.generalCallback());
            } else if (Meteor.settings.public.defaultAuth === "crowd") {
                Meteor.loginWithCrowd(username, pass, GlobalUI.generalCallback());
            } else {
                GlobalUI.errorToast("defaultAuth property is not set. " +
                "Don't know how to authenticate you.")
            }
        }
    }
});
