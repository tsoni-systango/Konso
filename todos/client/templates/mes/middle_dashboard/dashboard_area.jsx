DashboardArea = React.createClass({

  mixins: [ReactMeteorData],
  getInitialState : function(){
    return{
      height : $("#application-content").height(),
      width : $("#application-content").width(),
    }
  },
  getMeteorData : function(){
  	return{
  		work_centers : DashBoardWorkCenters.find({}).fetch()
  	}
  },
  getPositions : function(element,index){

    var position = {}
    if (element.x_coordinate) {
      position['x'] = element.x_coordinate;
    }
    else{
      position['x'] = 100*index;
    }

    if (element.y_coordinate){
      position['y'] = element.y_coordinate;
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
  			return <WorkCenter id={element._id} workcenterCode = {element.workcenterCode} workcenterName = {element.workcenterName} position = {position} />;  					
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