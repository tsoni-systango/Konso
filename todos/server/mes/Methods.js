Meteor.methods({
  savePosition : function(workcenterCode,x_coordinate,y_coordinate){
    WorkcenterPositions.update({workcenterCode:workcenterCode},
        {
          workcenterCode : workcenterCode,
          x_coordinate : x_coordinate,
          y_coordinate : y_coordinate
        },      
        {
          upsert: true
        }
      );
  }
});