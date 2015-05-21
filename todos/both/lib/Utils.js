_.mixin({
    now: function () {
        return new Date().getTime()
    }
});

Utils = {};
Utils.getUsername = function (user) {
    if (!user) {
        return "Anonymous User";
    }
    return user.profile && user.profile.displayName ? user.profile.displayName : user.username;
};
Utils.normalizeMessage = function (message) {
    var messageOwner = Meteor.users.findOne(message.ownerId, {reactive: false});
    message.ownerName = messageOwner ? Utils.getUsername(messageOwner) : "System";
    if (message.removed) {
        message.plainText = "removed message"
        message.infoText = message.ownerName + "<i> " + message.plainText + "</i>";
    }
    message.plainText = message.text
    message.infoText = message.ownerName + ": " + message.plainText;

}
Utils.linkify = function (text, isBlank) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function (url) {
        if (isBlank) {
            return '<a target="_blank" href="' + url + '">' + url + '</a>';
        } else {
            return '<a href="' + url + '">' + url + '</a>';
        }
    })
}
Utils.getByKey = function(obj, key){
    if(!obj) return null;
    function _index(obj,i) {return obj[i]};
    return key.split('.').reduce(_index, obj);
}