Template.todos.onCreated(function () {
  Meteor.subscribe("tasks");
  //React.render(<Todos />, document.getElementById("render-target"));
});
Template.todos.helpers({
  Todos: function () {
    return Todos;
  }
})