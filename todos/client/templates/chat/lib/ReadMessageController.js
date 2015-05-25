ReadMessageController = function () {
    var chat = $("#chat");
    chat.idleTimer({
        timeout: 500,
        idle: true
    });

    //we need this var to make sure activity was performed on one dialog. so user did not switch between
    var dialogId;
    chat.on("active.idleTimer", onActivity);
    function onActivity(){
        dialogId = IM.getCurrentDialogId();
    }
    chat.on("idle.idleTimer", onAfterActivity);

    function onAfterActivity(event, elem, obj, triggerevent) {
        if (IM.getCurrentDialogUnreadMessageCount() && dialogId === IM.getCurrentDialogId()) {
            var messagesContainer = $("#messages-container");
            var x = messagesContainer.offset().left;
            var y = messagesContainer.offset().top + messagesContainer.height();
            var el = $.elementFromPoint(x + 10, y - 35);
            var message = $(el).closest(".chat-message");
            if (message.length) {
                var messageTimestamp = Number(message.attr("created"));
                if (messageTimestamp > IM.getDialogUnreadTimestamp()) {
                    IM.setDialogUnreadTimestamp(messageTimestamp);
                }
            }
        }
    }

    this.destroy = function () {
        chat.off();
        chat.idleTimer("destroy");
    }
}