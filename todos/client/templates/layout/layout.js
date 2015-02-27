
Template.layout.rendered = function () {

};

Template.layout.events({
    "submit [data-action=log-in]": function (e) {
        var form = $(e.target);
        if(form[0].valid){
            var username = form.find("#username").val()
            var pass = form.find("#password").val()

            Meteor.loginWithLDAP(username, pass, {
                dn: "uid="+username+",dc=example,dc=com"
            }, function (err) {
                if (err) {
                    GlobalUI.toast(err.reason);
                } else {
                    console.log('logged in succesfully');
                }
            });
        }
    }
});

Template.layout.helpers({
  isAuthenticated: function () {
        return Meteor.user();
    },
    thisArray: function () {
        return [this];
    },
    menuOpen: function () {
        return Session.get(MENU_KEY) && 'menu-open';
    },
    cordova: function () {
        return Meteor.isCordova && 'cordova';
    },
    emailLocalPart: function () {
        var email = Meteor.user().emails[0].address;
        return email.substring(0, email.indexOf('@'));
    },
    userMenuOpen: function () {
        return Session.get(USER_MENU_KEY);
    },
    lists: function () {
        return Lists.find();
    },
    activeListClass: function () {
        var current = Router.current();
        if (current.route.name === 'listsShow' && current.params._id === this._id) {
            return 'active';
        }
    }
});
