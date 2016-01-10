Meteor.methods({
  addTask: function (text, dialogId, assignee, dueDate) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var hash = {
      text: text,
      dialogId: dialogId,
      createdAt: new Date(),
      creatorId: Meteor.userId(),
      status: ISSUE_STATUS.OPENED
    };
    if (assignee){
      hash['assignieId'] = assignee
    }
    if (dueDate){
      hash['dueDate'] = dueDate
    }
    Tasks.insert(hash);
  },

  removeTask: function (taskId) {
    const task = Tasks.findOne(taskId);
    // TODO: Make sure only the owner or admin can delete it
    if (task.creatorId !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.remove(taskId);
  },

  setChecked: function (taskId, setChecked) {
    const task = Tasks.findOne(taskId);
    //TODO: check if user is admin or responsible
    if (!((task.creatorId == Meteor.userId())||(task.assignieId == Meteor.userId))) {
      throw new Meteor.Error("not-authorized");
    }
    if (setChecked){
      Tasks.update(taskId, { $set: { status: ISSUE_STATUS.COMPLETED} });
    }else{
      Tasks.update(taskId, { $set: { status: ISSUE_STATUS.REOPENED} });
    }
  },

  setDueDate: function (taskId, date) {
    const task = Tasks.findOne(taskId);

    // TODO: Make sure only the task creator or admin can set due date
    var dateFromStr = new Date(date);
    //console.log(dateFromStr);
    Tasks.update(taskId, { $set: { dueDate: dateFromStr } });
  },

  setAssiginie: function (taskId, assignieId){
    const task = Tasks.findOne(taskId);
    // TODO: Make sure only the task creator or admin can set due date

    if (assignieId){
      Tasks.update(taskId, { $set: { assignieId: assignieId } });
    }else{
      Tasks.update(taskId,{ $unset: { assignieId: "" } })
    }
  }
});
