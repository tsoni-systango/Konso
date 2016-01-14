ShopFloorRow = React.createClass({
  displayWorkcenters : function(){
    this.props.shopfloor.workcenter.map(function (element) {
      
      DashBoardWorkCenters.remove({});

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