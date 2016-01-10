Template.todos.onCreated(function () {
  this.autorun(function () {
    Meteor.subscribe("tasks", IM.getCurrentDialogId());
  });
  //React.render(<Todos />, document.getElementById("render-target"));
});
Template.todos.helpers({
  Todos: function () {
    return Todos;
  }
});