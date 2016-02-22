ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

Draggable = React.createClass({
  getInitialState: function () {
    return {
      posX: this.props.initialPos['x'],
      posY: this.props.initialPos['y'],
      dragging: false,
      rel: null, // position relative to the cursor
      grab: false
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
      },
      grab:true
    })
    element.stopPropagation()
    element.preventDefault()
  },
  onMouseUp: function (element) {
    this.setState({dragging: false, grab:false})
    element.stopPropagation()
    element.preventDefault()
    this.changeHandler();
  },
  onMouseMove: function (element) {
    if (!this.state.dragging) return
    if (!this.props.is_auth_for_moving) return
    var pos = $(this.getDOMNode()).parent().offset()
    if (element.pageX >= (pos.left + 50)) {
      this.setState({ posX:element.pageX - pos.left - 50 })
    }
    if (element.pageY >= (pos.top + 75)) {
      this.setState({ posY: element.pageY - pos.top - 50 })
    };
    element.stopPropagation()
    element.preventDefault()
  },

  changeHandler: function(){
    this.props.onChange(this.state.posX,this.state.posY)
  },

  componentWillMount() {
    this.id = this._reactInternalInstance._rootNodeID
  },

  infoStats: function(){
    return(
      this.props.info_stats.last_item ? 
          <ul>
            <li> Status : {this.props.info_stats.last_item.currentStatus} </li>
            <li> WorkCenterName : {this.props.info_stats.last_item.workcenterName} </li>
            <li> MachineName : {this.props.info_stats.last_item.machineName} </li>
            <li> WorkOrderNo : {this.props.info_stats.last_item.workorderNo} </li>
            <li> SequenceNo : {this.props.info_stats.last_item.sequenceNo} </li>
            <li> PartNo : {this.props.info_stats.last_item.partno}</li>
            <li> PartNoName : {this.props.info_stats.last_item.partnoName}</li>
            <li> DeviceNo : {this.props.info_stats.last_item.deviceNo} </li>
            <li> StartTime : {moment(this.props.info_stats.last_item.startTime).format("MMM Do h:mm:s")} </li>
            <li> LastTime : {moment(this.props.info_stats.last_item.recordTime).format("MMM Do h:mm:s")} </li>
            <li> NGCount : {this.props.info_stats.NGCount} </li>
            <li> AccumulativeCount : {this.props.info_stats.accumulativeCount} </li>
            <li> Avg. Output : {this.props.info_stats.avg_output} </li>
            <li> StandardOutput : {this.props.info_stats.last_item.StandardWorkTime} </li>
            <li> CurrentEfficiency : {this.props.info_stats.currentEfficiency} </li>
            <li> TodayEfficiency : {this.props.info_stats.todayEfficiency} </li>
            <li> CurrentQualityRate : {this.props.info_stats.currentQualityRate} </li>
            <li> TodayQualityRate : {this.props.info_stats.todayQualityRate} </li>
            <li> FunctionCode : {this.props.info_stats.last_item.functionCode} </li>
          </ul>   
        : "lLLLLLLLLLLLLLLLLLLLLLLLLl"
      
    )
  },

  render: function () {
    var details = this.infoStats()
    return (
      <div>
        <ReactTooltip id={this.id} effect="float">
          {details}
        </ReactTooltip>
        <div data-tip data-for={this.id} className={this.props.do_flash ? "blink draggable" : "draggable"} style = {{"cursor":(this.state.grab ? 'move' : ''), "backgroundColor":this.props.colour, "left": this.state.posX + 'px',"top": this.state.posY + 'px'}} onMouseDown = {this.onMouseDown} >{this.props.data_attr}</div>
      </div>
    )
  }
});
