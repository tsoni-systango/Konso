Meteor.methods({
    removeAttachment: function (fileId) {
        var attachment = Uploads.findOne(fileId);
        if(!attachment){
            Errors.throw("Attachment not found");
        }
        Uploads.remove(fileId);
    }
});