Template.dialogItem.helpers({
	title: function(){
		return getDialogName(this);
	},
	selected: function(){
		var currentDialog = getCurrentDialog();
		if(currentDialog && currentDialog._id === this._id){
			return "selected";
		} 
	}
});
Template.dialogItem.events({
	"click .dialog-item": function(){
		setCurrentDialog(this);
	}
});