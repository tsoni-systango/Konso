AccumulativeCountSummary = React.createClass({

  getInfoDivPos : function() {
    var pos_x = this.props.pos_x;
    var pos_y = this.props.pos_y;
    var dashboard_div = document.getElementById('application-content');

    if ((this.props.pos_x + 100) < (dashboard_div.offsetWidth - 180)) {
      pos_x = this.props.pos_x + 100 
    }
    else{
      pos_x = this.props.pos_x - 180
    }

    if ((this.props.pos_y + 390) > dashboard_div.offsetHeight) {
      pos_y = dashboard_div.offsetHeight - 390
    }

    return [pos_x, pos_y]
  },

  render : function(){
    var pos = this.getInfoDivPos();
    return(
      <div className="WorkCenterInfoBox" style = {{"left": pos[0] + 'px',"top": pos[1] + 'px'}}>
        {this.props.info_stats.last_item ? 
          <ul>

          </ul>   
        :""}
      </div>
    )
  }
	
})