DisplayArea = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData : function(){
  	return{
  		work_centers : DashBoardWorkCenters.find({}).fetch()
  	}
  },
  displayWorkCenters : function(work_centers){
  	if (work_centers){
  		work_centers.map(function (element) {
  			return(
  					<div>
			        <WorkCenter id={element._id} workcenterCode = {element.workcenterCode} workcenterName = {element.workcenterName} />   
  					</div>
  				);
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

Template.mes_display_area.helpers({
  DisplayArea() {
    return DisplayArea;
}});