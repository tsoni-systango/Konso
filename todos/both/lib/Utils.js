_.mixin({
    now: function () {
        return new Date().getTime()
    }
});

Utils = {};
Utils.getUsername = function (user) {
    if(!user){
        return "Anonymous User";
    }
    return user.profile && user.profile.displayName ? user.profile.displayName : user.username;
}
