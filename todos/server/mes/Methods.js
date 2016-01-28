Meteor.methods({
  savePosition : function(workcenterCode,x_coordinate,y_coordinate){
    var is_auth_for_moving = ShopFloor.findOne({"shopfloor.workcenter.workcenterCode" : workcenterCode, 'shopfloor.useraccess.userId' : Meteor.user().username})
    if (!is_auth_for_moving) {
      Errors.throw("Not authorized to move workcenter position.");
    };
    WorkcenterPositions.update({workcenterCode:workcenterCode}, { workcenterCode : workcenterCode, x_coordinate : x_coordinate, y_coordinate : y_coordinate }, { upsert: true });
  }
});