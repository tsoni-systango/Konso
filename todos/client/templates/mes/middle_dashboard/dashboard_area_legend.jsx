DashBoardAreaLegend = React.createClass({

  getInitialState: function () {
    return {
      flash : false
    }
  },

  toggleColor : function(){
    if (this.props.do_flash) {
      this.setState({flash: !this.state.flash})
    };
  },

  componentDidMount: function() {
    this.interval = setInterval(function () {
      this.toggleColor();
    }.bind(this), 200);
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  render : function(){
    return(
      <div>
      </div>
    )
  }
})