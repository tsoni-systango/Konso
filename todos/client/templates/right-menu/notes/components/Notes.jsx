// App component - represents the whole app
NotesReact = React.createClass({

  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  getInitialState() {
    return null;
  },

  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    let query = {};

    return {
      notes: Notes.find(query, {sort: {createdAt: -1}}).fetch(),
      currentUser: Meteor.user()
    };
  },

  renderNotes() {
    // Get tasks from this.data.tasks
    return this.data.notes.map((note) => {
      const currentUserId = this.data.currentUser && this.data.currentUser._id;
      const showPrivateButton = note.owner === currentUserId;

      return <NoteElem
        key={note._id}
        note={note} />;
    });
  },

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    var text = React.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call("addNote", text);

    // Clear form
    React.findDOMNode(this.refs.textInput).value = "";
  },

  render() {
    return (
      <div className="notes-container">
        <header>
          <h4>Note List</h4>
          <form className="new-note" onSubmit={this.handleSubmit} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new notes" />
          </form>
        </header>

        <ul>
          {this.renderNotes()}
        </ul>
      </div>
    );
  }
});
