WorkCenterInfo = React.createClass({

  getInfoDivPos : function() {
    var pos_x = this.props.pos_x;
    var pos_y = this.props.pos_y;
    var dashboard_div = document.getElementById('application-content');
    console.log(this.props.pos_x)
    console.log(this.props.pos_y)
    console.log(dashboard_div.offsetHeight)
    console.log(dashboard_div.offsetWidth)
    console.log(dashboard_div.offsetTop)
    console.log(dashboard_div.offsetLeft)

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

    console.log($(this.getDOMNode()).offset())

    console.log([this.props.pos_x, this.props.pos_y])

    if ((this.props.pos_x) < (dashboard_div.offsetWidth - 300)) {
      pos_x = this.props.pos_x + 100 
    }
    else if ( true ){
      pos_x = this.props.pos_x - 260
    }

    if (false) {
      pos_y = this.props.pos_y 
    }
    else if ( (this.props.pos_y + 370) > dashboard_div.offsetHeight ){
      pos_y = dashboard_div.offsetHeight - 370
    }

    return [pos_x, pos_y]
  },

  render : function(){
    var pos = this.getInfoDivPos();
    console.log([">>>>>>>>", pos])
    return(
      <div className='infobox'>
      {this.props.info_stats.last_item ? 
        <div style = {{"border":"1px","borderStyle": "solid","borderColor": "#000000","position": 'absolute', "left": pos[0] + 'px',"top": pos[1] + 'px'}}>
          <ul>
            <li> Status : {this.props.info_stats.last_item.currentStatus} </li>
            <li> WorkCenterName : {this.props.info_stats.last_item.workcenterName} </li>
            <li> MachineName : {this.props.info_stats.last_item.machineName} </li>
            <li> WorkOrderNo : {this.props.info_stats.last_item.workorderNo} </li>
            <li> SequenceNo : {this.props.info_stats.last_item.sequenceNo} </li>
            <li> PartNo : {this.props.info_stats.last_item.partno}</li>
            <li> PartNoName : {this.props.info_stats.last_item.partnoName}</li>
            <li> DeviceNo : {this.props.info_stats.last_item.deviceNo} </li>
            <li> StartTime : {this.props.info_stats.last_item.startTime} </li>
            <li> LastTime : {this.props.info_stats.last_item.recordTime} </li>
            <li> NGCount : {this.props.info_stats.NGCount} </li>
            <li> AccumulativeCount : {this.props.info_stats.accumulativeCount} </li>
            <li> Avg. Output : {this.props.info_stats.avg_output} </li>
            <li> StandardOutput : {this.props.info_stats.last_item.StandardWorkTime} </li>
            <li> CurrentEfficiency : {this.props.info_stats.currentEfficiency} </li>
            <li> TodayEfficiency : {this.props.info_stats.todayEfficiency} </li>
            <li> CurrentQualityRate : {this.props.info_stats.currentQualityRate} </li>
            <li> TodayQualityRate : {this.props.info_stats.todayQualityRate} </li>
            <li> FunctionCode : {this.props.info_stats.last_item.functionCode} </li>
          </ul>   
        </div>
      :""}
      </div>
      )
    }
})
