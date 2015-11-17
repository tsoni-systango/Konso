//not used anymore. but maybe will be useful in future
ScrollingController = function (scrollingArea, chat) {
	var messagesToShow = chat.messagesOnPage, currentOffset = chat.messagesSkipped;
	var scrollingArea = scrollingArea;
	var messages = scrollingArea.find(".messages");
	var self = this;

	function clone() {
		var containerOriginal = chat.$("#messages-container-scroll");
		var containerClone = chat.$("#messages-container-clone");
		containerClone.css({"overflow-y": "hidden"});
		var desiredHeight = containerOriginal.height();
		var cloned = containerOriginal.find(".messages").clone();
		cloned.find("[id]").removeAttr("id").removeAttr("created");
		containerClone.html(cloned);
		var scrollTop = containerOriginal.scrollTop();
		containerClone.show();
		containerClone.css({opacity: 0});
		var h = containerClone.find(".messages").height();
		containerClone.scrollTop(scrollTop);
		containerClone.css({opacity: 1});
		containerOriginal.css({opacity: 0});
		containerClone.css({"overflow-y": "auto"});
	}

	function loadFresh() {
		var count = IM.messagesCountForDialogMap[IM.getCurrentDialogId()] || 0;
		var skip = currentOffset.get();
		var limit = messagesToShow.get();
		var offset;
		if (chat.inverted) {
			clone()
			chat.loadingNew.set(true);
			offset = skip + limit / 2;
			if (offset + limit >= count) {
				offset = 0;
				chat.inverted = false;
			}
			var currentMessagesHeight = chat.$("#messages-container-scroll .messages").height();
			var lastMessageId = chat.$("#messages-container-scroll .messages .chat-message").last().attr("id");
			chat.doAfterEachMessageReady = function () {
				var messageEl = chat.$("#" + lastMessageId);
				var scrollContainer = chat.$("#messages-container-scroll");
				var scrollTo = messageEl.position().top + scrollContainer.scrollTop();
				scrollTo += - scrollContainer.height() + messageEl.innerHeight() + 1;
				scrollContainer.scrollTop(scrollTo);
				//alert(messageEl.position().top + " - " + scrollContainer.scrollTop() + " - " +
				// scrollContainer.height() + " - " + messageEl.innerHeight());
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
			clone()
			chat.loadingOld.set(true);
			chat.inverted = true;

			var firstMessageId = chat.$("#messages-container-scroll .messages .chat-message").first().attr("id");
			chat.doAfterEachMessageReady = function () {
				var scrollContainer = chat.$("#messages-container-scroll");
				var scrollTo = chat.$("#" + firstMessageId).position().top + scrollContainer.scrollTop();
				scrollContainer.scrollTop(scrollTo);
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