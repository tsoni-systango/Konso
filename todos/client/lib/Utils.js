timestamp = function(){
	return new Date().getTime();
}
generalCallback = function(error){
	if(error){
		GlobalUI.toast("Error: ", error.reason);
	}
}