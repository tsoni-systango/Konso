DashBoardAreaLegend = React.createClass({

  render : function(){
    return(
      <div className="top-bar-legend">
        <ul className="doughnut-chart-legend">
          <li className="ONLINE ultra-small infoSpan">线上</li>
          <li className="OFFLINE ultra-small infoSpan">离线</li>
          <li className="blink_icon FAULT ultra-small infoSpan">故障</li>
          <li className="PAUSE ultra-small infoSpan">暂停</li>
          <li className="STOP ultra-small infoSpan">停止</li>
          <li className="blink_icon WORKING ultra-small infoSpan">加工</li>
          <li className="blink_icon OTHER ultra-small infoSpan">其他</li>
          <li className="CYAN ultra-small infoSpan">没有数据</li>
        </ul>
      </div>
    )
  }
})

Template.TopLegend.helpers({
  DashBoardAreaLegend() {
    return DashBoardAreaLegend;
}});