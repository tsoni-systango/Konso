WorkCenter = React.createClass({
 
  mixins: [ReactMeteorData],

  getMeteorData : function(){
    var total_items = DataRecord.find({workcenterCode:this.props.workcenterCode,$or:[{functionCode:"C001"},{functionCode:/S.*/}]},{sort: {recordTime:-1}, limit: 1}).fetch();
    last_item = total_items[0];
    return{
      last_item : last_item
    }
  },

  getInitialState : function(){
    return{
      show_info : false,
      pos_x : 0,
      pos_y : 0,
    }
  },

  savePosition : function(x_coordinate,y_coordinate){
    x_coordinate = x_coordinate/this.props.page_width;
    y_coordinate = y_coordinate/this.props.page_height;
    Meteor.call("savePosition",this.props.workcenterCode,x_coordinate,y_coordinate)
  },

  mouseOver : function(x,y){
    this.setState({show_info:true,pos_x:x,pos_y:y});
  },

  mouseOut : function(){
    this.setState({show_info:false});
  },

  render : function(){
    var get_state = function(){
      if (this.data.last_item) {var status = this.data.last_item.currentStatus;}
      var colour = "#00000";
      var do_flash = false;
      switch(status) {
        case "ONLINE":
          colour = "GREEN"
          break;
        case "OFFLINE":
          colour = "RED"
          break;
        case "FAULT":
          colour = "RED"
          do_flash = true
          break;
        case "PAUSE":
          colour = "BLUE"
          break;
        case "STOP":
          colour = "GRAY"
          break;
        case "WORKING":
          colour = "GREEN"
          do_flash = true
          break;
        default:
          colour = "YELLOW"
          do_flash = true
          //OTHER: show the background yellow with flash, this status didn't include in the status column, you must calculate it, if the production  
          //efficiency(avg output) is lower than standard production(stand output) effciency then show it.
          //you will get the last status (by get the maximal recordtime of current workcenter and corresponding record) and paint the status on the 
          //chart.

      }
      return [colour,do_flash]  
    }.bind(this);
    return(
        <div>
        { this.state.show_info ? <WorkCenterInfo workcenterCode={this.props.workcenterCode} pos_x={this.state.pos_x} pos_y={this.state.pos_y} /> : '' }
       <Draggable ref="draggable" initialPos={this.props.position} data_attr={this.props.workcenterCode} onChange={this.savePosition} over={this.mouseOver} out = {this.mouseOut} colour={get_state()[0]} do_flash={get_state()[1]} />
       </div>
      )
  }
})