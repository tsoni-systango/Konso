VisualCharts = React.createClass({

  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      show: true
    }
  },

  getMeteorData : function(){
    return{

    }
  },

  componentDidMount : function(){
        
  },

  render: function() {
    return (
      <li>
        <a ref="get1">  </a>
      </li>
    );
  }

}),
Template.visual_charts.helpers({
  VisualCharts() {
    return VisualCharts;
  }
});
