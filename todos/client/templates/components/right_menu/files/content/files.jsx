Template.files.onCreated(function () {
    this.autorun(function () {
        Meteor.subscribe("dialogUploads", IM.getCurrentDialogId());
    });
});
Template.files.helpers({
    FilesReact: function () {
        return FilesReact;
    }
});