DashboardArea = React.createClass({

  mixins: [ReactMeteorData],
  getInitialState : function(){
    this.Scroll = true;
    this.ScrollToRight = true;
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
      var shopfloorgroup = ShopFloor.findOne({"shopfloor.workcenter.workcenterCode" : dbWorkCentersCodes[0], 'shopfloor.useraccess.userId' : Meteor.user().username});
      if (shopfloorgroup) {
        var is_auth_for_moving = IsAuthToMoveWorkCenter(dbWorkCentersCodes[0], shopfloorgroup)
      };
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

  autoScroll : function(){
    var element_to_scroll = document.getElementById('application-content');
    if ((element_to_scroll.scrollWidth - element_to_scroll.offsetWidth) <= 0) {
      return
    };
    if (element_to_scroll.scrollLeft === 0) {
      this.ScrollToRight = true;
    }
    else if (element_to_scroll.scrollLeft === (element_to_scroll.scrollWidth - element_to_scroll.offsetWidth)) {
      this.ScrollToRight = false;
    };
    if(this.ScrollToRight && this.Scroll){
      element_to_scroll.scrollLeft=element_to_scroll.scrollLeft+1
    }
    else if (this.Scroll)
    {
      element_to_scroll.scrollLeft=element_to_scroll.scrollLeft-1
    }
  },

  componentDidMount: function() {
    this.interval = setInterval(function () {
      this.autoScroll();
    }.bind(this), 20);
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  mouseOver: function(){
    this.Scroll = false;
  },

  mouseOut: function() {
    this.Scroll = true;
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
      <div ref="dashboard_area" onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
				{this.displayWorkCenters(this.data.work_centers)}
			</div>
		)
	}

});

Template.dashboard_area.helpers({
  DashboardArea() {
    return DashboardArea;
}});