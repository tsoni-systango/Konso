this.GlobalUI = (function () {
    function GlobalUI() {
    }

    GlobalUI.dialog = {};

    GlobalUI.toast = function (text) {
        Materialize.toast(text.replace(/[<>]/g, "'"), 3000);
    };
    GlobalUI.errorToast = function (text) {
        Materialize.toast('<i class="mdi-alert-error error-color left small"></i>'+text.replace(/[<>]/g, "'"), 3000)
    };
    GlobalUI.isErrorToast = new ReactiveVar(false);

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
    GlobalUI.toggleLeftMenu = function () {
        //var mainTogglePanel = $("#main-drawer-panel")[0];
        //mainTogglePanel && mainTogglePanel.togglePanel();
    };
    GlobalUI.closeLeftMenu = function () {
        //var mainTogglePanel = $("#main-drawer-panel")[0];
        //mainTogglePanel && mainTogglePanel.closeDrawer();
    };
    GlobalUI.isProgressVisible = new ReactiveVar(false);

    return GlobalUI;

})();

Template.globalLayout.helpers({
    isDialogFullscreen: function () {
        return Session.get("global.ui.fullscreen");
    }
});