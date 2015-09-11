Meteor.startup(function () {
    initConfig();
    //Messages.remove({});
    //Dialogs.remove({});
    //Meteor.users.remove({});


   /* var i = Meteor.users.find({}).count();
    var limit = i + 950;
    for (i; i < limit; i++) {
        Accounts.createUser({
            username: "auser" + i,
            email: "user"+i+"@mail.ru",
            password: i+"pass"
        })
    }
*/

    Meteor.users.find({}, {fields: {"profile.displayName": 1}})
        .forEach(function (user) {
            if (!user.profile.displayName) {
                Meteor.users.update(user._id, {$set: {"profile.displayName": user.username}});
            }
        });
    Meteor.users.update({}, {$set: {"profile.presence": 0}});

    recalculateSortIndexesForUsers();

    if (Meteor.settings.public.defaultAuth === AUTH_TYPES.CROWD) {
        SyncedCron.add({
            name: 'Synchronize Atlassian Crowd Groups',
            schedule: function (parser) {
                return parser.text('every 20 minutes');
            },
            job: synchronizeWithAtlassianCrowd
        });
        synchronizeWithAtlassianCrowd();
    }

    SyncedCron.start();

});

Accounts.onCreateUser(function (options, user) {
    if (options.profile) {
        user.profile = options.profile;
    }
    Utils.setByKey("profile.displayName", user, user.username, true);
    Utils.setByKey("profile.sortName", user, user.profile.displayName.toLowerCase());

    var growlNotificationsDefaults = {}
    for (var key in GrowlNotificationTypes) {
        var id = GrowlNotificationTypes[key];
        growlNotificationsDefaults[id] = true;
    }
    Utils.setByKey(GrowlNotificationsNamespace, user, growlNotificationsDefaults);
    user.authType = Meteor.settings.public.defaultAuth;
    recalculateSortIndexesForUsers();
    console.log("Created new user", user.profile.displayName);
    return user;
});

var initConfig = function () {
    try {
        LDAP_DEFAULTS.url = Meteor.settings.authentication.ldap.baseUrl;
        LDAP_DEFAULTS.dn = Meteor.settings.authentication.ldap.dn;
        LDAP_DEFAULTS.port = Meteor.settings.authentication.ldap.port || 389;
        LDAP_DEFAULTS.createNewUser = true;

        if (Meteor.settings.authentication && Meteor.settings.authentication.crowd) {
            ATLASSIAN_CROWD_CONFIG.crowd = {
                "base": Meteor.settings.authentication.crowd.baseUrl
            };
            ATLASSIAN_CROWD_CONFIG.application = {
                "name": Meteor.settings.authentication.crowd.appName,
                "password": Meteor.settings.authentication.crowd.appPassword
            };
        }

        Utils.setByKey("public.defaultAuth", Meteor.settings, AUTH_TYPES.CROWD, true);

    } catch (e) {
        throw new Meteor.Error("Can not parse authentication config. Use 'meteor --settings config.json'")
    }
}

var recalculateSortIndexesForUsers = function(){
    var allUsers = Meteor.users.find({}, {
        fields: {"profile.displayName": 1}
    }).fetch();
    _.each(allUsers, function (user, i) {
        Meteor.users.update(user._id, {$set: {"profile.sortName": user.profile.displayName.toLowerCase()}});
    });
    allUsers = Meteor.users.find({}, {
        sort: {"profile.sortName": 1}, fields: {"profile.sortName": 1}
    }).fetch();
    _.each(allUsers, function (user, i) {
        Meteor.users.update(user._id, {$set: {"profile.sortIndex": i}});
    });
}