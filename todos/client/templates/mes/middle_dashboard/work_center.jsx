WorkCenter = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData : function(){
    var pending_items = []
    var accumulative_items = []
    var data_records = DataRecord.find({workcenterCode:this.props.workcenterCode}).fetch();
    var last_item = DataRecord.findOne({workcenterCode:this.props.workcenterCode, $or:[{functionCode:"C001"}, {functionCode:/S.*/}]}, {sort: {recordTime: -1}});
    if (last_item) {

      pending_items = DataRecord.find({workcenterCode:this.props.workcenterCode,recordTime:{ $lte: _Now(), $gte: last_item.startTime},functionCode:/F*/}).fetch();

      var accumulativeCount = 0;
      var accumulativeCountRecords = DataRecord.find({workcenterCode:this.props.workcenterCode,workorderNo:last_item.workorderNo,functionCode:"C001",recordTime:{$lte: _Now(),$gte:last_item.startTime}}).fetch()
      accumulativeCountRecords.map(function(record){
        accumulativeCount += record.count;
      });

      var avg_output = 0;
      if (accumulativeCount)
      avg_output = (3600/(_Now() - last_item.startTime)) * accumulativeCount
      if (avg_output){ avg_output = avg_output.toFixed(2)}

      var currentEfficiency = 0;
      if (accumulativeCount)
      currentEfficiency = (((_Now() - (new Date(last_item.startTime)))/ (last_item.StandardWorkTime)) / accumulativeCount)/1000;
      if (currentEfficiency) { currentEfficiency = (currentEfficiency * 100).toFixed(2) }

      var todayEfficiency = 0;
      var production_quantity = DataRecord.find({workcenterCode:this.props.workcenterCode,recordTime:{ $gte: _DayStart() , $lte: _DayEnd() }, functionCode:"C001"}).count()
      var todays_date = (_Now() - last_item.startTime)
      var standard_efficiency = production_quantity/last_item.StandardWorkTime
      var fact_efficiency = production_quantity *(_Now() - last_item.startTime)
      todayEfficiency = standard_efficiency / fact_efficiency
      if (todayEfficiency) { todayEfficiency = (todayEfficiency * 100).toFixed(2) }
    };

    var data_record_count = 0;
    var data_record_count_function_code = 0;

    var todays_dr = DataRecord.find({workcenterCode:this.props.workcenterCode,recordTime:{ $gte:_DayStart(), $lte:_DayEnd() }}).fetch();
    todays_dr.map(function(element){
      data_record_count += element.personCount
      data_record_count_function_code += element.personCount;
    });

    // NGCount  sum(last2.Count)
    var NGCount = 0;
    pending_items.map(function(element){
      NGCount += element.count ;
    });


    if (accumulativeCount) {
      // currentQualityRate accumulativeCount / (accumulativeCount + NGCount) , convert to percent
      var currentQualityRate = 0;
      currentQualityRate =  accumulativeCount/(accumulativeCount+NGCount);
      if (currentQualityRate){ currentQualityRate = currentQualityRate.toFixed(2);}
    };

    //todayQualityRate  "1.To summerize the count of dataRecord of today  and workcenterNo is current workcenter.
    //2. To summerize the count of dataRecord of today , current workcenter, functionCode is ""C001"".
    //3.  2 / 1, Convert to percent."
    var todayQualityRate = 0;

    todayQualityRate = data_record_count_function_code / data_record_count;
    if (todayQualityRate){todayQualityRate = todayQualityRate.toFixed(2)}
    return{
      last_item : last_item,
      NGCount : NGCount,
      accumulativeCount : accumulativeCount,
      currentEfficiency : currentEfficiency,
      todayQualityRate : todayQualityRate,
      avg_output : avg_output,
      currentQualityRate : currentQualityRate,
      todayEfficiency : todayEfficiency
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
    if (x_coordinate >= 0 && y_coordinate >= 0) {
      x_coordinate = x_coordinate/this.props.page_width;
      y_coordinate = y_coordinate/this.props.page_height;
      Meteor.call("savePosition",this.props.workcenterCode,x_coordinate,y_coordinate)
    };
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
      var colour = "RED";
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
        case "START":
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
        { this.state.show_info && this.data.last_item ? <WorkCenterInfo workcenterCode={this.props.workcenterCode} pos_x={this.state.pos_x} pos_y={this.state.pos_y} info_stats={this.data}/> : '' }
        <Draggable ref="draggable" initialPos={this.props.position} data_attr={this.props.workcenterCode} onChange={this.savePosition} over={this.mouseOver} out = {this.mouseOut} colour={get_state()[0]} do_flash={get_state()[1]} />
      </div>
    )
  }
})
