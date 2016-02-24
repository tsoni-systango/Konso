ShopFloorHourlyInfo = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData : function(){
    var day_start = new Date(moment().startOf('day')).toString();
    var day_end = new Date(moment().endOf('day')).toString();
    var dataRecords = DataRecord.find({workcenterCode:{$in:this.props.workcenterCodes}/*,recordTime:{$gte:day_start, $lte:day_end }*/}).fetch();
    var info = {};
    dataRecords.forEach(function(record){
      var time = moment(record.recordTime);
      var hour = time.hour();
      if (hour >= 0 && hour < 1){
        info["zero"] += record.personCount;
      }
    })
    return {
      dataRecords : dataRecords
    }
  },

  closePopUp : function(){
    this.props.close()
  },
  render : function(){
    console.log(this.data.dataRecords)
    return(
      <div style={{"top": this.props.y + "px","left": (this.props.x + 100) + "px"}} className="ShopFloorInfoBox">
        <div> {this.props.info.shopfloorName} </div>
        <div onClick={this.closePopUp}> X </div>
        <div>
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