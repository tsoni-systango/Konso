ShopFloorGroup = React.createClass ({
  getInitialState: function() {
    return {
      showShopFloor:false
    }
  },
  expandItem : function(){
    this.setState({showShopFloor: !this.state.showShopFloor});
  },
  render : function(){
    var rows = [];
    if (this.state.showShopFloor) {
      this.props.shopfloorGroup.shopfloor.forEach(function(shopFloor) {
        rows.push(<ShopFloorRow key={shopFloor.shopfloorCode} shopfloor={shopFloor} />);
      });
    }

    return (
      <div>
        <h6 >{this.props.shopfloorGroup.shopfloorGroupName}</h6>
        <button onClick={this.expandItem}> {!this.state.showShopFloor ?"+":"-"} </button>
        <div>
          {rows}
        </div>
      </div>
    );
  }
});