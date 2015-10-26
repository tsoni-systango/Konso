Template.chatAttachmentDraft.onCreated(function(){
    var self = this;
    console.log(this)
   // self.subscribe("uploads", [self.data._id]);
});
Template.chatAttachmentDraft.onRendered(function(){
    var self = this;
    var remove = self.$(".remove-attachment");

    circle.animate(0.7);
});
Template.chatAttachmentDraft.helpers({
    isImage: function(){
        var attachment = Uploads.findOne(this._id);
        if(attachment){
            //return attachment.isImage();
        }
    },
    url: function(){
        var attachment = Uploads.findOne(this._id);
        if(attachment){
            return attachment.url();
        }
    },
    isInProgress: function(){
      return this.false
    }
})
Template.chatAttachmentDraft.events({
    "click .remove-attachment": function(e){
        var attachment = $(e.currentTarget).closest(".attachment");
        var id = attachment.attr("id");
        Meteor.call("removeAttachment", id, GlobalUI.generalCallback(function(){
            var attachments = IM.getMessageAttachmentsDraft();
            IM.updateMessageAttachmentsDraft(_.filter(attachments, function(obj){
                return obj._id !== id;
            }));
        }));
    }
})