/**
 * Setting up email package:
 */
Meteor.startup(function () {
    if (Meteor.settings.mailer){
        var smtp = {
            email: Meteor.settings.mailer.email,
            password: Meteor.settings.mailer.password,
            server:   Meteor.settings.mailer.server,
            port: Meteor.settings.mailer.port
        };

        process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.email)
            + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;

    }else{
        console.log("Please configure mailer settings")
    }
});