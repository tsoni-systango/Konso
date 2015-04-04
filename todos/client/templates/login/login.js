Template.login.events({
    "submit [data-action=log-in], shadow-submit [data-action=log-in]": function (e) {
        var form = $(e.target);
        if(form[0].valid){
            var username = form.find("#username").val()
            var pass = form.find("#password").val()
            if (Meteor.settings.public.defaultAuth === "ldap") {
                Meteor.loginWithLDAP(username, pass, {
                    dn: "uid=" + username + ",dc=example,dc=com"
                }, GlobalUI.generalCallback(onLogin));
            } else if (Meteor.settings.public.defaultAuth === "crowd") {
                Meteor.loginWithCrowd(username, pass, GlobalUI.generalCallback(onLogin));
            } else {
                GlobalUI.errorToast("defaultAuth property is not set. " +
                "Don't know how to authenticate you.")
            }
        }
        function onLogin() {
            //inject css styles for @mention feature
            $('body #style-block')
                .html(
                "<style> " +
                ".chat-message [mentions=" + Meteor.userId() + "]," +
                ".chat-message [mentions=all]" +
                "{" +
                "background: #3b73af;" +
                "border: 1px solid #3b73af;" +
                "color: #fff; " +
                "} " +
                "</style>")
        }
    }
})