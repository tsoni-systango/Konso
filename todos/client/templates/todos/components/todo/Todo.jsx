//separate route for detailed to do view
Todo = React.createClass({
    propTypes: {
        task: React.PropTypes.object.isRequired
    },
    render() {
        return (
            <div>
                That's a todo item;
            </div>
        )
    }
});