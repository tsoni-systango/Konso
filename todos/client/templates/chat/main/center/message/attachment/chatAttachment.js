Template.chatAttachment.created = function(){
    var self = this;
    self.subscribe("uploads", IM.getCurrentDialogId(), function(){
        self.attachment = Uploads.findOne(self.data.id);
    });
}
Template.chatAttachment.helpers({
    data: function(){
        return Template.instance().attachment;
    },
    isImage: function(){
        var type = Template.instance().attachment.type;
        return ["image/jpeg","image/jpg","image/png","image/gif"].indexOf(type) !==-1;
    }
})