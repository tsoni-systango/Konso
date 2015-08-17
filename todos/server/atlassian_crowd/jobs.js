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
    var meteorUsers = Meteor.users.find({/*authType: AUTH_TYPES.CROWD*/}, {fields: {username: 1}}).fetch();
    var meteorUsersMapByName = {};
    var meteorUsernames = [];
    meteorUsers.forEach(function(user){
        meteorUsernames.push(user.username);
        meteorUsersMapByName[user.username] = user._id;
    });
    meteorUsers = _.pluck(meteorUsers, "username");
    var findCrowdUserCallback = Meteor.bindEnvironment(function (error, user) {

        if (user) {
            var userId = meteorUsersMapByName[user.name];
            if(userId){
                var u = Meteor.users.findOne(userId);
                if(u.authType !== AUTH_TYPES.CROWD
                    || u.profile.displayName !== user['display-name']
                    || (!u.emails || u.emails[0].address !== user.email)){
                    Meteor.users.update({_id: userId}, {$set: {
                        emails: user.email,
                        password: "password",
                        authType: AUTH_TYPES.CROWD,
                        "profile.displayName": user['display-name']
                        }
                    })
                }

            } else {
                console.log("CREATING USER: ", user.name);
                Accounts.createUser({
                    username: user.name,
                    emails: user.email,
                    password: "password",
                    authType: AUTH_TYPES.CROWD,
                    profile: {
                        displayName: user['display-name']
                    }
                })
            }
        } else {
            console.error(error.message || error);
        }
    });

    var findCrowdUsersCallback = Meteor.bindEnvironment(function (error, response) {
        if (response) {
            var crowdUsernames = _.pluck(response.users, "name");
            //to add if not exists on Meteor Server
            _.each(crowdUsernames, function (crowdUsername) {
                AtlassianCrowd.instance().user.find(crowdUsername, findCrowdUserCallback);
            })
            //to delete if not exists on Crowd Server
            _.each(meteorUsernames, function (meteorUsername) {
                if (!_.contains(crowdUsernames, meteorUsername)) {
                    Meteor.users.remove(meteorUsersMapByName[meteorUsername]);
                    console.log("removed user: ", meteorUsername);
                }
            });

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
            if (response && user.groups !== response) {
                Meteor.users.update(user._id, {$set: {groups: response}});
            } else if(error) {
                console.error(error.message || error);
            }
        });

        AtlassianCrowd.instance().user.groups(user.username, findCrowdUserGroupsCallback);
    });
}