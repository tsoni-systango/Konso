
Template.chat.created = function () {
	var self = this;
	this.autorun(function () {
		var currentDialog = getCurrentDialog();
		if (currentDialog) {
			self.subscription = Meteor.subscribe("messages", currentDialog._id);
		}
	});
}
Template.chat.rendered = function () {
	var self = this;
	self.$messagesContainer = $('.messages-container');
	self.$newMessageForm = $('#chat-message-form');
	var currentTimeout;
	this.autorun(function () {
		currentTimeout && Meteor.clearTimeout(currentTimeout);
		if (getCurrentDialog()) {
			Meteor.setTimeout(function () {
				self.$messagesContainer.scrollTo('#unread-separator');
				Meteor.clearTimeout(currentTimeout);
			}, 1000);
		}
	});

	self.$messagesContainer.on('mousemove scroll click', handleUserAttention);
	self.$newMessageForm.on('keyup', handleUserAttention);
	function handleUserAttention(e) {
		actionHappened = true;
	}

	this.autorun(function () {
		var users = Meteor.users.find({_id: {$ne: Meteor.userId()}}).fetch();
		var suggestions = ["All users"];
		users.forEach(function (el) {
			suggestions.push(el.username);
		});
		var suggests = suggestions;
		$.fn.asuggest.defaults.delimiters = "@";
		$.fn.asuggest.defaults.minChunkSize = 1;
		
		self.$newMessageForm.find('textarea').asuggest(suggests);

	});

}
Template.chat.destroyed = function () {
	var self = this;
	self.$messagesContainer.off()
	self.$newMessageForm.off()
}

var actionHappened = false;
Meteor.setInterval(function () {
	if (actionHappened) {
		var $messagesContainer = $('.messages-container');
		var y = $messagesContainer.offset().top + $messagesContainer.height() - 10;
		var x = $messagesContainer.offset().left + 5;
		var el = $(document.elementFromPoint(x, y)).closest(".chat-message");
		var created = Number(el.attr("created"));

		if (created) {
			updateReadTimestamp(created);
		}
		actionHappened = false;
	}
}, 3000);

Template.chat.helpers({
	allUsers: function () {
		return Meteor.users.find({_id: {$ne: Meteor.userId()}});
	},
	chatMessages: function () {
		var currentDialog = getCurrentDialog();
		if (currentDialog) {
			return Messages.find({
				dialogId: currentDialog._id,
				created: {$lte: getUnreadTimestamp(currentDialog._id)}
			}, {sort: {"created": -1}});
		}
	},
	chatMessagesUnread: function () {
		var currentDialog = getCurrentDialog();
		if (currentDialog) {
			return Messages.find({
				dialogId: currentDialog._id,
				created: {$gt: getUnreadTimestamp(currentDialog._id)}
			}, {sort: {"created": -1}});
		}
	},
	currentDialogName: function () {
		return getChatName(getCurrentDialog());
	},
	isMessagesReady: function () {
		if (getCurrentDialog()) {
			return Template.instance().subscription.ready()
		}
	}
});

Template.chat.events({
	"keydown #chat-message-form textarea": function (e) {
		var $textarea = $(e.currentTarget);
		var text = $textarea.val();
		if (e.keyCode === 13 && text.trim()) {
			e.preventDefault();
			$textarea.val('');
			Meteor.call('sendMessage', text, getCurrentDialog()._id, function (e, r) {

			})
		}
	}
});


function updateReadTimestamp(value) {
	var profile = Meteor.user().profile;
	var currentTimestamp = getUnreadTimestamp(getCurrentDialog()._id);
	var newValue = value || timestamp();
	if (newValue < currentTimestamp) {
		return;
	}
	profile.readTimestamps[getCurrentDialog()._id] = value || timestamp();
	Meteor.users.update(Meteor.userId(),
			{
				$set: {
					profile: profile
				}
			});
}
