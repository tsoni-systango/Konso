Meteor.startup(function () {
    function trueFunc(userId) {
        if (!userId) {
            // must be logged in
            return false;
        }

        return true;
    }

    UserReadTimestamps.allow({
        insert: function (userId, doc) {
            return userId && doc.userId === userId;
        },
        update: function (userId, doc, fieldNames) {
            return userId && doc.userId === userId && fieldNames.length === 1 && fieldNames.indexOf("timestamp") === 0;
        }
    });
})