DashboardArea = React.createClass({

  mixins: [ReactMeteorData],
  getInitialState : function(){
    return{
      height : $("#application-content").height(),
      width : $("#application-content").width(),
    }
  },
  getMeteorData : function(){
    dbWorkCenters = DashBoardWorkCenters.find({}).fetch()
    dbWorkCentersCodes = dbWorkCenters.map(function(dr) {return dr['workcenterCode']})
    Meteor.subscribe("fetchPosition");
    Meteor.subscribe("fetchDataRecords", dbWorkCentersCodes);
    if (Meteor.user() && dbWorkCentersCodes[0]) {
      var is_auth_for_moving = ShopFloor.findOne({"shopfloor.workcenter.workcenterCode" : dbWorkCentersCodes[0], 'shopfloor.useraccess.userId' : Meteor.user().username});
    };
  	return{
  		work_centers :dbWorkCenters,
      is_auth_for_moving : (is_auth_for_moving ? true : false)
  	}
  },
  getPositions : function(element,index){
    var position = {}
    var position_data = WorkcenterPositions.findOne({"workcenterCode":element.workcenterCode})
    var element_position = position_data ? position_data : {};
    if (element_position.x_coordinate) {
      position['x'] = element_position.x_coordinate*this.state.width ;
    }
    else{
      position['x'] = 100*index;
    }

    if (element_position.y_coordinate){
      position['y'] = element_position.y_coordinate*this.state.height;
    }
    else{
      position['y'] = 0;
    }
    return position
  },
  displayWorkCenters : function(work_centers){
  	if (work_centers ){
  		return work_centers.map(function (element,index) {
        var position = this.getPositions(element,index)
  			return <WorkCenter id={element._id} workcenterCode = {element.workcenterCode} workcenterName = {element.workcenterName} position = {position} key={element.workcenterCode} page_height = {this.state.height} page_width = {this.state.width} is_auth_for_moving={this.data.is_auth_for_moving}/>;  					
  		}.bind(this));
  	}
  },
	render : function(){
    return(
      <div ref="dashboard_area">
				{this.displayWorkCenters(this.data.work_centers)}
			</div>
		)
	}

});

Template.dashboard_area.helpers({
  DashboardArea() {
    return DashboardArea;
}});