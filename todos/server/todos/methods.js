
Meteor.methods({
  addTask: function (text, responsible, dueDate) {
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
    if (responsible){
      hash['responsible'] = responsible
    }
    if (dueDate){
      hash['dueDate'] = dueDate
    }

    Tasks.insert(hash);
  },

  removeTask: function (taskId) {
    const task = Tasks.findOne(taskId);
    // TODO: Make sure only the owner or admin can delete it
    if (task.creator !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.remove(taskId);
  },

  setChecked: function (taskId, setChecked) {
    const task = Tasks.findOne(taskId);
    //TODO: check if user is admin or responsible

    Tasks.update(taskId, { $set: { checked: setChecked} });
  },

  setDueDate: function (taskId, date) {
    const task = Tasks.findOne(taskId);

    // TODO: Make sure only the task creator or admin can set due date

    Tasks.update(taskId, { $set: { dueDate: date } });
  },

  setResponsible: function (taskId, responsibleUserId){
    const task = Tasks.findOne(taskId);
    // TODO: Make sure only the task creator or admin can set due date

    if (responsibleUserId){
      Tasks.update(taskId, { $set: { responsible: responsibleUserId } });
    }else{
      Tasks.update(taskId,{ $unset: { responsible: "" } })
    }
  }
});
