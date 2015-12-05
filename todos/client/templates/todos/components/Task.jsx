// Task component - represents a single todo item
Task = React.createClass({
  propTypes: {
    task: React.PropTypes.object.isRequired
  },

  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call("setChecked", this.props.task._id, ! this.props.task.checked);
  },

  deleteThisTask() {
    Meteor.call("removeTask", this.props.task._id);
  },

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    // Add "checked" and/or "private" to the className when needed
    const taskClassName = (this.props.task.checked ? "checked" : "") + " " +
      (this.props.task.private ? "private" : "");

    return (
      <li className={taskClassName}>

        <input
          type="checkbox"
          readOnly={true}
          checked={this.props.task.checked}
          onClick={this.toggleChecked}
          id={this.props.task._id}/>
        <label htmlFor={this.props.task._id}
               onClick={this.toggleChecked}>
          <span className="text">
            <strong>{this.props.task.username}</strong>: {this.props.task.text}
          </span>
        </label>

        <button className="delete btn-flat btn-small" onClick={this.deleteThisTask}>
          <i className="mdi-content-clear"></i>
        </button>
      </li>
    );
  }
});
