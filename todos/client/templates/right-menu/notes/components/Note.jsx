// Note component - represents a single item in list
NoteElem = React.createClass({
  propTypes: {
    task: React.PropTypes.object.isRequired
  },


  deleteThisNote() {
    Meteor.call("removeNotes", this.props.note._id);
  },

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    // Add "checked" and/or "private" to the className when needed
    //const taskClassName = (this.props.note.checked ? "checked" : "") + " " +
    //  (this.props.task.private ? "private" : "");

    return (
      //<li className={taskClassName}>
      <li>
        <label htmlFor={this.props.note._id}>
          <span className="text">
            <strong>{this.props.note.username}</strong>: {this.props.note.text}
          </span>
        </label>

        <button className="delete btn-flat btn-small" onClick={this.deleteThisNote}>
          <i className="mdi-content-clear"></i>
        </button>
      </li>
    );
  }
});
