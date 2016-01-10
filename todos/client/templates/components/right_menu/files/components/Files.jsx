// App component - represents the whole app
FilesReact = React.createClass({

  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      hideCompleted: false
    }
  },

  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    let query = {};

    return {
      uploads: Uploads.collection.find(query, {sort: {updatedAt: -1}}).fetch(),
      uploadsCount: Uploads.collection.find(query,{sort: {updatedAt: -1}}).count(),
      currentUser: Meteor.user()
    };
  },

  renderUploads() {
    // Get tasks from this.data.tasks
    return this.data.uploads.map((upload) => {
      const currentUserId = this.data.currentUser && this.data.currentUser._id;

      return <FileItem
        key={upload._id}
        upload={upload}/>;
    });
  },

  render() {
    return (
      <div className="files-container">
        <header>
          <h5>Uploads: {this.data.uploadsCount}</h5>
        </header>

        <ul>
          {this.renderUploads()}
        </ul>
      </div>
    );
  }
});
