SummeryInfo = React.createClass({

  componentDidMount: function() {
    $('.material_tooltip').tooltip({delay: 5});
  },

  render : function(){
    class_name = "bg_style material_tooltip nav_" + (this.props.color ? this.props.color : '') + (this.props.blink ? ' blink' : '')
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
      <i className={class_name} data-position="top" data-delay="50" data-tooltip={this.props.info_type + formatted_array.join("  ")} ><span> {this.props.detail_array.length} </span></i>
    )
  }
})