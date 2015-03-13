Utils = {};
Utils.getUsername = function (user) {
    return user.profile.displayName ? user.profile.displayName : user.username;
}
