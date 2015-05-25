Meteor.startup(function () {
    initConfig();
    //Messages.remove({});
    //Dialogs.remove({});
    //Meteor.users.remove({});

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

    if(Meteor.settings.public.defaultAuth === AUTH_TYPES.CROWD) {
        SyncedCron.add({
            name: 'Synchronize Atlassian Crowd Groups',
            schedule: function (parser) {
                return parser.text('every 1 hour');
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
    if (!user.profile) {
        user.profile = {};
    }
    if (!user.profile.displayName) {
        user.profile.displayName = user.username;
    }
    user.profile.sortName = user.profile.displayName.toLowerCase();
    user.type =
    console.log("Created new user", user.profile.displayName);
    return user;
});

var initConfig = function(){
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
        if(!Meteor.settings.public){
            Meteor.settings.public = {};
        }
        if(!Meteor.settings.public.defaultAuth){
            Meteor.settings.public.defaultAuth = AUTH_TYPES.CROWD;
        }

    } catch (e) {
        throw new Meteor.Error("Can not parse authentication config. Use 'meteor --settings config.json'")
    }
}