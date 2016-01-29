ShopFloorGroups = React.createClass({

  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      showShopFloorGroups:false
    }
  },
  getMeteorData : function(){
      Meteor.subscribe('fetchShopFloorList');
      return{
      shopfloorList : ShopFloor.find({},{fields:{"shopfloorGroupName":1,"shopfloorGroup":1,"shopfloor":1}}).fetch()
    }
  },
  expandItem : function(){
    this.setState({ showShopFloorGroups : !this.state.showShopFloorGroups });
  },
  render : function(){
    var shop_floor_groups = [];  
    if (this.state.showShopFloorGroups) {
      this.data.shopfloorList.map(function (element) {
        shop_floor_groups.push(
          <li>
            <ShopFloorGroup shopfloorGroup={element}  key={element.shopfloorGroup}/>
          </li>
          )
      });
    }   
    
    return(  
      <div >
        All        
        <button onClick={this.expandItem} className=""><i className={!this.state.showShopFloorGroups ?"mdi-content-add ":"mdi-content-archive"}> </i></button>
        <ul className="last-message">
          {shop_floor_groups}
        </ul>  
      </div>
    )
  } 
})

Template.shop_floor_groups.helpers({
  ShopFloorGroups() {
    return ShopFloorGroups;
}});
