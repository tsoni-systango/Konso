WorkCenter = React.createClass({
 
  mixins: [ReactMeteorData],

  getMeteorData : function(){
    var pending_items = []
    var accumulative_items = []
    var data_records = DataRecord.find({workcenterCode:this.props.workcenterCode}).fetch();
    var total_items = DataRecord.find({workcenterCode:this.props.workcenterCode,$or:[{functionCode:"C001"},{functionCode:/S.*/}]},{sort: {recordTime:-1}, limit: 1}).fetch();
    last_item = total_items[0];
    if (last_item) {
      pending_items = DataRecord.find({workcenterCode:this.props.workcenterCode,recordTime:{ $lt:  Date(),$gte:last_item.startTime},functionCode:/F.*/}).fetch();
      accumulative_items = DataRecord.find({workcenterCode:this.props.workcenterCode,workorderNo:last_item.workorderNo,functionCode:"C001",recordTime:{$lt:Date(),$gte:last_item.startTime}}).fetch()
  
      //accumulativeCount sum(dataRecord.Count), condition is dataRecord.workcenterCode = last.workcenterCode and dataRecord.workorderNo = last.workorderNo and dataRecord.recordTime between last.startTime and currentTime and dataRecord.functionCode = "C001"
      var accumulativeCount = 0;
      accumulative_items.map(function(element){
        accumulativeCount += element.personCount;
      });
      
      // avg output (currentTime - last.startTime) * last.personCount / accumulativeCount
      var avg_output = 0;
      avg_output = ((new Date() - (new Date(last_item.startTime))) * last_item.personCount) / accumulativeCount
  
      // currentEfficiency ((currentTime - last.startTime) * peopleCount  / last.standardWorkTime) / accumulativeCount, convert to percent.
      var currentEfficiency = 0;
      currentEfficiency = ((((new Date() - (new Date(last_item.startTime))) * last_item.personCount)/ (last_item.StandardWorkTime)) / accumulativeCount)/1000;

    };

    var data_record_count = 0;
    var data_record_count_function_code = 0;

    var start = new Date(moment().startOf('day')).toString()
    var end = new Date(moment().endOf('day')).toString()

    var todays_dr = DataRecord.find({workcenterCode:this.props.workcenterCode,recordTime:{ $gte:start, $lte:end }}).fetch();
    todays_dr.map(function(element){ 
      data_record_count += element.personCount 
      data_record_count_function_code += element.personCount;
    });

    // NGCount  sum(last2.Count)
    var NGCount = 0;
    pending_items.map(function(element){
      NGCount += element.personCount ;
    });

    // todayEfficiency  "1. Get the record of which workcenterNo is  current workcenter, recordTime belong to today (from 0:00 ~ 23:59:59), functionCode is ""C001"", Grouped by startTime, summarize the Count as ""production quantity"", ""Production quantity"" * peopleCount / standWorkTime as ""Standard Efficiency"", ""Production Quantity"" * peopleCount * (currentTime - startTime ) as as ""Fact Efficiency"" . 
    //2. Summarize the ""Standard Efficiency"" / Summarize the ""Fact Efficiency"" of 1, convert to percent."
    var todayEfficiency = 0;
    // TBD

    if (accumulativeCount) {
      // currentQualityRate accumulativeCount / (accumulativeCount + NGCount) , convert to percent
      var currentQualityRate = 0;
      currentQualityRate =  accumulativeCount/(accumulativeCount+NGCount);      
    };

    //todayQualityRate  "1.To summerize the count of dataRecord of today  and workcenterNo is current workcenter.
    //2. To summerize the count of dataRecord of today , current workcenter, functionCode is ""C001"".
    //3.  2 / 1, Convert to percent."
    var todayQualityRate = 0;

    todayQualityRate = data_record_count_function_code / data_record_count;

    return{
      last_item : last_item,
      NGCount : NGCount,
      accumulativeCount : accumulativeCount,
      currentEfficiency : currentEfficiency,
      todayQualityRate : todayQualityRate,
      avg_output : avg_output,
      currentQualityRate : currentQualityRate
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
      if (this.data.last_item && this.data.avg_output && this.data.last_item.StandardWorkTime && (this.data.avg_output < this.data.last_item.StandardWorkTime)) {
        var status = 'OTHER';
      } else if (this.data.last_item){
        var status = this.data.last_item.currentStatus;
      }
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
        case "OTHER":
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
        { this.state.show_info ? <WorkCenterInfo workcenterCode={this.props.workcenterCode} pos_x={this.state.pos_x} pos_y={this.state.pos_y} info_stats={this.data}/> : '' }
       <Draggable ref="draggable" initialPos={this.props.position} data_attr={this.props.workcenterCode} onChange={this.savePosition} over={this.mouseOver} out = {this.mouseOut} colour={get_state()[0]} do_flash={get_state()[1]} />
       </div>
      )
  }
})