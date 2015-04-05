Template.login.events({
    "submit [data-action=log-in], shadow-submit [data-action=log-in]": function (e) {
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
})