MailSender = new function() {

    SSR.compileTemplate('emailText', Assets.getText('notificationEmail.html'));

    var _getHtml = function(dialogId, message){
        var _dataContext={
            url: Router.url('chat', {id: dialogId}),
            message: message
        };
        return SSR.render("emailText", _dataContext);
    };

    this.send = function (userId, dialogId, message) {

        var _to = Meteor.users.findOne({_id: userId});

        if (_to && _to.emails && Meteor.settings.mailer){

            var _html = _getHtml(dialogId, message);

            Email.send({
                from: Meteor.settings.mailer.name+" <"+Meteor.settings.mailer.email+">",
                to: _to.emails,
                subject: "Konso updates",
                html: _html
            });

        }else{
            console.log("User's got no email or mailer's not set up")
        }
    }
};