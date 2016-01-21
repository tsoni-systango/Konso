Draggable = React.createClass({
  getInitialState: function () {
    return {
      pos: this.props.initialPos,
      dragging: false,
      rel: null, // position relative to the cursor
      // colour : "#00000",
      // do_flash : false
    }
  },
  
  componentDidUpdate: function (props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    }
  },

  onMouseDown: function (element) {
    if (element.button !== 0) return
    var pos = $(this.getDOMNode()).offset()

    this.setState({
      dragging: true,
      rel: {
        x: pos.left,
        y: pos.top
      }
    })
    element.stopPropagation()
    element.preventDefault()
  },
  onMouseUp: function (element) {
    this.setState({dragging: false})
    element.stopPropagation()
    element.preventDefault()
    this.changeHandler();
  },
  onMouseMove: function (element) {
    if (!this.state.dragging) return
    var pos = $(this.getDOMNode()).parent().offset()
    this.setState({
      pos: {
        x: element.pageX - pos.left - 50,
        y: element.pageY - pos.top - 50
      }
    })
    element.stopPropagation()
    element.preventDefault()
  },
  changeHandler: function(){
    this.props.onChange(this.state.pos.x,this.state.pos.y)
  },

  mouseOver : function(){
    this.props.over(this.state.pos.x,this.state.pos.y)
  },
  render: function () {
    
    return (
      <div style = {{"backgroundColor":this.props.colour,"border":"1px","width":"100px","height" : "100px","borderStyle": "solid","borderColor": "#000000","position": 'absolute', "left": this.state.pos.x + 'px',"top": this.state.pos.y + 'px'}} onMouseDown = {this.onMouseDown} onMouseOver={this.mouseOver} onMouseOut={this.props.out}>
        {this.props.data_attr}
      </div>
    )
  }
});
