Meteor.methods({
  savePosition : function(workcenterCode,x_coordinate,y_coordinate){
  	console.log(IsAuthToMoveWorkCenter)
    var shopfloorgroup = ShopFloor.findOne({"shopfloor.workcenter.workcenterCode" : workcenterCode, 'shopfloor.useraccess.userId' : Meteor.user().username})
    if (!shopfloorgroup || !IsAuthToMoveWorkCenter(workcenterCode, shopfloorgroup)) {
      Errors.throw("Not authorized to move workcenter position.");
    };
    WorkcenterPositions.update({workcenterCode:workcenterCode}, { workcenterCode : workcenterCode, x_coordinate : x_coordinate, y_coordinate : y_coordinate }, { upsert: true });
  }
});