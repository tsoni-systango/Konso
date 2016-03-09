WorkCenterInfo = React.createClass({

  getInfoDivPos : function() {
    var pos_x = this.props.pos_x;
    var pos_y = this.props.pos_y;
    var dashboard_div = document.getElementById('application-content');

    if ((this.props.pos_x + 100) < (dashboard_div.offsetWidth - 200)) {
      pos_x = this.props.pos_x + 100
    }
    else{
      pos_x = this.props.pos_x - 200
    }

    if ((this.props.pos_y + 410) > dashboard_div.offsetHeight) {
      pos_y = dashboard_div.offsetHeight - 410
    }

    return [pos_x, pos_y]
  },

  render : function(){
    var pos = this.getInfoDivPos();
    return(
      <div className="WorkCenterInfoBox" style = {{"left": pos[0] + 'px',"top": pos[1] + 'px', "width": "200"}}>
        {this.props.info_stats.last_item ?
          <ul>
            <li> 状态 : {this.props.info_stats.last_item.currentStatus} </li>
            <li> 工作中心名称 : {this.props.info_stats.last_item.workcenterName} </li>
            <li> 机器名称 : {this.props.info_stats.last_item.machineName} </li>
            <li> 工作订单数  : {this.props.info_stats.last_item.workorderNo} </li>
            <li> 序列数 : {this.props.info_stats.last_item.sequenceNo} </li>
            <li> 部分数 : {this.props.info_stats.last_item.partno}</li>
            <li> 部分数名称 : {this.props.info_stats.last_item.partnoName}</li>
            <li> 设备数 : {this.props.info_stats.last_item.deviceNo} </li>
            <li> 开始时间 : {moment(this.props.info_stats.last_item.startTime).format("MMM Do h:mm:s")} </li>
            <li> 最后的时间 : {moment(this.props.info_stats.last_item.recordTime).format("MMM Do h:mm:s")} </li>
            <li> NG次数 : {this.props.info_stats.NGCount} </li>
            <li> 累计计数 : {this.props.info_stats.accumulativeCount} </li>
            <li> 平均输出 : {this.props.info_stats.avg_output} </li>
            <li> 标准输出 : {this.props.info_stats.last_item.StandardWorkTime} </li>
            <li> 电流效率 : {this.props.info_stats.currentEfficiency} </li>
            <li> 今天效率 : {this.props.info_stats.todayEfficiency} </li>
            <li> 当前质量速率 : {this.props.info_stats.currentQualityRate} </li>
            <li> 今天达标率 : {this.props.info_stats.todayQualityRate} </li>
            <li> 功能代码 : {this.props.info_stats.last_item.functionCode} </li>
          </ul>
        :""}
      </div>
    )
  }
})



// return(
//   <div className="WorkCenterInfoBox" style = {{"left": pos[0] + 'px',"top": pos[1] + 'px', "width": "200"}}>
//     {this.props.info_stats.last_item ?
//       <table>
//         <tr> <td>状态 :</td> <td> {this.props.info_stats.last_item.currentStatus} </td> </tr>
//         <tr> <td>工作中心名称 :</td> <td> {this.props.info_stats.last_item.workcenterName} </td> </tr>
//         <tr> <td>机器名称 :</td> <td> {this.props.info_stats.last_item.machineName} </td> </tr>
//         <tr> <td>工作订单数 : </td><td>  {this.props.info_stats.last_item.workorderNo} </td> </tr>
//         <tr> <td>序列数 :</td> <td> {this.props.info_stats.last_item.sequenceNo} </td> </tr>
//         <tr> <td>部分数 :</td> <td> {this.props.info_stats.last_item.partno}</td> </tr>
//         <tr> <td>部分数名称 :</td> <td> {this.props.info_stats.last_item.partnoName}</td> </tr>
//         <tr> <td>设备数 :</td> <td> {this.props.info_stats.last_item.deviceNo} </td> </tr>
//         <tr> <td>开始时间 :</td> <td> {moment(this.props.info_stats.last_item.startTime).format("MMM Do h:mm:s")} </td> </tr>
//         <tr> <td>最后的时间 :</td> <td> {moment(this.props.info_stats.last_item.recordTime).format("MMM Do h:mm:s")} </td> </tr>
//         <tr> <td>NG次数 :</td> <td> {this.props.info_stats.NGCount} </td> </tr>
//         <tr> <td>累计计数 :</td> <td> {this.props.info_stats.accumulativeCount} </td> </tr>
//         <tr> <td>平均输出 :</td> <td> {this.props.info_stats.avg_output} </td> </tr>
//         <tr> <td>标准输出 :</td> <td> {this.props.info_stats.last_item.StandardWorkTime} </td> </tr>
//         <tr> <td>电流效率 :</td> <td> {this.props.info_stats.currentEfficiency} </td> </tr>
//         <tr> <td>今天效率 :</td> <td> {this.props.info_stats.todayEfficiency} </td> </tr>
//         <tr> <td>当前质量速率 :</td> <td> {this.props.info_stats.currentQualityRate} </td> </tr>
//         <tr> <td>今天达标率 :</td> <td> {this.props.info_stats.todayQualityRate} </td> </tr>
//         <tr> <td>功能代码 :</td> <td> {this.props.info_stats.last_item.functionCode} </td> </tr>
//       </table>
//     :""}
//   </div>
// )
// }
