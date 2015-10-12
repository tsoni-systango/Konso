Template.login.onCreated(function(){
   this.isBusy = new ReactiveVar(false);
});
Template.login.helpers({
   'isBusy': function(){
       return Template.instance().isBusy.get();
   }
});
Template.login.events({
    "submit #login-form": function (e) {
        e.preventDefault();
        var isBusy = Template.instance().isBusy;
        var form = $(e.target);
        var username = form.find("#username").val();
        var pass = form.find("#password").val();
        isBusy.set(true);
        if (Meteor.settings.public.defaultAuth === "ldap") {
            Meteor.loginWithLDAP(username, pass, {
                dn: "uid=" + username + ",dc=example,dc=com"
            }, GlobalUI.generalCallback(null, function(){
                isBusy.set(false);
            }));
        } else if (Meteor.settings.public.defaultAuth === "crowd") {
            Meteor.loginWithCrowd(username, pass, GlobalUI.generalCallback(null, function () {
                isBusy.set(false);
            }));
        } else {
            GlobalUI.errorToast("defaultAuth property is not set. " +
            "Don't know how to authenticate you.")
            isBusy.set(false);
        }
    }
})