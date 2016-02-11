// ShopfloorGroupSummary = React.createClass({

//   mixins: [ReactMeteorData],

//   getInitialState: function() {
//     return {
//       description : '',
//       tooltipX: "50px",
//       tooltipY: "0px"
//     }
//   },

//   setTooltipDescription(item) {
//     this.setState({
//       description: item.description
//     })
//   },

//   getMeteorData : function(){
//     return{
//     	// a: this.props.info
//     }
//   },

//   render : function () {
//     tooltipStyle = { top: this.props.tooltipY,  left: this.props.tooltipX }
//     if (this.props.showTooltip) {
//       tooltipStyle.opacity = "1";
//       tooltipStyle.visibility = "visible";
//     } else {
//       tooltipStyle.opacity = "0";
//       tooltipStyle.visibility = "hidden";
//     }
//   	return(
// 	  	<div style = {tooltipStyle}>
// 	  		LLLLLLLLLLLLLLLLLLLLLLLLLLLl
// 	  	</div>
//   	)
//   }
// });