LeftNavigation = React.createClass({

  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      expand_left_navigation: false
    }
  },

  getMeteorData : function(){
    return{
      ShopFloorGroups : ShopFloorGroup.find({},{fields:{"shopfloorGroupName":1,"shopfloorGroup":1,"shopfloor":1}}).fetch()
    }
  },

  expand_navigation : function(){
    this.setState({ expand_left_navigation : !this.state.expand_left_navigation });
  },

  render : function(){
    var shop_floor_groups_rows = [];  
    if (this.state.expand_left_navigation) {
      this.data.ShopFloorGroups.map(function (shop_floor_group) {
        shop_floor_groups_rows.push(
          <li className="no-padding">
            <ShopFloorGroupRow shopfloorGroup={shop_floor_group}  key={shop_floor_group.shopfloorGroup}/>
          </li>
        )
      });
    }

    return(  
      <li className="no-padding">
        <a onClick={this.expand_navigation} className={!this.state.expand_left_navigation ?"mdi-content-add collapsible collapsible-accordion":"mdi-content-remove collapsible collapsible-accordion"}>All </a>        
        <ul className="side_nav_pos">
          {shop_floor_groups_rows}
        </ul> 
      </li>
    )
  }
})

Template.left_navigation.helpers({
  LeftNavigation() {
    return LeftNavigation;
  }
});
