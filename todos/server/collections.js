/*
 Dialogs Schema
 {
 name: String
 ownerId: Id
 created: Timestamp
 channelId: Id of a channel, if channels dialog
 userIds: Array of ids
 type: Enum of DialogType
 }
 */
Dialogs = new Mongo.Collection("dialogs");
/*
 Messages Schema
 {
 created: Timestamp
 ownerId: Id
 text: String
 attachments: Id of Upload,
 mentions: [Object {text, id}]
 dialogId: Id
 removed: Boolean
 removedContent:{
     text,
     attachment,
     mentions
   }
 */
Messages = new Mongo.Collection("messages");
Uploads = new Mongo.Collection("uploads");