var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var CONNECTION_ISSUE_TIMEOUT = 5000;



Template.globalLayout.helpers({
    connected: function () {
        if (!Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
            return Meteor.status().connected;
        } else {
            return true;
        }
    },
	isErrorToast: function(){
		return GlobalUI.isErrorToast.get();
	},
	progressCSSDisplay: function(){
		return GlobalUI.isProgressVisible.get() ? "block": "none";
	},
	contentCSSDisplay: function(){
		return GlobalUI.isProgressVisible.get() ? "none": "block";
	},
	showSettings: function(){
		return Session.get("global.ui.showSettings");
	}
});

Template.globalLayout.rendered = function(){
	var html = $('html'),
		body = $('body'),
		showDrag = false,
		timeout = -1;

	html.bind('dragenter', function () {
		body.addClass('dragging');
		showDrag = true;
	});
	html.bind('dragover', function(){
		showDrag = true;
	});
	html.bind('drop', function(){
		body.removeClass('dragging');
		showDrag = false;
	});
	html.bind('dragleave', function (e) {
		showDrag = false;
		Meteor.clearTimeout( timeout );
		timeout = Meteor.setTimeout( function(){
			if( !showDrag ){ body.removeClass('dragging'); }
		}, 200 );
	});

	$(document).on("keyup", function(e){
		if(e.keyCode === 27){
			GlobalUI.closeDialog();
			GlobalUI.closeSettings();
			GlobalUI.closeAttachmentView();
		}
	})
}