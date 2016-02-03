DashBoardAreaLegend = React.createClass({

  getInitialState: function () {
    return {
      flash : false
    }
  },

  toggleColor : function(){
    this.setState({flash: !this.state.flash})
  },

  componentDidMount: function() {
    this.interval = setInterval(function () {
      this.toggleColor();
    }.bind(this), 200);
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  render : function(){
    return(
      <div className="top-bar-legend">
        <ul className="doughnut-chart-legend">
          <li className="ONLINE ultra-small"><span className="legend-color"></span>ONLINE</li>
          <li className="OFFLINE ultra-small"><span className="legend-color"></span> OFFLINE</li>
          <li className={this.state.flash ? "FLASH ultra-small":"FAULT ultra-small"}><span className="legend-color"></span> FAULT</li>
          <li className="PAUSE ultra-small"><span className="legend-color"></span> PAUSE</li>
          <li className="STOP ultra-small"><span className="legend-color"></span> STOP</li>
          <li className={this.state.flash ? "FLASH ultra-small":"WORKING ultra-small"}><span className="legend-color"></span> WORKING</li>
          <li className={this.state.flash ? "FLASH ultra-small":"OTHER ultra-small"}><span className="legend-color"></span> OTHER</li>
          <li className="CYAN ultra-small"><span className="legend-color"></span> NO DATA</li>
        </ul>
      </div>
    )
  }
})

Template.dashboard_area.helpers({
  DashBoardAreaLegend() {
    return DashBoardAreaLegend;
}});