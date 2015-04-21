Meteor.methods({
    saveUploadedFileMeta: function (fileInfo) {
        fileInfo.ownerId = getCurrentUserOrDie()._id;
        fileInfo.timestamp = _.now();
        return Uploads.insert(fileInfo);
    },
    removeAttachment: function (fileId) {
        var attachment = Uploads.findOne(fileId);
        if(!attachment){
            Errors.throw("Attachment not found");
        }
        UploadServer.delete(attachment.path);
        Uploads.remove(fileId);
    }
})