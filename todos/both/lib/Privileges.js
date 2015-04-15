PrivilegesUtils = new function () {
    var s = Meteor.settings;
    var privileges = s.public ? s.public.privileges || {} : {};
    this.canCreateChannels = function () {
        return Meteor.user() && _.intersection(privileges.createChannels, Meteor.user().groups || []).length !== 0;
    }
    this.canCreateChatAlerts = function () {
        return Meteor.user() && _.intersection(privileges.createChatAlerts, Meteor.user().groups || []).length !== 0;
    }
    return this;
};