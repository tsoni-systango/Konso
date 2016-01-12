//separate route for detailed to do view
NoteItem = React.createClass({
    propTypes: {
        task: React.PropTypes.object.isRequired
    },
    render() {
        return (
            <div>
                That's a note details
            </div>
        )
    }
});