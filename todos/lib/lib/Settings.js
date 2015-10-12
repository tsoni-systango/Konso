SETTINGS = new function () {
    this.language = function (val) {
        if (val) {
            Meteor.users.update(Meteor.userId(), {$set: {"profile.language": val}});
        } else {
            return Utils.getByKey(Meteor.user(), "profile.language") ||
                Utils.getByKey(Meteor.settings, "public.defaultLanguage") ||
                navigator.language;
        }
    };
    this.checkinsEditableDaysAfter = function () {
        return Utils.getByKey(Meteor.settings, "public.checkinsConfig.daysAfterWeekCanEdit") || 7;
    };
}
