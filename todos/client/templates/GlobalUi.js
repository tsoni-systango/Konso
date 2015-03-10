this.GlobalUI = (function() {
  function GlobalUI() {}

  GlobalUI.dialog = {};

  GlobalUI.toast = function(text) {
	this.isErrorToast.set(false);
    var toast;
    toast = $("[global-toast]")[0];
    toast.text = text;
    return toast.show();
  };
  GlobalUI.errorToast = function(text) {
	this.isErrorToast.set(true);
    var toast;
    toast = $("[global-toast]")[0];
    toast.text = text;
    return toast.show();
  };
  GlobalUI.isErrorToast = new ReactiveVar(false);

  GlobalUI.showDialog = function(opts) {
    this.dialog = $("[global-dialog]")[0];
    this.dialog.heading = opts.heading;
	this.dialogView = Blaze.renderWithData(
			Template[opts.template],
			opts.data,
			$(this.dialog).find('.modal-content')[0]
	);
	Session.set("global.ui.dialogFullOnMobile", opts.fullOnMobile != null);
    this.dialog.open();
	return this.dialog;
  };

  GlobalUI.closeDialog = function() {
    return this.dialog.close();
  };
  
  GlobalUI.generalModalCallback = function(onSuccess){
	  GlobalUI.isProgressVisible.set(true);
	  return function(error, result){
		  GlobalUI.isProgressVisible.set(false);
		  if(!error){
			GlobalUI.closeDialog();
			onSuccess && onSuccess(result);
		  } else {
			  console.log(error)
			GlobalUI.errorToast(error.error); 
		  }
	  }
  };
  GlobalUI.isProgressVisible = new ReactiveVar(false);

  return GlobalUI;

})();

Template.globalLayout.helpers({
  globalDialogFullOnMobile: function() {
    return Session.get("global.ui.dialogFullOnMobile");
  }
});

Template.globalLayout.events({
  "core-overlay-close-completed [global-dialog]": function(e) {
	Blaze.remove(GlobalUI.dialogView)
	GlobalUI.dialogView = null;
    return Session.set("global.ui.dialogFullOnMobile", null);
  },
  "click [data-open-dialog]": function(e) {
    var node;
    node = $(e.target);
    return GlobalUI.showDialog({
      heading: node.data("heading"),
      template: node.data("openDialog"),
      data: node.data("useContext") != null ? this : void 0,
      fullOnMobile: node.data("fullOnMobile")
    });
  }
  
});