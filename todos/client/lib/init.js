Meteor.startup(function() {
    Tracker.autorun(function(){
        TAPi18n.setLanguage(SETTINGS.language())
    })
})