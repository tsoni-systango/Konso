HourlyInfo = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData : function(){
    var dataRecords = DataRecord.find({workcenterCode:{$in:this.props.workcenterCodes},recordTime:{$gte:_DayStart(), $lte:_DayEnd() }}).fetch();
    var info = {};
    var accumulativeCount = 0;
    dataRecords.forEach(function(record){
      var time = record.recordTime;
      var hour = time.getHours().toString();
      if (info[hour]) {
        info[hour] += 1;
      }
      else {
        info[hour] = 1;
      }
      accumulativeCount += 1;
    })
    return {
      dataRecords : dataRecords,
      info : info,
      accumulativeCount: accumulativeCount
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

  plotInfo : function(){
    var info = this.data.info
    var all_keys = Object.keys(info)
    var hour_details = []
    var three_info = []
    var count = 0;
    all_keys.map(function(key){
      count += 1
      var int_key = parseInt(key)
      var final_info = key +"-"+ (int_key + 1).toString() + " :- " + info[key].toString()
      if (count == 3) {
        three_info.push(<p>{final_info}</p>)
        count = 0
      }
    })
    return three_info
  },

  render : function(){
    var yaxis = this.getHourlyInfoDivPos();
    return(
      <div ref="overlay" style={{"top": yaxis + "px","left": this.props.x + "px"}} className="ShopFloorInfoBox">
        <div className="hourlyinfo_lft"> {this.props.levelName} </div>
        <a onClick={this.closePopUp} className="hourlyinfo_rgt"> X </a>
        <div className="clr_div">
          {this.plotInfo()}
          <p> Accumulative Output : {this.data.accumulativeCount} </p>
        </div>
      </div>
    )
  }
})

// <p>00:00 - 01:00:- {this.data.info['0']}; 01:00 - 02:00:- {this.data.info['1']}; 02:00 - 03:00:- {this.data.info['2']}; 03:00 - 04:00:- {this.data.info['3']};</p>
// <p></p>
// <p>04:00 - 05:00:- {this.data.info['4']}; 05:00 - 06:00:- {this.data.info['5']}; 06:00 - 07:00:- {this.data.info['6']}; 07:00 - 08:00:- {this.data.info['7']};</p>
// <p></p>
// <p>08:00 - 09:00:- {this.data.info['8']}; 09:00 - 10:00:- {this.data.info['9']}; 10:00 - 11:00:- {this.data.info['10']}; 11:00 - 12:00:- {this.data.info['11']};</p>
// <p></p>
// <p>12:00 - 13:00:- {this.data.info['12']}; 13:00 - 14:00:- {this.data.info['13']}; 14:00 - 15:00:- {this.data.info['14']}; 15:00 - 16:00:- {this.data.info['15']};</p>
// <p></p>
// <p>16:00 - 17:00:- {this.data.info['16']}; 17:00 - 18:00:- {this.data.info['17']}; 18:00 - 19:00:- {this.data.info['18']}; 19:00 - 20:00:- {this.data.info['19']};</p>
// <p></p>
// <p>20:00 - 21:00:- {this.data.info['20']}; 21:00 - 22:00:- {this.data.info['21']}; 22:00 - 23:00:- {this.data.info['22']}; 23:00 - 00:00:- {this.data.info['23']}</p>
// <p></p>
