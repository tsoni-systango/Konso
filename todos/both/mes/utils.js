_allAvilableWorkCenterCodes = function () {
  var shpflr_grps = ShopFloorGroup.find().fetch();
  var work_centers_codes = [];
  shpflr_grps.map(function(shpflr_grp){
    shpflr_grp.shopfloor.map( function(shop_floor){
      shop_floor.workcenter.map(function(work_center){
        work_centers_codes.push(work_center.workcenterCode)
      })
    })
  })
  return work_centers_codes
}
