// var WorkCenter = React.require("./workCenter.jsx")
var MesFirst = React.createClass({
  getInitialState: function () {

    return {
      workCenters: [{"key": 0}],
      total:1
    }
  },
  addWorkCentre: function() {
    var newEle = {"key" : this.state.total++}
    var items = this.state.workCenters;
    items.push(newEle)

    this.setState({workCenters: items});
  },
  addWorkCenterElement: function() {
    return (<WorkCenter />)
  },
  render: function() {

  function doSomething (workCenters) {
    return workCenters.map(function(item) {
      return (
        <WorkCenter key = {item.key} />
      )
    })
  }
Meteor.call('getShopFloorList', 1, GlobalUI.generalCallback(function(result) {
  console.log(JSON.stringify(result));
}));
    return(
        <div>
          <div style={{height:100, backgroundColor:'yellow'}}>
            <h3>
              this is mes
            </h3>
            <button onClick = {this.addWorkCentre} style = {{"right": 0 + 'px'}}>
            Add Work Center
            </button>
          </div>
            {doSomething(this.state.workCenters)}
        </div>

      )
  },
});

Template.mes_first.helpers({
  MesFirst() {
    // console.log(Meteor.call('getShopFloorList', 1, GlobalUI.generalCallback()))
    return MesFirst;
}});
