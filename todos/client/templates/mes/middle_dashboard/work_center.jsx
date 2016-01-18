WorkCenter = React.createClass({
  savePosition : function(x_coordinate,y_coordinate){
    Meteor.call("savePosition",this.props.workcenterCode,x_coordinate,y_coordinate)
  },
  render : function(){
    return(
       <Draggable ref="draggable" initialPos={this.props.position} data_attr={this.props.workcenterCode} onChange={this.savePosition}/>
      )
  }
})