Uploads = new FS.Collection("uploads", {
    stores: [new FS.Store.FileSystem("uploads", {path: Meteor.settings.public.uploadsDir})]
});
Messages = new Mongo.Collection('messages');
Dialogs = new Mongo.Collection('dialogs');
UserReadTimestamps = new Mongo.Collection("userReadTimestamps");