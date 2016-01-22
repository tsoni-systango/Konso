ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

Draggable = React.createClass({
  getInitialState: function () {
    return {
      pos: this.props.initialPos,
      dragging: false,
      rel: null, // position relative to the cursor
      flash : false
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
  // componentDidUpdate : function(){
  //   if (this.props.do_flash){
  //     setInterval(function(){ this.setState({flash : !this.state.flash});}.bind(this),1000);
  //   }
  // },
  // showFlash : function(){
  //   if(!this.state.flash && this.props.do_flash){
  //     return true
  //   }
  //   return false
  // },

  toggleColor : function(){
    if (this.props.do_flash) {
      this.setState({flash: !this.state.flash})
    };
  },


  componentDidMount: function(){
    window.setInterval(function () {
      this.toggleColor();
    }.bind(this), 200);
  },

  render: function () {
    return (
      <ReactCSSTransitionGroup transitionAppear={true} transitionAppearTimeout={1000}>
        <div style = {{"backgroundColor":(this.state.flash ? "WHITE" : this.props.colour),"border":"1px","width":"100px","height" : "100px","borderStyle": "solid","borderColor": "#000000","position": 'absolute', "left": this.state.pos.x + 'px',"top": this.state.pos.y + 'px'}} onMouseDown = {this.onMouseDown} onMouseOver={this.mouseOver} onMouseOut={this.props.out}>{this.props.data_attr}</div>
      </ReactCSSTransitionGroup>
    )
  }
});
