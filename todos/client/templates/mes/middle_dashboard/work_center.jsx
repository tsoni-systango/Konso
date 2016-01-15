WorkCenter = React.createClass({
  render : function(){
    return(
       <Draggable initialPos={this.props.position} data_attr={this.props.workcenterCode}/>
      )
  }
})