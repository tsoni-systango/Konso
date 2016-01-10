FileUtils = new function(){
	var _upload = function (file, name, callbacks, meta) {
		if(!file.name){
			var type = file['mime-type'] || file.type;
			file.name = (name || "Upload_" + new Date().getTime()) + "." + type.split("/")[1];
		}
		var opts = {
			file: file,
			meta: meta
		}
		_.extend(opts, callbacks);
		return Uploads.insert(opts);
	}
	/**
	 *
	 * @param file - file or bulk
	 * @param callbacks - object with *onUploaded*, *onProgress*, *onBeforeUpload*, *onAbort*
	 * @param meta - object with any meta
	 * @returns {Object} with *onPause*, *progress*, *pause()*, *continue()*, *toggleUpload()*, *abort()*
	 */
	this.uploadMessageAttachment = function(file, name){
		var info = {
			_id: Utils.random(),
			progress: new ReactiveVar(0),
			uploaded: new ReactiveVar(false),
			aborted: new ReactiveVar(true)
		};
		var meta = (IM.getCurrentDialogId()&&Meteor.userId()) ? {
			dialogId: IM.getCurrentDialogId(), userId: Meteor.userId()} : {};
		var result = _upload(file, name, {
			onBeforeUpload:function(){
				if(this.size > 24 * 1024 * 1024){
					return "Maximum size is 25mb";
				}
				return true;
			},
			onProgress: function(p){
				console.log(p)
				info.progress.set(p);
			},
			onUploaded: GlobalUI.generalCallback(null, function(e, r){
				info.uploaded.set({
					e: e,
					r: r
				})
			}),
			onAbort: function(){
				info.aborted.set(true);
			}
		},meta);
		if(!result){
			return info;
		}
		info.result = result;
		return info;
	}

}