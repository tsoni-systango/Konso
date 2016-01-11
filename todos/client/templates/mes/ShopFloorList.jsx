var ShopFloorList = React.createClass({
  render() {
    return (
      <div>
        <ul>
        <li> Shop Floor 0 </li>
        <li> Shop Floor 1 </li>
        <li> Shop Floor 2 </li>
        <li> Shop Floor 3 </li>
        <li> Shop Floor 4 </li>
        </ul>
      </div>
    )
  },

});
Template.shopFloorMenu.helpers({
  ShopFloorList() {
    return ShopFloorList;
  }});
