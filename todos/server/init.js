Meteor.startup(function () {
    initConfig();
    
    var allUsers = Meteor.users.find({}).fetch();
    _.each(allUsers, function (user) {
        if (!user.profile.displayName) {
            Meteor.users.update(user._id, {$set: {"profile.displayName": user.username}});
        }
    })
    allUsers = Meteor.users.find({}).fetch();
    _.each(allUsers, function (user) {
        if (!user.profile.sortName) {
            Meteor.users.update(user._id, {$set: {"profile.sortName": user.profile.displayName.toLowerCase()}});
        }
    });

    if (Meteor.settings.public.defaultAuth === AUTH_TYPES.CROWD) {
        SyncedCron.add({
            name: 'Synchronize Atlassian Crowd Groups',
            schedule: function (parser) {
                return parser.text('every 1 minute');
            },
            job: synchronizeWithAtlassianCrowd
        });
        synchronizeWithAtlassianCrowd();
    }

    SyncedCron.start();

    //TODO remove it next version
    //this code turns all growl notifications on, by default
    _.each(allUsers, function (user) {
        var growlNotificationsConfig = Utils.getByKey(user, GrowlNotificationsNamespace);
        if (!growlNotificationsConfig) {
            growlNotificationsConfig = {};
        }
        for (var key in GrowlNotificationTypes) {
            var id = GrowlNotificationTypes[key];
            if (!growlNotificationsConfig.hasOwnProperty(id)) {
                growlNotificationsConfig[id] = true;
            }
        }
        var updateData = {};
        updateData[GrowlNotificationsNamespace] = growlNotificationsConfig;
        Meteor.users.update(user._id, {$set: updateData});
    });
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