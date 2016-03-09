IsAuthToAccessWorkCenter = function(workCenterCode, shopFloorGroup) {
	var is_auth = null;
	shopFloorGroup.shopfloor.map(function(shopfloor) {
		shopfloor.workcenter.map(function(workcenter) {
			if (workcenter.workcenterCode == workCenterCode) {
				shopfloor.useraccess.map(function(user){
					if (Meteor.user().username == user.userId) {
						is_auth = true;
					};
				})
			};
		})
	})
	return is_auth
}

IsAuthToViewShopFloor = function(shop_floor) {
	var is_auth = null;
	shop_floor.useraccess.map(function(user){
		if (Meteor.user().username == user.userId) {
			is_auth = true;
		};
	})
	return is_auth
}

HasAccessToSomeShopfloors = function(shopFloorGroup) {
	var is_auth = null;
	shopFloorGroup.shopfloor.map(function(shopfloor) {
		shopfloor.useraccess.map(function(user){
			if (Meteor.user().username == user.userId) {
				is_auth = true;
			};
		})
	})
	return is_auth
}
