// Note component - represents a single item in list
reactMenuContainer = React.createClass({
  propTypes: {
    task: React.PropTypes.object.isRequired
  },
  renderSelected() {
    // Get tasks from this.data.tasks
    return this.data.tasks.map((task) => {
      const currentUserId = this.data.currentUser && this.data.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return <Task
          key={task._id}
          task={task}
          showPrivateButton={showPrivateButton} />;
    });
  },

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    // Add "checked" and/or "private" to the className when needed
    //const taskClassName = (this.props.note.checked ? "checked" : "") + " " +
    //  (this.props.task.private ? "private" : "");

    return (
        <ul>{this.renderSelected()}</ul>
    );
  }
});
