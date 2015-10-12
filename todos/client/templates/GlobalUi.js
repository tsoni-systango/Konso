this.GlobalUI = (function () {
    function GlobalUI() {
    }

    GlobalUI.dialog = {};

    GlobalUI.toast = function (text) {
        Materialize.toast(text.replace(/[<>]/g, "'"), 3000);
    };
    GlobalUI.htmlToast = function (text) {
        Materialize.toast(text, 3000);
    };
    GlobalUI.errorToast = function (text) {
        Materialize.toast('<i class="mdi-alert-error error-color left small"></i>'+text.replace(/[<>]/g, "'"), 3000)
    };

    GlobalUI.showDialog = function (opts) {
        this.dialog = $("#main-modal");
        this.dialog.find('.modal-body').html('');
        this.dialog.find('.modal-header').html(opts.heading || '') ;
        this.dialog.css({maxWidth: opts.maxWidth})

        this.dialogView = Blaze.renderWithData(
            Template[opts.template],
            opts.data,
            this.dialog.find('.modal-body')[0]
        );
        Session.set("global.ui.fullscreen", !!opts.fullScreen);
        this.dialog.openModal();
        return this.dialog;
    };
    GlobalUI.openSettings = function () {
        Session.set("global.ui.showSettings", true);
        $("#settings-modal").openModal();
    }
    GlobalUI.closeSettings = function () {
        Session.set("global.ui.showSettings", false);
        $("#settings-modal").closeModal();
    }

    GlobalUI.closeDialog = function () {
        if (this.dialogView) {
            Blaze.remove(this.dialogView);
            this.dialogView = null;
            return this.dialog && this.dialog.closeModal();
        }
    };

    GlobalUI.openAttachmentView = function (attachmentId) {
        this.attachmentView = Blaze.renderWithData(
            Template.attachmentView,
            {attachmentId: attachmentId},
            $('body')[0]
        );
    };

    GlobalUI.closeAttachmentView = function () {
        if (this.attachmentView) {
            Blaze.remove(this.attachmentView);
            this.attachmentView = null;
        }
    };

    GlobalUI.isProgressVisible = new ReactiveVar(false);
    GlobalUI.generalModalCallback = function (onSuccess, onError) {
        GlobalUI.isProgressVisible.set(true);
        return function (error, result) {
            GlobalUI.isProgressVisible.set(false);
            if (!error) {
                GlobalUI.closeDialog();
                onSuccess && onSuccess(result);
            } else {
                var msg = error.reason ? error.reason : error.message;
                GlobalUI.errorToast(msg);
                onError && onError(msg);
            }
        }
    };
    GlobalUI.generalCallback = function (onSuccess, onComplete) {
        return function (error, result) {

            if (!error) {
                onSuccess && onSuccess(result);
            } else {
                console.log(error)
                var msg = error.reason ? error.reason : error.message;
                GlobalUI.errorToast(msg);
            }
            onComplete && onComplete(error, result);
        }
    };
    GlobalUI.closeLeftMenu = function () {
        var menu = $("#app-left-menu");
        var btn = $("#left-menu-btn");
        if(menu.is(".narrow")){
            btn.sideNav("hide")
        }
    };
    GlobalUI.closeRightMenu = function () {
        var menu = $("#app-right-menu");
        var btn = $("#right-menu-btn");
        if(menu.is(".narrow")){
            btn.sideNav("hide")
        }
    };


    return GlobalUI;

})();
