SyncedCron.add({
    name: 'Synchronize Atlassian Crowd Groups',
    schedule: function (parser) {
        return parser.text('every 1 hour');
    },
    job: synchronizeAtlassianCrowdUsersAndGroups
});