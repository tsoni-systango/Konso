Meteor.startup(function () {
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
    } catch (e) {
        throw new Meteor.Error("Can not parse authentication config. Use 'meteor --settings config.json'")
    }

})