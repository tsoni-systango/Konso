WorkCenterInfo = React.createClass({
  getInitialState : function(){
    var NGCount = 0;
    var accumulativeCount = 0;
    var currentEfficiency = 0;
    var currentQualityRate = 0;
    var todayQualityRate = 0;


    this.props.pending_items.map(function(element){
      NGCount += element.personCount ;
    });

    this.props.accumulative_items.map(function(element){
      accumulativeCount += element.personCount;
    });

    if (accumulativeCount){
        currentEfficiency = ((((new Date("2 December 2015") - (new Date(this.props.last_item[0].startTime))) * this.props.last_item[0].personCount)/ (this.props.last_item[0].StandardWorkTime)) / accumulativeCount)/1000;}

    currentQualityRate =  accumulativeCount/(accumulativeCount+NGCount);
    console.log(this.props.data_record_count_function_code);
    console.log(this.props.data_record_count);

    todayQualityRate = this.props.data_record_count_function_code/this.props.data_record_count;

    return{
      NGCount : NGCount,
      accumulativeCount : accumulativeCount,
      currentEfficiency : currentEfficiency,
      todayQualityRate : todayQualityRate
    }
  },
  render : function(){
    return(
      <div>
      {this.props.last_item[0] ? 
        <div style = {{"border":"1px","borderStyle": "solid","borderColor": "#000000","position": 'absolute', "left": this.props.pos_x + 'px',"top": this.props.pos_y +100 + 'px'}}>
          <ul>
            <li> Status : {this.props.last_item[0].currentStatus} </li>
            <li> workcenterName : {this.props.last_item[0].workcenterName} </li>
            <li> machineName : {this.props.last_item[0].machineName} </li>
            <li> workOrderNo : {this.props.last_item[0].workorderNo} </li>
            <li> sequenceNo : {this.props.last_item[0].sequenceNo} </li>
            <li> partNo : {this.props.last_item[0].partno}</li>
            <li> partNoName : {this.props.last_item[0].partnoName}</li>
            <li> deviceNo : {this.props.last_item[0].deviceNo} </li>
            <li> startTime : {this.props.last_item[0].startTime} </li>
            <li> lastTime : {this.props.last_item[0].recordTime} </li>
            <li> NGCount : {this.state.NGCount} </li>
            <li> accumulativeCount : {this.state.accumulativeCount} </li>
            <li> stand output : {this.props.last_item[0].StandardWorkTime} </li>
            <li> currentEfficiency : {this.state.currentEfficiency} </li>
            <li> todayEfficiency : TBD </li>
            <li> currentQualityRate : {this.state.currentQualityRate} </li>
            <li> todayQualityRate : {this.state.todayQualityRate} </li>
            <li> functionCode : {this.props.last_item[0].functionCode} </li>
          </ul>   
        </div>
      :""}
      </div>
      )
    }
})