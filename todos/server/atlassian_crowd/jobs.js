synchronizeWithAtlassianCrowd = function () {
    AtlassianCrowd.instance().ping(Meteor.bindEnvironment(function (err, res) {
        if(err) {
            console.error("Can not connect to Atlassian Crowd, please check if server is running.")
        } else {
            synchronizeAtlassianCrowdUsers();
            synchronizeAtlassianCrowdGrops();
        }
    }));
}

var synchronizeAtlassianCrowdUsers = function () {
    var meteorUsers = Meteor.users.find({}, {fields: {username: 1}}).fetch();
    meteorUsers = _.pluck(meteorUsers, "username");
    var findCrowdUserCallback = Meteor.bindEnvironment(function (error, user) {
        if (user) {
            Accounts.createUser({
                username: user.name,
                email: user.email,
                password: "password",
                profile: {
                    displayName: user['display-name']
                }
            })
        } else {
            console.error(error.message || error);
        }
    });

    var findCrowdUsersCallback = Meteor.bindEnvironment(function (error, response) {
        if (response) {
            var crowdUsers = _.pluck(response.users, "name");
            _.each(crowdUsers, function (crowdUser) {
                if (!_.contains(meteorUsers, crowdUser)) {
                    AtlassianCrowd.instance().user.find(crowdUser, findCrowdUserCallback);
                }
            })
        } else {
            console.error(error.message || error);
        }
    });

    AtlassianCrowd.instance().search("user", "name=*", findCrowdUsersCallback);

}

var synchronizeAtlassianCrowdGrops = function () {
    var users = Meteor.users.find().fetch();
    _.each(users, function (user) {

        var findCrowdUserGroupsCallback = Meteor.bindEnvironment(function (error, response) {
            if (response) {
                Meteor.users.update(user._id, {$set: {groups: response}});
            } else {
                console.error(error.message || error);
            }
        });

        AtlassianCrowd.instance().user.groups(user.username, findCrowdUserGroupsCallback);
    });
}