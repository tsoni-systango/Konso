

Meteor.startup ->
  Deps.autorun ->
    if Meteor.status().status is 'connected'

      update = state : 'online'
      if UserPresence.data? then update.data = UserPresence.data()

      Meteor.call 'updateUserPresence', update

  Meteor.setInterval ->
    Meteor.call 'userPresenceTick'
  , 5000

  $(window).focus -> Meteor.call 'updateUserPresence'

  previousUser = null;
  Tracker.autorun ->

   if(!Meteor.userId() && previousUser)

     Meteor.call 'logoutUserPresence', previousUser

   previousUser = Meteor.userId()
