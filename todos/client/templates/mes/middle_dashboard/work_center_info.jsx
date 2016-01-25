WorkCenterInfo = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData : function(){

    var pending_items = []
    var accumulative_items = []
    var data_records = DataRecord.find().fetch();
    var total_items = DataRecord.find({workcenterCode:this.props.workcenterCode,$or:[{functionCode:"C001"},{functionCode:/S.*/}]},{sort: {recordTime:-1}, limit: 1}).fetch();
    last_item = total_items[0];

    pending_items = DataRecord.find({workcenterCode:this.props.workcenterCode,recordTime:{ $lt:  Date(),$gt:last_item.startTime},functionCode:/F.*/}).fetch()
    accumulative_items = DataRecord.find({workcenterCode:this.props.workcenterCode,workorderNo:last_item.workorderNo,functionCode:"C001",recordTime:{$lt:Date(),$gt:last_item.startTime}}).fetch()

    var startDate = new Date();

    startDate = new Date( startDate.toLocaleDateString() )
    var endDate = new Date();
    endDate.setHours(23);
    endDate.setMinutes(59);
    endDate = new Date(endDate);

    var data_record_count = 0;
    var data_record_count_function_code = 0;

    data_records.map(function(element){
      if ((element.recordTime >= startDate) && (element.recordTime >= endDate))  {
        data_record_count += element.personCount;
      }
    });

    data_records.map(function(element){
      if ((element.functionCode=="C001") && (element.recordTime >= startDate) && (element.recordTime >= endDate))  {
        data_record_count_function_code += element.personCount;
      }
    });

    // NGCount  sum(last2.Count)
    var NGCount = 0;
    pending_items.map(function(element){
      NGCount += element.personCount ;
    });

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

    // todayEfficiency  "1. Get the record of which workcenterNo is  current workcenter, recordTime belong to today (from 0:00 ~ 23:59:59), functionCode is ""C001"", Grouped by startTime, summarize the Count as ""production quantity"", ""Production quantity"" * peopleCount / standWorkTime as ""Standard Efficiency"", ""Production Quantity"" * peopleCount * (currentTime - startTime ) as as ""Fact Efficiency"" . 
    //2. Summarize the ""Standard Efficiency"" / Summarize the ""Fact Efficiency"" of 1, convert to percent."
    var todayEfficiency = 0;
    // TBD

    // currentQualityRate accumulativeCount / (accumulativeCount + NGCount) , convert to percent
    var currentQualityRate = 0;
    currentQualityRate =  accumulativeCount/(accumulativeCount+NGCount);

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

  render : function(){
    return(
      <div>
      {this.data.last_item ? 
        <div style = {{"border":"1px","borderStyle": "solid","borderColor": "#000000","position": 'absolute', "left": this.props.pos_x + 'px',"top": this.props.pos_y +100 + 'px'}}>
          <ul>
            <li> Status : {this.data.last_item.currentStatus} </li>
            <li> workcenterName : {this.data.last_item.workcenterName} </li>
            <li> machineName : {this.data.last_item.machineName} </li>
            <li> workOrderNo : {this.data.last_item.workorderNo} </li>
            <li> sequenceNo : {this.data.last_item.sequenceNo} </li>
            <li> partNo : {this.data.last_item.partno}</li>
            <li> partNoName : {this.data.last_item.partnoName}</li>
            <li> deviceNo : {this.data.last_item.deviceNo} </li>
            <li> startTime : {this.data.last_item.startTime} </li>
            <li> lastTime : {this.data.last_item.recordTime} </li>
            <li> NGCount : {this.data.NGCount} </li>
            <li> accumulativeCount : {this.data.accumulativeCount} </li>
            <li> Avg. Output : {this.data.avg_output} </li>
            <li> standard output : {this.data.last_item.StandardWorkTime} </li>
            <li> currentEfficiency : {this.data.currentEfficiency} </li>
            <li> todayEfficiency : TBD </li>
            <li> currentQualityRate : {this.data.currentQualityRate} </li>
            <li> todayQualityRate : {this.data.todayQualityRate} </li>
            <li> functionCode : {this.data.last_item.functionCode} </li>
          </ul>   
        </div>
      :""}
      </div>
      )
    }
})



/*
    var get_state = function(){
      if (this.data.last_item)
        {var status = this.data.last_item.currentStatus;}
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
          colour = "YELLOW"
          do_flash = true
          //OTHER: show the background yellow with flash, this status didn't include in the status column, you must calculate it, if the production  
          //efficiency(avg output) is lower than standard production(stand output) effciency then show it.
          //you will get the last status (by get the maximal recordtime of current workcenter and corresponding record) and paint the status on the 
          //chart.

      }
      return [colour,do_flash]  
    }.bind(this);
*/

/* 
status  last.status 
workcenterName  last.workcenterName
machineName last.machineName
workOrderNo last.workOrderNo
sequenceNo  last.sequenceNo
partNo  last.partNo
partNoName  last.partNoName
deviceNo  last.deviceNo
startTime last.startTime
lastTime  last.recordTime
NGCount sum(last2.Count) 
accumulativeCount sum(dataRecord.Count), condition is dataRecord.workcenterCode = last.workcenterCode and dataRecord.workorderNo = last.workorderNo and dataRecord.recordTime between last.startTime and currentTime and dataRecord.functionCode = "C001"
avg output  (currentTime - last.startTime) * last.personCount / accumulativeCount
stand output  last.standardWorkTime
currentEfficiency ((currentTime - last.startTime) * peopleCount  / last.standardWorkTime) / accumulativeCount, convert to percent.
todayEfficiency "1. Get the record of which workcenterNo is  current workcenter, recordTime belong to today (from 0:00 ~ 23:59:59), functionCode is ""C001"", Grouped by startTime, summarize the Count as ""production quantity"", ""Production quantity"" * peopleCount / standWorkTime as ""Standard Efficiency"", ""Production Quantity"" * peopleCount * (currentTime - startTime ) as as ""Fact Efficiency"" . 
2. Summarize the ""Standard Efficiency"" / Summarize the ""Fact Efficiency"" of 1, convert to percent."
currentQualityRate  accumulativeCount / (accumulativeCount + NGCount) , convert to percent
todayQualityRate  "1.To summerize the count of dataRecord of today  and workcenterNo is current workcenter.
2. To summerize the count of dataRecord of today , current workcenter, functionCode is ""C001"".
3.  2 / 1, Convert to percent."
functionCode  Last function code name
*/