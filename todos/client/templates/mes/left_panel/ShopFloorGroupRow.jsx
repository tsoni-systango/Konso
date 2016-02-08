ShopFloorGroupRow = React.createClass ({
  getInitialState: function() {
    return {
      expand_shopfloors:false
    }
  },
  
  expand_shopfloors : function(){
    this.setState({expand_shopfloors: !this.state.expand_shopfloors});
  },

  render : function(){
    var shop_floor_rows = [];
    if (this.state.expand_shopfloors) {
      this.props.shopfloorGroup.shopfloor.forEach(function(shopFloor) {
        shop_floor_rows.push(<ShopFloorRow key={shopFloor.shopfloorCode} shopfloor={shopFloor} />);
      });
    }
    return (
      <div>
        <a onClick={this.expand_shopfloors} className={!this.state.expand_shopfloors ?"mdi-content-add collapsible collapsible-accordion":"mdi-content-remove collapsible collapsible-accordion"}> 
          {this.props.shopfloorGroup.shopfloorGroupName}
          <i className="circle "><span className="circle"> 3 </span></i>
          <i className="circle "><span className="circle"> 3 </span></i>
          <i className="circle "><span className="circle"> 3 </span></i>
          <i className="circle "><span className="circle"> 3 </span></i>
          <i className="circle "><span className="circle"> 3 </span></i>
        </a>      
        <ul>        
          {shop_floor_rows} 
        </ul>
      </div>
    );
  }
});