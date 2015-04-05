synchronizeAtlassianCrowdUsersAndGroups = function () {
    var meteorUsers = Meteor.users.find({}, {fields: {username: 1}}).fetch();
        meteorUsers = _.pluck(meteorUsers, "username");
    AtlassianCrowd.instance().search("user", "name=*", Meteor.bindEnvironment(function (error, response) {
        if(response){
            var crowdUsers = _.pluck(response.users, "name");
            _.each(crowdUsers, function(crowdUser){
                if(!_.contains(meteorUsers, crowdUser)) {
                    AtlassianCrowd.instance().user.find(crowdUser, Meteor.bindEnvironment(function (err, user) {
                        if(user){
                            Accounts.createUser({
                                username: user.name,
                                email: user.email,
                                password: "password",
                                profile: {
                                    displayName: user['display-name']
                                }
                            })
                        }
                    }));
                }
            })
        }
    }));
}