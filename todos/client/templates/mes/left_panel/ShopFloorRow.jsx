ShopFloorRow = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData : function(){
    var work_centers_codes = []; 
    this.props.shopfloor.workcenter.map(function(work_center){
      work_centers_codes.push(work_center.workcenterCode)
    })
    var faulty  = [];
    var stopped = [];
    var offline = [];
    var paused  = [];
    var no_data_found = [];
    work_centers_codes.map(function(work_center_code){
      var last_item = DataRecord.findOne({workcenterCode:work_center_code,$or:[{functionCode:"C001"},{functionCode:/S.*/}]},{sort: {recordTime:-1}});
      if (last_item) {
        switch(last_item.currentStatus) {
        case "FAULT":
          faulty.push(last_item)
          break;
        case "STOP":
          stopped.push(last_item)
          break;
        case "OFFLINE":
          offline.push(last_item)
          break;
        case "PAUSE":
          paused.push(last_item)
          break;
        }
      }
      else{
        no_data_found.push(work_center_code)
      }
    })

    return{
      faulty: faulty,
      stopped: stopped,
      offline: offline,
      paused: paused,
      no_data_found: no_data_found
      // work_centers :dbWorkCenters,
      // is_auth_for_moving : (is_auth_for_moving ? true : false)
    }
  },

  displayWorkcenters : function(){

    DashBoardWorkCenters.remove({});

    this.props.shopfloor.workcenter.map(function (element) {
      DashBoardWorkCenters.insert({ "workcenterCode" : element.workcenterCode, "workcenterName" : element.workcenterName });
    });
  },
  
  render: function() {
    return (
      <div>
        <li>
          <a onClick={this.displayWorkcenters}> {this.props.shopfloor.shopfloorName} </a>           
        </li>
          {this.data.faulty.length > 0 ? <SummeryInfo color='RED' blink="true" detail_array={this.data.faulty} info_type="Faulty: "/> : ''}
          {this.data.stopped.length > 0 ? <SummeryInfo color='GRAY' detail_array={this.data.stopped} info_type="Stopped: "/> : ''}
          {this.data.offline.length > 0 ? <SummeryInfo color='RED' detail_array={this.data.offline} info_type="Offline: "/> : ''}
          {this.data.paused.length > 0 ? <SummeryInfo color='BLUE' detail_array={this.data.paused} info_type="Paused: "/> : ''}
          {this.data.no_data_found.length > 0 ? <SummeryInfo color='CYAN' detail_array={this.data.no_data_found} info_type="No Data: "/> : ''}
      </div>
    );
  }
});