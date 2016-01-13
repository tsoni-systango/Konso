ShopFloorGroupList = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData : function(){
    Meteor.subscribe('fetchShopFloorList');
    return{
    // shopfloorList : ShopFloor.find({},{fields:{"shopfloorGroupName":1,"shopfloorGroup":1}}).fetch().map(function (element) {
    shopfloorList : ShopFloor.find({},{fields:{"shopfloorGroupName":1,"shopfloorGroup":1,"shopfloor":1}}).fetch().map(function (element) {

     return(
        <li>
          <ShopFloorGroupComponent
            shopfloorGroup={element}
            key={element.shopfloorGroup}/>
        </li>
        );
      })
    }
  },
  render() {
    return (
      <ul>
        {this.data.shopfloorList}
      </ul>
    )
  }

});

Template.shop_floor_group_list.helpers({
  ShopFloorGroupList() {
    return ShopFloorGroupList;
}});
