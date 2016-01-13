Meteor.publish("fetchShopFloorList",function () {
		var list =  ShopFloor.find();
		console.log(list);
		return list
});