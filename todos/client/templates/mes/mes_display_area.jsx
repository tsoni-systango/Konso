DisplayArea = React.createClass({

render(){
	return(
			<h1>
				Display ShopfloorArea
			</h1>	
	      )
}

});

Template.mes_display_area.helpers({
  DisplayArea() {
    return DisplayArea;
}});