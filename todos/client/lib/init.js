Meteor.startup(function() {
    Tracker.autorun(function(){
        var lang =  SETTINGS.language();
        TAPi18n.setLanguage(lang);
        moment.locale(lang === "zn"? "zn-cn": lang);
    })
})