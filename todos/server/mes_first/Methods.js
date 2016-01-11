Meteor.methods({
	getShopFloorList : function(){
		return ShopFloor.find({},{fields:{"shopfloorGroupName":1,"_id":0}}).fetch();
	}
})
