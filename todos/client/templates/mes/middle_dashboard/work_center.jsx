WorkCenter = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData : function(){
    Meteor.subscribe("dataRecordCount",this.props.workcenterCode);
    var pending_items = []
    var accumulative_items = []
    var last_item = DataRecord.find({workcenterCode:this.props.workcenterCode,$or:[{functionCode:"C001"},{functionCode:/S.*/}]},{sort: {recordTime:-1}, limit: 1}).fetch();
    
    var startDate = new Date();
    startDate = new Date( date.toLocaleDateString() )
    var endDate = new Date();
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate = new Date(endDate);

    var data_record_count = DataRecord.aggregate([{$match:{workcenterCode:workcenterCode, recordTime:{ $gte:startDate, $lt:endDate }}},{$group:{_id:"$workcenterCode",total:{$sum:"$personCount"}}}]).fetch()
    
    var data_record_count_function_code = DataRecord.aggregate([{$match:{workcenterCode:workcenterCode,{functionCode:"C001"},recordTime:{ $gte:startDate, $lt:endDate }}},{$group:{_id:"$workcenterCode",total:{$sum:"$personCount"}}}]).fetch();

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
      pos_x : 250,
      pos_y : 250
    }
  },
  savePosition : function(x_coordinate,y_coordinate){
    x_coordinate = x_coordinate/this.props.page_width;
    y_coordinate = y_coordinate/this.props.page_height;
    Meteor.call("savePosition",this.props.workcenterCode,x_coordinate,y_coordinate)
  },
  mouseOver : function(){
    this.setState({show_info:true});

  },
  mouseOut : function(){
    this.setState({show_info:false});
  },
  render : function(){
    return(
        <div>
        { this.state.show_info ? <WorkCenterInfo last_item={this.data.last_item} pos_x={this.state.pos_x} pos_y={this.state.pos_y} pending_items={this.data.pending_items} accumulative_items={this.data.accumulative_items} data_record_count={this.data.data_record_count} data_record_count_function_code={this.data.data_record_count_function_code} />: null }

       <Draggable ref="draggable" initialPos={this.props.position} data_attr={this.props.workcenterCode} onChange={this.savePosition} over={this.mouseOver} out = {this.mouseOut}/>
       </div>
      )
  }
})