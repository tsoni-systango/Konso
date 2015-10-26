Template.chatAttachment.helpers({
	exists: function () {
		return !!Uploads.findOne(this._id).get();
	},
	url: function () {
		return Uploads.findOne(this._id).link();
	},
	isImage: function () {
		return Uploads.findOne(this._id).get().isImage;
	},
	name: function(){
		return Uploads.findOne(this._id).get().name;
	}
})