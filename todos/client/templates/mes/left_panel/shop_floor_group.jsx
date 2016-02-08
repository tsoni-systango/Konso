ShopFloorGroupRow = React.createClass ({
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
        <a onClick={this.expandItem} className={!this.state.showShopFloor ?"mdi-content-add collapsible collapsible-accordion":"mdi-content-remove collapsible collapsible-accordion"}> 
          {this.props.shopfloorGroup.shopfloorGroupName}
          <i className="circle "><span className="circle"> 3 </span></i>
          <i className="circle "><span className="circle"> 3 </span></i>
          <i className="circle "><span className="circle"> 3 </span></i>
          <i className="circle "><span className="circle"> 3 </span></i>
          <i className="circle "><span className="circle"> 3 </span></i>
        </a>      
        <ul>        
          {rows}       
        </ul>
      </div>
    );
  }
});