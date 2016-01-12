//separate route for detailed to do view
Template.todo.helpers({
    TodoItem: function () {
        return TodoItem;
    }
});

TodoItem = React.createClass({
    propTypes: {
        task: React.PropTypes.object.isRequired
    },
    render() {
        return (
            <div>
                To-Do details will be here
            </div>
        )
    }
});
