Template.notes.onCreated(function () {
  Meteor.subscribe("notes");
  //React.render(<Todos />, document.getElementById("render-target"));
});
Template.notes.helpers({
  NotesReact: function () {
    return NotesReact;
  }
})