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
Utils.linkify = function (text) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '">' + url + '</a>';
    })
}