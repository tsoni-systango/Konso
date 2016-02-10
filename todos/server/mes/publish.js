Meteor.publish("fetchShopFloorGroup",function () {
  return ShopFloorGroup.find();
});

Meteor.publish("fetchPosition",function (dbWorkCentersCodes) {
	console.log(dbWorkCentersCodes)
  return WorkcenterPositions.find({workcenterCode: {$in:dbWorkCentersCodes}});
});

Meteor.publish('fetchDataRecords', function(workcenterCodes) {
  return DataRecord.find({workcenterCode: {$in:workcenterCodes}});
});