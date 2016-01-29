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
          <li className="no-padding">
            <ShopFloorGroup shopfloorGroup={element}  key={element.shopfloorGroup}/>
          </li>
          )
      });
    }   
    
    return(  
      <li className="no-padding">
        <a onClick={this.expandItem} className={!this.state.showShopFloorGroups ?"mdi-content-add collapsible collapsible-accordion":"mdi-content-remove collapsible collapsible-accordion"}>All </a>        
        <ul className="">
          {shop_floor_groups}
        </ul>  
       </li>       
    )
  } 
})
Template.shop_floor_groups.helpers({
  ShopFloorGroups() {
    return ShopFloorGroups;
}});
