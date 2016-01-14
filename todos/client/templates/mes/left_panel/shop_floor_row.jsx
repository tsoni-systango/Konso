ShopFloorRow = React.createClass({
  displayWorkcenters : function(){
    DashBoardWorkCenters.remove({});
    this.props.shopfloor.workcenter.map(function (element) {
      

      DashBoardWorkCenters.insert({
        "workcenterCode" : element.workcenterCode,
        "workcenterName" : element.workcenterName
      });
      
    });
  },
  render: function() {
    return (
        <div onClick={this.displayWorkcenters}>
          {this.props.shopfloor.shopfloorName}
        </div>
      );
  }
});