ShopFloorGroupRow = React.createClass ({

  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      expand_shopfloors:false,
      show_shopfloor_group_summary: false
    }
  },

  getMeteorData : function(){
    var work_centers_codes = []; 
    this.props.shopfloorGroup.shopfloor.map( function(shop_floor){ 
      shop_floor.workcenter.map(function(work_center){
        work_centers_codes.push(work_center.workcenterCode)
      })
    })
    Meteor.subscribe("fetchDataRecords", work_centers_codes);
    Meteor.subscribe("fetchPosition", work_centers_codes);
    var no_of_faulty  = 0;
    var no_of_stopped = 0;
    var no_of_offline = 0;
    var no_of_paused  = 0;
    var no_of_no_data_found = 0;
    work_centers_codes.map(function(work_center_code){
      var last_item = DataRecord.findOne({workcenterCode:work_center_code,$or:[{functionCode:"C001"},{functionCode:/S.*/}]},{sort: {recordTime:-1}, limit: 1});
      if (last_item) {
        switch(last_item.currentStatus) {
        case "FAULT":
          no_of_faulty += 1
          break;
        case "STOP":
          no_of_stopped += 1
          break;
        case "OFFLINE":
          no_of_offline += 1
          break;
        case "PAUSE":
          no_of_paused += 1
          break;
        }
      }
      else{
        no_of_no_data_found += 1
      }
    })

    return{
      no_of_faulty: no_of_faulty,
      no_of_stopped: no_of_stopped,
      no_of_offline: no_of_offline,
      no_of_paused: no_of_paused,
      no_of_no_data_found: no_of_no_data_found
      // work_centers :dbWorkCenters,
      // is_auth_for_moving : (is_auth_for_moving ? true : false)
    }
  },
  
  expand_shopfloors : function(){
    this.setState({expand_shopfloors: !this.state.expand_shopfloors});
  },

  mouseOver : function function_name() {
    console.log("mouseOver")
  },

  render : function(){
    var shop_floor_rows = [];
    if (this.state.expand_shopfloors) {
      this.props.shopfloorGroup.shopfloor.forEach(function(shopFloor) {
        shop_floor_rows.push(<ShopFloorRow key={shopFloor.shopfloorCode} shopfloor={shopFloor} />);
      });
    }
    return (
      <div>
        <a onClick={this.expand_shopfloors} onMouseOver={this.mouseOver} className={!this.state.expand_shopfloors ?"mdi-content-add collapsible collapsible-accordion":"mdi-content-remove collapsible collapsible-accordion"}> 
          {this.props.shopfloorGroup.shopfloorGroupName}<br/>
          {this.data.no_of_faulty ? <SummeryInfo color='RED' blink="true" detail={this.data.no_of_faulty}/> : ''}
          {this.data.no_of_stopped ? <SummeryInfo color='GRAY' detail={this.data.no_of_stopped}/> : ''}
          {this.data.no_of_offline ? <SummeryInfo color='RED' detail={this.data.no_of_offline}/> : ''}
          {this.data.no_of_paused ? <SummeryInfo color='BLUE' detail={this.data.no_of_paused}/> : ''}
          {this.data.no_of_no_data_found ? <SummeryInfo color='CYAN' detail={this.data.no_of_no_data_found}/> : ''}
        </a>
        <ul>        
          {shop_floor_rows} 
        </ul>
      </div>
    );
  }
});

SummeryInfo = React.createClass({
  render : function(){
    class_name = "bg_style nav_" + (this.props.color ? this.props.color : '') + (this.props.blink ? ' blink' : '')
    return(
      <i className={class_name}><span> {this.props.detail} </span></i>
    )
  }
})