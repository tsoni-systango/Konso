Meteor.startup(function () {
    function trueFunc(userId) {
        return userId;
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