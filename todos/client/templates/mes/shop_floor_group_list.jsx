ShopFloorGroupList = React.createClass({

  render() {
    return (
        <ShopFloorGroupComponent 
          shopfloorGroup = {this.props.shopfloorGroup}
          key={this.props.shopfloorGroup.shopfloor._id}/>
    )
  }

});

