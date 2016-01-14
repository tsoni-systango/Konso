DashboardArea = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData : function(){
  	return{
  		work_centers : DashBoardWorkCenters.find({}).fetch()
  	}
  },

  displayWorkCenters : function(work_centers){
  	if (work_centers ){
  		return work_centers.map(function (element) {
  			return <WorkCenter id={element._id} workcenterCode = {element.workcenterCode} workcenterName = {element.workcenterName} />;  					
  		});
  	}
  },

	render : function(){
		return(
				<div>
					{this.displayWorkCenters(this.data.work_centers)}
				</div>
		      )
	}

});

Template.dashboard_area.helpers({
  DashboardArea() {
    return DashboardArea;
}});