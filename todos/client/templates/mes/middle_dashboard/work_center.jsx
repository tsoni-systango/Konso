WorkCenter = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData : function(){
    var pending_items = []
    var accumulative_items = []
    var last_item = DataRecord.find({workcenterCode:this.props.workcenterCode,$or:[{functionCode:"C001"},{functionCode:/S.*/}]},{sort: {recordTime:-1}, limit: 1}).fetch();
    var startDate = new Date();
    startDate = new Date( startDate.toLocaleDateString() )
    var endDate = new Date();
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate = new Date(endDate);

    var data_records = DataRecord.find({}).fetch();

    var data_record_count = 0;
    var data_record_count_function_code = 0;

    data_records.map(function(element){
      if ((element.workcenterCode == this.props.workcenterCode) && (element.recordTime >= startDate) && (element.recordTime >= endDate))  {
        data_record_count += element.personCount;
      }
    }.bind(this));

    data_records.map(function(element){
      if ((element.workcenterCode == this.props.workcenterCode) && (element.functionCode=="C001") && (element.recordTime >= startDate) && (element.recordTime >= endDate))  {
        data_record_count_function_code += element.personCount;
      }
    }.bind(this));

    if (last_item[0]){
      pending_items = DataRecord.find({workcenterCode:this.props.workcenterCode,recordTime:{ $lt:  Date(),$gt:last_item[0].startTime},functionCode:/F.*/}).fetch()
      
      accumulative_items = DataRecord.find({workcenterCode:this.props.workcenterCode,workorderNo:last_item[0].workorderNo,functionCode:"C001",recordTime:{$lt:Date(),$gt:last_item[0].startTime}}).fetch()
    }

    return{
      work_center_data_records : DataRecord.find({workcenterCode: this.props.workcenterCode}).fetch(),
      last_item : last_item,
      pending_items : pending_items,
      accumulative_items : accumulative_items,
      data_record_count : data_record_count,
      data_record_count_function_code : data_record_count_function_code
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
      if (this.data.last_item[0])
        {var status = this.data.last_item[0].currentStatus;}
      var colour = "#00000";
      do_flash = false;
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
          colour = "#0000"
      }
      return [colour,do_flash]  
    }.bind(this);
    return(
        <div>
        { this.state.show_info ? <WorkCenterInfo last_item={this.data.last_item} pos_x={this.state.pos_x} pos_y={this.state.pos_y} pending_items={this.data.pending_items} accumulative_items={this.data.accumulative_items} data_record_count={this.data.data_record_count} data_record_count_function_code={this.data.data_record_count_function_code} /> : '' }
       <Draggable ref="draggable" initialPos={this.props.position} data_attr={this.props.workcenterCode} onChange={this.savePosition} over={this.mouseOver} out = {this.mouseOut} colour={get_state()[0]} do_flash={get_state()[1]} />
       </div>
      )
  }
})