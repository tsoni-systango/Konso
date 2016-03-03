HourlyInfo = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData : function(){
    var day_start = new Date(moment().startOf('day'));
    var day_end = new Date(moment().endOf('day'));
    var dataRecords = DataRecord.find({workcenterCode:{$in:this.props.workcenterCodes},recordTime:{$gte:day_start, $lte:day_end }}).fetch();
    var info = {};
    for (count = 0; count < 24; count++) {
    info[count.toString()]=0;
    }
    info["accumulativeCount"] = 0;
    dataRecords.forEach(function(record){
      var time = record.recordTime;
      var hour = time.getHours();
      info[hour.toString()] += 1;
      info["accumulativeCount"] += 1;
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
      var overlayElem = ReactDOM.findDOMNode(this.refs.overlay);
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
          <p>00:00 - 01:00:- {this.data.info['0']}; 01:00 - 02:00:- {this.data.info['1']}; 02:00 - 03:00:- {this.data.info['2']}; 03:00 - 04:00:- {this.data.info['3']};</p>
          <p></p>
          <p>04:00 - 05:00:- {this.data.info['4']}; 05:00 - 06:00:- {this.data.info['5']}; 06:00 - 07:00:- {this.data.info['6']}; 07:00 - 08:00:- {this.data.info['7']};</p>
          <p></p>
          <p>08:00 - 09:00:- {this.data.info['8']}; 09:00 - 10:00:- {this.data.info['9']}; 10:00 - 11:00:- {this.data.info['10']}; 11:00 - 12:00:- {this.data.info['11']};</p>
          <p></p>
          <p>12:00 - 13:00:- {this.data.info['12']}; 13:00 - 14:00:- {this.data.info['13']}; 14:00 - 15:00:- {this.data.info['14']}; 15:00 - 16:00:- {this.data.info['15']};</p>
          <p></p>
          <p>16:00 - 17:00:- {this.data.info['16']}; 17:00 - 18:00:- {this.data.info['17']}; 18:00 - 19:00:- {this.data.info['18']}; 19:00 - 20:00:- {this.data.info['19']};</p>
          <p></p>
          <p>20:00 - 21:00:- {this.data.info['20']}; 21:00 - 22:00:- {this.data.info['21']}; 22:00 - 23:00:- {this.data.info['22']}; 23:00 - 00:00:- {this.data.info['23']}</p>
          <p></p>
          <p> Accumulative Output : {this.data.info['accumulativeCount']} </p>
        </div>
    </div>)
  }
})
