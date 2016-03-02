HourlyInfo = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData : function(){
    var day_start = new Date(moment().startOf('day')).toString();
    var day_end = new Date(moment().endOf('day')).toString();
    var dataRecords = DataRecord.find({workcenterCode:{$in:this.props.workcenterCodes},recordTime:{$gte:day_start, $lte:day_end }}).fetch();
    var info = {};
    console.log(this.props.workcenterCodes);
    console.log(dataRecords);
    dataRecords.forEach(function(record){
      var time = record.recordTime
      var hour = time.hour();
      console.log([hour, "<<<<<<<<<<<<<<<<<<<<<<<<,"]);
      info[hour] += record.personCount;
      info["accumulativeCount"] += record.personCount;
    })
    return {
      dataRecords : dataRecords,
      info : info
    }
  },

  getHourlyInfoDivPos : function() {
    var pos_y = this.props.y;
    var left_nav_menu = document.getElementById('app-left-menu');
    if ((pos_y + 180) > left_nav_menu.offsetHeight) {
      pos_y = pos_y - 180;
    }
    return pos_y
  },

  closePopUp : function(){
    ReactiveHourlyFieldsVisibleBoxId.set(Random.id())
  },

  componentDidMount() {
      $('body').on('click', this.onBodyClick);
  },

  componentWillUnmount() {
      $('body').off('click', this.onBodyClick);
  },

  onBodyClick(event) {
      var trigger = this.refs.trigger;
      var overlayElem = React.findDOMNode(this.refs.overlay);
      var isTargetInOverlay = $(event.target).closest(overlayElem).length > 0;
      if (!isTargetInOverlay) {
          ReactiveHourlyFieldsVisibleBoxId.set(Random.id())
      }
  },

  render : function(){
    var yaxis = this.getHourlyInfoDivPos();
    return(
      <div ref="overlay" style={{"top": yaxis + "px","left": this.props.x + "px"}} className="ShopFloorInfoBox">
        <div className="hourlyinfo_lft"> {this.props.levelName} </div>
        <a onClick={this.closePopUp} className="hourlyinfo_rgt"> X </a>
        <div className="clr_div">
          <p>00:00 - 01:00 01:00 - 02:00 02:00 - 03:00 03:00 - 04:00</p>
          <p>04:00 - 05:00 05:00 - 06:00 06:00 - 07:00 07:00 - 08:00</p>
          <p>08:00 - 09:00 09:00 - 10:00 10:00 - 11:00 11:00 - 12:00</p>
          <p>12:00 - 13:00 13:00 - 14:00 14:00 - 15:00 15:00 - 16:00</p>
          <p>16:00 - 17:00 17:00 - 18:00 18:00 - 19:00 19:00 - 20:00</p>
          <p>20:00 - 21:00 21:00 - 22:00 22:00 - 23:00 23:00 - 00:00</p>
          <p> Accumulative Output : </p>
        </div>
    </div>)
  }
})
