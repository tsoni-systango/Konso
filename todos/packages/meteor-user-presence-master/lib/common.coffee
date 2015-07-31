UserPresences = new Meteor.Collection 'userPresences'
UserPresence =
  data : null
  "online": 2,
  "offline": 0,
  "idle": 1

Meteor.methods
  updateUserPresence : (params={}) ->

    connectionId = if @.isSimulation then Meteor.connection._lastSessionId else @.connection.id

    if not connectionId then return

    update = state : params.state or "online"
    if params.data then update.data = params.data

    if Meteor.userId? and Meteor.userId()
      update.userId = Meteor.userId()
      Meteor.users.update {_id: update.userId}, {$set: {"profile.presence": UserPresence[update.state]}}

    UserPresences.update connectionId, $set: update
