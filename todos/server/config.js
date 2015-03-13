DEFAULT_AUTH = "crowd";
Meteor.startup(function () {
    try {
        var config = Assets.getText('config.json');
        config = JSON.parse(config);
        DEFAULT_AUTH = config.authentication.default || "crowd";
        LDAP_DEFAULTS.url = config.authentication.ldap.baseUrl;
        LDAP_DEFAULTS.dn = config.authentication.ldap.dn;
        LDAP_DEFAULTS.port = config.authentication.ldap.port || 389;
        LDAP_DEFAULTS.createNewUser = true;

        ATLASSIAN_CROWD_CONFIG.crowd = {
            "base": config.authentication.crowd.baseUrl
        };
        ATLASSIAN_CROWD_CONFIG.application = {
            "name": config.authentication.crowd.appName,
            "password": config.authentication.crowd.appPassword
        };
    } catch (e) {
        throw new Meteor.Error("Can not parse authentication config")
    }

})