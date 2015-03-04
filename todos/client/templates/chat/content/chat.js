Template.chat.rendered = function(){
	
}

Template.chat.helpers({
	allUsers: function(){
		return Meteor.users.find();
	},
	chatMessages: function(){
		return Messages.find();
	}
});

Template.chat.events({
	"keyup #chat-message-form textarea": function(e){
		var $textarea = $(e.currentTarget);
		var text = $textarea.val();
		if(e.keyCode === 13 && text.trim()){
			console.log(e)
			$textarea.val('');
			//Meteor.call('sendMessage', text, )
		}
	}
});

setCurrentChannel = function(currentDialog){
	
}