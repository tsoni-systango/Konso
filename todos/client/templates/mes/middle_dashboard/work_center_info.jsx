WorkCenterInfo = React.createClass({

  render : function(){
    return(
      <div>
      {this.props.info_stats.last_item ? 
        <div style = {{"border":"1px","borderStyle": "solid","borderColor": "#000000","position": 'absolute', "left": this.props.pos_x + 'px',"top": this.props.pos_y +100 + 'px'}}>
          <ul>
            <li> Status : {this.props.info_stats.last_item.currentStatus} </li>
            <li> workcenterName : {this.props.info_stats.last_item.workcenterName} </li>
            <li> machineName : {this.props.info_stats.last_item.machineName} </li>
            <li> workOrderNo : {this.props.info_stats.last_item.workorderNo} </li>
            <li> sequenceNo : {this.props.info_stats.last_item.sequenceNo} </li>
            <li> partNo : {this.props.info_stats.last_item.partno}</li>
            <li> partNoName : {this.props.info_stats.last_item.partnoName}</li>
            <li> deviceNo : {this.props.info_stats.last_item.deviceNo} </li>
            <li> startTime : {this.props.info_stats.last_item.startTime} </li>
            <li> lastTime : {this.props.info_stats.last_item.recordTime} </li>
            <li> NGCount : {this.props.info_stats.NGCount} </li>
            <li> accumulativeCount : {this.props.info_stats.accumulativeCount} </li>
            <li> Avg. Output : {this.props.info_stats.avg_output} </li>
            <li> standard output : {this.props.info_stats.last_item.StandardWorkTime} </li>
            <li> currentEfficiency : {this.props.info_stats.currentEfficiency} </li>
            <li> todayEfficiency : TBD </li>
            <li> currentQualityRate : {this.props.info_stats.currentQualityRate} </li>
            <li> todayQualityRate : {this.props.info_stats.todayQualityRate} </li>
            <li> functionCode : {this.props.info_stats.last_item.functionCode} </li>
          </ul>   
        </div>
      :""}
      </div>
      )
    }
})
