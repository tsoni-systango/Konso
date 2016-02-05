DashBoardAreaLegend = React.createClass({

  render : function(){
    return(
      <div className="top-bar-legend">
        <ul className="doughnut-chart-legend">
          <li className="ONLINE ultra-small infoSpan">ONLINE</li>
          <li className="OFFLINE ultra-small infoSpan">OFFLINE</li>
          <li className="blink_icon FAULT ultra-small infoSpan">FAULT</li>
          <li className="PAUSE ultra-small infoSpan">PAUSE</li>
          <li className="STOP ultra-small infoSpan">STOP</li>
          <li className="blink_icon WORKING ultra-small infoSpan">WORKING</li>
          <li className="blink_icon OTHER ultra-small infoSpan">OTHER</li>
          <li className="CYAN ultra-small infoSpan">NO DATA</li>
        </ul>
      </div>
    )
  }
})

Template.TopLegend.helpers({
  DashBoardAreaLegend() {
    return DashBoardAreaLegend;
}});