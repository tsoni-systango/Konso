Template.layout.helpers({
    username: function () {
        return Utils.getUsername(Meteor.user());
    },
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
    }
});

Template.registerHelper("isEmbeddedChat", function () {
    return Session.get("embedded");
})

Template.layout.onRendered(function(){
    this.$("#right-menu-btn").sideNav({
        menuWidth: 180,
        edge: 'right'
    });
    this.$("#left-menu-btn").sideNav({
        menuWidth: 250
    });
    this.$('#app-modules-btn').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            gutter: -2, // Spacing from edge
            bottomOffset: 20,
            belowOrigin: true // Displays dropdown below the button
        }
    );
})