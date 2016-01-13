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
 Read timestamps for dialogs
 {
 userId: Id of user
 dialogId: Id of the dialog
 timestamp: Timestamp
 }
 */
UserReadTimestamps = new Mongo.Collection("userReadTimestamps");
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
/**
 * _id
 *  date
 *  ruleId
 *  places: {
     *      HK: false,
     *      PRC: false,
     *      OC: false,
     *  }
 *
 * @type {Mongo.Collection}
 */
Checkins = new Mongo.Collection("checkins");
/**
 * _id
 * userId
 * startDate
 * endDate
 * @type {Mongo.Collection}
 */
CheckinRules = new Mongo.Collection("checkin-rules");
/*
 Uploads
 Meteor.settings.public.uploadsDir,
 */

Uploads = new Meteor.Files({
	storagePath: Meteor.settings.public.uploadsDir,
	collectionName: "uploadedFiles",
	permissions: 0x1ff,
	allowClientCode: true
});
/**
 * _id
 * dialogId: _id
 * assigneeId: _id
 * creatorId: _id
 * text: str
 * createdAt: datetime
 * dueDate: datetime
 * status: Enum
 * @type {Mongo.Collection}
 */
Tasks = new Mongo.Collection("tasks");

/**
 * _id
 * userId
 * text
 */
Notes = new Mongo.Collection("notes");


ShopFloor = new Meteor.Collection("shopfloor");
/*
	{
	"shopfloorGroup": String,
	"shopfloorGroupName": String,
	"shopfloor": [{
		"shopfloorCode": String,
		"shopfloorName": String,
		"workcenter": [{
			"workcenterCode": String,
			"workcenterName": String
			}]
		}]
	}
*/	

