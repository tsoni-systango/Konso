PrivilegesUtils = new function () {
    var s = Meteor.settings;
    var privileges = s.public ? s.public.privileges || {} : {};
    this.canCreateChannels = function () {
        return Meteor.user() && _.intersection(privileges.createChannels, Meteor.user().groups || []).length !== 0;
    }
    this.canCreateChatAlerts = function () {
        return Meteor.user() && _.intersection(privileges.createChatAlerts, Meteor.user().groups || []).length !== 0;
    }
    this.canAddCheckins = function(user){
        return true//Utils.isUserInGroup(user || Meteor.user(), privileges.addCheckins);
    }
    this.canEditCheckins = function(ruleId, userId){
        var rule = CheckinRules.find(ruleId);
        if(rule && rule.userId === userId){
            return true
        }
        return false;
    }
    this.isCheckinStillEditable = function(checkin){
        var daysAfter = SETTINGS.checkinsEditableDaysAfter();
        var deadline = moment(checkin.date).endOf("isoweek").add(daysAfter, "days").toDate().getTime();
        return new Date().getTime() < deadline;
    }
};