Template.attachmentView.onCreated(function(){
    this.subscribe("uploads", [this.attachmentId]);
});
Template.attachmentView.helpers({
   url: function(){
       return Uploads.findOne(this.attachmentId).url();
   }
});
Template.attachmentView.events({
   "click .btn-close": function(e){
       GlobalUI.closeAttachmentView()
   }
});