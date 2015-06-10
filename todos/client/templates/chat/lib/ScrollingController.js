ScrollingController = function (scrollingArea, chat) {
    var messagesToShow = chat.messagesOnPage, currentOffset = chat.messagesSkipped;

    var scrollingArea = scrollingArea;
    var messages = scrollingArea.find(".messages");
    var self = this;

    function loadFresh() {
        var count = IM.messagesCountForDialogMap[IM.getCurrentDialogId()] || 0;
        var skip = currentOffset.get();
        var limit = messagesToShow.get();
        var offset;
        if (chat.inverted) {
            chat.loadingNew.set(true);
            offset = skip + limit / 2;
            if (offset + limit >= count) {
                offset = 0;
                chat.inverted = false;
            }
            var currentMessagesHeight = chat.$(".messages-container-scroll .messages").height();
            var lastMessageId = chat.$(".messages-container-scroll .messages .chat-message").last().attr("id");
            chat.doAfterMessageReady = function () {
                var scrollContainer = chat.$("#messages-container-scroll");
                var scrollTo = scrollContainer.scrollTop() - scrollContainer.height() + $("#" + lastMessageId).position().top + $("#" + lastMessageId).height();
                scrollContainer.scrollTop(scrollTo);
            }
            self.destroy()
            currentOffset.set(offset);
        }
    }

    function loadOld() {
        var count = IM.messagesCountForDialogMap[IM.getCurrentDialogId()] || 0;
        var skip = currentOffset.get();
        var limit = messagesToShow.get();

        var offset = chat.inverted ? Math.max(skip - limit / 2, 0) : Math.max(count - limit - limit / 2, 0);
        if (offset !== skip) {
            chat.loadingOld.set(true);
            chat.inverted = true;

            var firstMessageId = chat.$(".messages-container-scroll .messages .chat-message").first().attr("id");
            chat.doAfterMessageReady = function () {
                var scrollContainer = chat.$("#messages-container-scroll");
                scrollContainer.scrollTop(chat.$("#" + firstMessageId).position().top + scrollContainer.scrollTop());
            }
            self.destroy()
            currentOffset.set(offset);
        }

    }


    var onScroll = _.debounce(function () {

        if (scrollingArea.scrollTop() === 0) {
            loadOld();
        } else if (scrollingArea.scrollTop() === (messages.height() - scrollingArea.height())) {
            loadFresh();
        }
    }, 330);

    $(scrollingArea).on("scroll", onScroll);

    this.destroy = function () {
        scrollingArea.off("scroll", onScroll);
    }
}