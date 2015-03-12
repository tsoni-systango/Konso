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
 dialogId: Id
 isRead: Boolean
 }
 */
Messages = new Mongo.Collection("messages");