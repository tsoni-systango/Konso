/*
 Channels Schema
 {
	name: String
	ownerId: Id
 }
 */
Channels = new Mongo.Collection("channels");
/*
 Dialogs Schema
 {
	created: Timestamp
	channelId: Id of a channel, if channels dialog
	isPrivate: Boolean
	userIds: Array of ids
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