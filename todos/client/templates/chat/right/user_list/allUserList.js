Template.allUserList.onCreated(function () {
    var self = this;
    self.opts = new ReactiveVar({limit: 100, offset: 0, searchString: null});
    self.selectedId = new ReactiveVar();

    var prevMode;
    self.autorun(function () {
        var opts = self.opts.get();
        var filterString = IM.getUsersFilterString();
        if (typeof filterString != "undefined" && filterString.toString().length !== 1 && filterString.toString().length !== 2) {
            if (opts.searchString !== filterString) {
                opts.searchString = filterString;
                opts.offset = 0;
                self.opts.set(opts);
            }
        }
    });
    function getOnliners(){
        var a = {};
        UserPresences.find({}, {fields: {userId: 1}}).fetch().forEach(function(o){
            a[o.userId] = o.state;
        })
        return Object.keys(a);
    }

    self.onSearchInput = _.debounce(function (val) {
        IM.setUsersFilterString(val);
    }, 1000);

    self.getUserCount = function(){
        return Meteor.users.find({_id: {$ne: Meteor.userId()}}).count();
    }
    self.dialogUsers = function(){
        var query = {};
        var dialog = IM.getCurrentDialog();
        if (false&&dialog && dialog.type === DialogTypes.ROOM) {
            var usersIds = dialog.userIds.concat(Meteor.userId());
            return UsersList.find({_id: {$nin: usersIds}, "profile.sortName": {$exists: 1}},
                {sort: {"profile.sortName": 1}});
        }
    }
    self.users = function () {

        console.log("start")
        var query = {};
        var t = new Date().getTime();

        var opts =self.opts.get();
        if(opts.searchString) {
            query["profile.displayName"] = new RegExp(opts.searchString);
        }


        console.log("stop1 ", (new Date().getTime() - t))
        query._id = {$ne: Meteor.userId()};
        query["profile.presence"] = {$ne: 0};
        var online = Meteor.users.find(query,
            {
                limit: self.opts.get().limit,
                skip: self.opts.get().offset
            }).fetch();
        query._id = {$ne: Meteor.userId()};
        query["profile.presence"] = 0;
        console.log("stop2 ", (new Date().getTime() - t))
        var offline = [];
        if(online.length <= self.opts.get().limit) {
            offline= Meteor.users.find(query,
                {
                    limit: self.opts.get().limit-online.length,
                    skip: Math.max(0, self.opts.get().offset - online.length)
                }).fetch();
        }

        self.doAfterFetch && self.doAfterFetch();
        self.doAfterFetch = null;
        var r =online.concat(offline);
        return r;
    }
})

Template.allUserList.onDestroyed(function () {
    self.list.off("scroll");
});
Template.allUserList.onRendered(function () {
    var self = this;

    var list = self.list = self.$(".scrollable-list");
    var onScroll = function(e){
        var maxScroll = list.find("#users-scrollable-wrapper").height();
        var scrollPos = list.scrollTop();
        var d = 7/10;
        var opts = self.opts.get();
        if(scrollPos >= maxScroll * d ){
            opts.offset = Math.round(opts.limit * (1- d) + opts.offset);
            list.off("scroll")
            self.doAfterFetch = function(){
                list.scrollTop(scrollPos - maxScroll * (1 - d));
                list.on("scroll", onScroll);
            }
            self.opts.set(opts);
        } else if(scrollPos <= maxScroll * (1 - d) && opts.offset > 0 ){
            opts.offset = Math.round(opts.offset - opts.limit * (1- d));
            list.off("scroll");
            self.doAfterFetch = function(){
                list.scrollTop(scrollPos + maxScroll * (1 - d));
                list.on("scroll", onScroll);
            }
            self.opts.set(opts);
        }

    };
    list.on("scroll", onScroll);
});

Template.allUserList.helpers({
    roomUsers: function () {
        var dialog = IM.getCurrentDialog();
        if (dialog && dialog.type === DialogTypes.ROOM) {
            if (!(dialog = Dialogs.findOne(dialog._id))) {
                return;
            };
            var usersIds = _.without(dialog.userIds, Meteor.userId());
            return Meteor.users.find({_id: {$in: usersIds}},
                {sort: {"profile.sortName": 1}});
        }
    },
    users: function () {
        return Template.instance().users();
    },
    selectedId: function(){
        return Template.instance().selectedId.get();
    }
});

Template.allUserList.events({
    "input .filter-users": function (e, t) {
        t.onSearchInput($(e.target).val());
    },
    "click .all-user-list": function(e, t){
        var userItem = $(e.target).closest(".general-user-item")
        if(userItem.length){
            var _id = userItem.attr("_id");
            t.selectedId.set(_id);
            t.$(".user-menu").addClass("fadeInRight")
        } else if($(e.target).closest(".close-user-menu").length){
            t.$(".user-menu").addClass("fadeOutRight");
            Meteor.setTimeout(function(){
                t.$(".user-menu").removeClass("fadeOutRight").removeClass("fadeInRight");
            }, 500);
        }

    }
});

