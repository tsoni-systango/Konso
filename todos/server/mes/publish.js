Meteor.publish("fetchShopFloorGroup",function () {
  return ShopFloorGroup.find();
});

Meteor.publish("fetchPosition",function (dbWorkCentersCodes) {
  return WorkcenterPositions.find({workcenterCode: {$in:dbWorkCentersCodes}});
});

Meteor.publish('fetchDataRecords', function(workcenterCodes) {
  return DataRecord.find({});
});