Template.chatAttachmentDraft.created = function(){
    var self = this;
    self.subscribe("uploads", IM.getCurrentDialogId(), function(){
        self.attachment = Uploads.findOne(self.data.id);
    });
}
Template.chatAttachmentDraft.helpers({
    data: function(){
        return Template.instance().attachment;
    },
    isImage: function(){
        var type = Template.instance().attachment.type;
        return ["image/jpeg","image/jpg","image/png","image/gif"].indexOf(type) !==-1;
    }
})
Template.chatAttachmentDraft.events({
    "click .remove-attachment": function(e){
        var attachment = $(e.currentTarget).closest(".attachment");
        var id = attachment.attr("id");
        Meteor.call("removeAttachment", id, GlobalUI.generalCallback(function(){
            var attachments = IM.getMessageAttachmentsDraft();
            IM.updateMessageAttachmentsDraft(_.filter(attachments, function(obj){
                return obj.id !== id;
            }));
        }));
    }
})