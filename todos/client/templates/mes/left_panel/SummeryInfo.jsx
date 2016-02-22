SummeryInfo = React.createClass({

  componentWillMount() {
    this.id = this._reactInternalInstance._rootNodeID
  },

  render : function(){
    class_name = "bg_style nav_" + (this.props.color ? this.props.color : '') + (this.props.blink ? ' blink' : '')
    workcenter_codes = this.props.detail_array.map(function(item) { 
      return (item.workcenterCode || item)
    })
    var formatted_array = [];
    var index = 0;
    workcenter_codes.map(function(workcenter_code){
      if (index == 2) {
        formatted_array.push("<br/>")
        index = 0  
      }
      formatted_array.push(workcenter_code)
      index += 1
    })
    return(
      <div>
        <ReactTooltip id={this.id} place="bottom">
         <p>{this.props.info_type + formatted_array.join("  ")}</p>
        </ReactTooltip>
        <i data-tip data-for={this.id} className={class_name}><span> {this.props.detail_array.length} </span></i>
      </div>
    )
  }
})

