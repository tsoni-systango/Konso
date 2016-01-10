// Task component - represents a single todo item
Task = React.createClass({
  propTypes: {
    task: React.PropTypes.object.isRequired
  },

  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],
  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    let query = {};

    return {
      users: Meteor.users.find({}).fetch()
    };
  },

  componentDidMount(){
    $('.datepicker').pickadate({
      //format: "yyyy-mm-dd",
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15, // Creates a dropdown of 15 years to control year
      container: 'body'
    });
    $('.dropdown-button').dropdown({
          inDuration: 300,
          outDuration: 225,
          constrain_width: true, // Does not change width of dropdown to that of the activator
          hover: false, // Activate on hover
          gutter: 0, // Spacing from edge
          belowOrigin: true, // Displays dropdown below the button
          alignment: 'left' // Displays dropdown with edge aligned to the left of button
        }
    );
  },

  setDueDate(event){
    event.preventDefault();
    // Find the text field via the React ref
    var dateSelected = React.findDOMNode(this.refs.dueDate).value.trim();
    console.log(dateSelected);

    Meteor.call("setDueDate",this.props.task._id, dateSelected)
  },

  toggleChecked() {
    // Set the checked property to the opposite of its current value
    var checked = false;
    if (this.props.task.status == ISSUE_STATUS.OPENED ||this.props.task.status == ISSUE_STATUS.REOPENED ){
      checked = true;
    }
    Meteor.call("setChecked", this.props.task._id, checked);
  },

  deleteThisTask() {
    Meteor.call("removeTask", this.props.task._id);
  },
  setAssiginie(){
    Meteor.call("setAssiginie",this.props.task._id);
  },
  renderUsers(){
    var allUsers = this.data.users;
    var limitedUsers = allUsers.slice(0,5);
    var userlist = limitedUsers.map((user)=>{
      return (<li><a href="#!" className="user-item">{user.username}</a></li>);

    });
    return userlist;
  },

  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS
    // Add "checked" and/or "private" to the className when needed

    var getDateStr = function (date){
      var months = new Array(12);
      months[0] = "January"; months[1] = "February";
      months[2] = "March"; months[3] = "April";
      months[4] = "May"; months[5] = "June";
      months[6] = "July"; months[7] = "August";
      months[8] = "September"; months[9] = "October";
      months[10] = "November"; months[11] = "December";
      var month_value = date.getMonth();
      return date.getDate()+" "+months[month_value]+", "+date.getFullYear();
    };

    //var current_date = new Date();
    //month_value = current_date.getMonth();
    //day_value = current_date.getDate();
    //year_value = current_date.getFullYear();
    //
    //document.write("The current date is " + months[month_value] + " " +
    //    day_value + ", " + year_value);

    const taskClassName = (this.props.task.checked ? "checked" : "") + " " +
      (this.props.task.private ? "private" : "");
    //const taskDueDate = (this.props.task.dueDate ? this.props.task.dueDate.toISOString().slice(0,10): "");
    const taskDueDate = (this.props.task.dueDate ? getDateStr(this.props.task.dueDate) : "");
    const checked = (this.props.task.status == ISSUE_STATUS.COMPLETED);
    var getUserName = function (passedId) {
      var user = Meteor.users.findOne({assignieId: passedId});
      if (user&&passedId){
        return user.username
      }else{
        return ''
      }
    };

    const currentAssignie = getUserName(this.props.task.assignieId);

    const dropdownId = 'dropdown-'+this.props.task._id;

    return (
      <li className={taskClassName}>

        <input
          type="checkbox"
          readOnly={true}
          checked={checked}
          onClick={this.toggleChecked}
          id={this.props.task._id}/>
        <label htmlFor={this.props.task._id}
               onClick={this.toggleChecked}>
          <span className="text">
            <strong>{this.props.task.username}</strong>: {this.props.task.text}
          </span>
        </label>
        <form className="set-due-date" onSubmit={this.setDueDate}>
          <input
              className="datepicker"
              type="date"
              ref="dueDate"
              placeholder="Choose the due date" value={taskDueDate}/>
          <input className="btn" type="submit" value="Add due date" />
        </form>
        {/*
        <form className="set-assignie" onSubmit={this.setAssiginie}>
          <input
              type="text"
              ref="dueDate"
              placeholder="Set assignie for todo"
              className="dropdown-button" data-activates={dropdownId}
              />
          <input className="btn" type="submit" value="Assign" />
        </form>
        */}

        <ul id={dropdownId} className='dropdown-content'>
          {this.renderUsers()}
        </ul>

        <button className="delete btn-flat btn-small" onClick={this.deleteThisTask}>
          <i className="mdi-content-clear"></i>
        </button>
      </li>
    );
  }
});
