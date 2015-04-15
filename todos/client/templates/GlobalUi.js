this.GlobalUI = (function() {
  function GlobalUI() {}

  GlobalUI.dialog = {};

  GlobalUI.toast = function(text) {
      console.log("simple toast")
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
      $(this.dialog).find('.modal-content').html('');
    this.dialog.heading = opts.heading;
	this.dialogView = Blaze.renderWithData(
			Template[opts.template],
			opts.data,
			$(this.dialog).find('.modal-content')[0]
	);
	Session.set("global.ui.fullscreen", !!opts.fullScreen);
    this.dialog.open();
	return this.dialog;
  };
    GlobalUI.openSettings=function(){
        Session.set("global.ui.showSettings", true);
    }
    GlobalUI.closeSettings=function(){
        Session.set("global.ui.showSettings", false);
    }

  GlobalUI.closeDialog = function() {
      Blaze.remove(this.dialogView);
      return this.dialog && this.dialog.close();
  };
  
  GlobalUI.generalModalCallback = function(onSuccess, onError){
	  GlobalUI.isProgressVisible.set(true);
	  return function(error, result){
		  GlobalUI.isProgressVisible.set(false);
		  if(!error){
			GlobalUI.closeDialog();
			onSuccess && onSuccess(result);
		  } else {
              var msg = error.reason ? error.reason : error.message;
              GlobalUI.errorToast(msg);
              onError && onError(msg);
		  }
	  }
  };
    GlobalUI.generalCallback = function (onSuccess) {
        return function (error, result) {

            if (!error) {
                onSuccess && onSuccess(result);
            } else {
                console.log(error)
                var msg = error.reason ? error.reason : error.message;
                GlobalUI.errorToast(msg);
            }
        }
  };
    GlobalUI.toggleLeftMenu = function(){
        var mainTogglePanel = $("#main-drawer-panel")[0];
        mainTogglePanel && mainTogglePanel.togglePanel();
    };
    GlobalUI.closeLeftMenu = function(){
        var mainTogglePanel = $("#main-drawer-panel")[0];
        mainTogglePanel && mainTogglePanel.closeDrawer();
    };
    GlobalUI.isProgressVisible = new ReactiveVar(false);

  return GlobalUI;

})();

Template.globalLayout.helpers({
  isDialogFullscreen: function() {
    return Session.get("global.ui.fullscreen");
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