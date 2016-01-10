
Meteor.methods({
  addNote: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var hash = {
      text: text,
      createdAt: new Date(),
      creator: Meteor.userId(),
      username: Meteor.user().username
    };
    Notes.insert(hash);
  },

  removeNote: function (noteId) {
    const task = Notes.findOne(noteId);
    // TODO: Make sure only the owner or admin can delete it
    if (task.creator !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Notes.remove(noteId);
  }
});
