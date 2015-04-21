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
}
Utils.linkify = function (text, isBlank) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function (url) {
        if(isBlank){
            return '<a target="_blank" href="' + url + '">' + url + '</a>';
        } else {
            return '<a href="' + url + '">' + url + '</a>';
        }
    })
}