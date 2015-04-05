PrivilegesUtils = (function() {
    var privileges = Meteor.settings.public.privileges || {};
    this.canCreateChannels = function(){
        return _.intersection(privileges.createChannels, Meteor.user().groups).length !== 0;
    }
    this.canCreateChatAlerts = function(){
        return _.intersection(privileges.createChatAlerts, Meteor.user().groups).length !== 0;
    }
})();