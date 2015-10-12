Template.chatAttachment.helpers({
	url: function () {
		var a = Uploads.findOne(this._id);
		console.log(a)
		return a ? a.link() : "";
	},
	isImage: function () {
		var a = Uploads.findOne(this._id);
		return false && a && a.isImage();
	}
})