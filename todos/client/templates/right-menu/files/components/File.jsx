FileItem = React.createClass({
    propTypes: {
        task: React.PropTypes.object.isRequired
    },

    clickImage(){
        GlobalUI.openAttachmentView(this.props.upload._id);
    },
    clickFile(){
        var url = Uploads.findOne({_id:this.props.upload._id}).link();
        window.open(url+'?download=true');
        return false;
    },

    render() {
        // Give tasks a different className when they are checked off,
        // so that we can style them nicely in CSS
        // Add "checked" and/or "private" to the className when needed
        //const taskClassName = (this.props.note.checked ? "checked" : "") + " " +
        //  (this.props.task.private ? "private" : "");
        const url = Uploads.findOne({_id:this.props.upload._id}).link();
        const name = Uploads.findOne({_id:this.props.upload._id}).get().name;
        var uploadRender;
        //const url = this.props.upload.url;
        if (this.props.upload.isImage){
            uploadRender =
                <div className="picture">
                    <img src={url}/>
                    <button className="btn-view btn-floating"
                            onClick={this.clickImage}>
                        <i className="mdi-action-pageview"></i>
                    </button>
                </div>;
        }else{
            uploadRender =
                <div className="picture">
                    <button className="btn-download btn-floating"
                            onClick={this.clickFile}>
                        <i className="mdi-file-file-download"></i>
                    </button>
            </div>;
        }

        return (
            <li>
                <div className="attachment">
                    {uploadRender}
                    <div title={name} className="attachment-name ellipsis">
                        {name}
                    </div>
                </div>
            </li>
        );
    }
});