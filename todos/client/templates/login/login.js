
Template.login.events({
    "submit #login-form": function (e) {
        e.preventDefault();
        var form = $(e.target);
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
})