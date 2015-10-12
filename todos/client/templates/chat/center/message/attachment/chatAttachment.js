Template.chatAttachment.helpers({
    url: function(){
        return Uploads.findOne(this._id).url();
    },
    isImage: function(){
        return Uploads.findOne(this._id).isImage();
    }
})