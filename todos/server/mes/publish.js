Meteor.publish("fetchShopFloorGroup",function () {
  return ShopFloorGroup.find();
});

Meteor.publish("fetchPosition",function () {
  return WorkcenterPositions.find({workcenterCode: {$in:_allAvilableWorkCenterCodes()}});
});

Meteor.publish('fetchDataRecords', function() {
  var data_record_cursores = [];
  var work_centers_codes = _allAvilableWorkCenterCodes();
  // work_centers_codes.map(function(wcc){
  //   data_record_cursores.push(DataRecord.find({workcenterCode: wcc , $or:[{functionCode:"C001"}, {functionCode:/S.*/}]}, {sort: {recordTime: -1}, limit: 1}))
  // })
  // var data_record_cursores = DataRecord.find({workcenterCode: {$in:work_centers_codes}, recordTime:{ $gte: _DayStart()}})
  var data_record_cursores = DataRecord.find({workcenterCode: {$in:work_centers_codes}})
  return data_record_cursores
});
