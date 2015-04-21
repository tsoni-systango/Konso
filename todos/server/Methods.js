Meteor.methods({
    saveUploadedFileMeta: function (fileInfo) {
        fileInfo.ownerId = getCurrentUserOrDie()._id;
        fileInfo.timestamp = _.now();
        return Uploads.insert(fileInfo);
    }
})