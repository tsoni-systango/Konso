var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var CONNECTION_ISSUE_TIMEOUT = 5000;

Meteor.startup(function () {
    /* // set up a swipe left / right handler
     $(document.body).touchwipe({
     wipeLeft: function () {
     Session.set(MENU_KEY, false);
     },
     wipeRight: function () {
     Session.set(MENU_KEY, true);
     },
     preventDefaultEvents: false
     });
     
     // Only show the connection error box if it has been 5 seconds since
     // the app started
     setTimeout(function () {
     // Launch screen handle created in lib/router.js
     dataReadyHold.release();
     
     // Show the connection error box
     Session.set(SHOW_CONNECTION_ISSUE_KEY, true);
     }, CONNECTION_ISSUE_TIMEOUT);*/
});

Template.layout.rendered = function () {
    /* this.find('#content-container')._uihooks = {
     insertElement: function(node, next) {
     $(node)
     .hide()
     .insertBefore(next)
     .fadeIn(function () {
     listFadeInHold.release();
     });
     },
     removeElement: function(node) {
     $(node).fadeOut(function() {
     $(this).remove();
     });
     }
     };*/
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
                    console.log(JSON.stringify(err));
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
    },
    connected: function () {
        if (!Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
            return Meteor.status().connected;
        } else {
            return true;
        }
    }
});

