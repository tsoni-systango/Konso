WorkCenter = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData : function(){
    return{
      work_center_data_records : DataRecord.find({workcenterCode: this.props.workcenterCode}).fetch()
    }
  },

  savePosition : function(x_coordinate,y_coordinate){
    x_coordinate = x_coordinate/this.props.page_width;
    y_coordinate = y_coordinate/this.props.page_height;
    Meteor.call("savePosition",this.props.workcenterCode,x_coordinate,y_coordinate)
  },
  render : function(){
    return(
       <Draggable ref="draggable" initialPos={this.props.position} data_attr={this.props.workcenterCode} onChange={this.savePosition}/>
      )
  }
})