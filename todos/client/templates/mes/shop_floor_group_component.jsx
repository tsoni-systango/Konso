ShopFloorGroupComponent = React.createClass ({
	getInitialState: function() {
		return {
			showShopFloor:false
		}
	},
	expandItem : function(){
		this.setState({showShopFloor: !this.state.showShopFloor});
	},
	render() {
		var rows = [];
		if (this.state.showShopFloor) {
      console.log("showing elelements");
			this.props.shopfloorGroup.shopfloor.forEach(function(shopFloor) {
				rows.push(<ShopFloorRow shopfloor={shopFloor}/>);
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