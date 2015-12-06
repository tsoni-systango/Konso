Template.allUserList.onCreated(function () {
	var self = this;
	self.opts = new ReactiveVar({limit: 100, offset: 0});
	self.searchString = new ReactiveVar();
	self.selectedId = new ReactiveVar();

	self.autorun(function () {
		var prevVal = Tracker.nonreactive(function () {
			return self.searchString.get()
		})
		var opts = Tracker.nonreactive(function () {
			return self.opts.get()
		})
		var filterString = IM.getUsersFilterString();
		if (typeof filterString != "undefined" && filterString.toString().length !== 1 && filterString.toString().length !== 2) {
			if (prevVal !== filterString) {
				opts.offset = 0;
				self.opts.set(opts)
				self.searchString.set(filterString);
			}
		}
	});
	function getOnliners() {
		var a = {};
		UserPresences.find({}, {fields: {userId: 1}}).fetch().forEach(function (o) {
			a[o.userId] = o.state;
		})
		return Object.keys(a);
	}

	self.onSearchInput = _.debounce(function (val) {
		IM.setUsersFilterString(val);
	}, 1000);

	self.getUserCount = function () {
		return Meteor.users.find({_id: {$ne: Meteor.userId()}}, {fields: {"profile.preferences": 0}}).count();
	}
	self.dialogUsers = function () {
		var query = {};
		var dialog = IM.getCurrentDialog();
		if (dialog && dialog.type === DialogTypes.ROOM) {
			var usersIds = dialog.userIds.concat(Meteor.userId());
			return Meteor.users.find({_id: {$in: usersIds}},
				{sort: {"profile.sortIndex": 1}, fields: {"profile.preferences": 0}}).fetch();
		}
		return []
	}

	self.users = function () {

		var query = {};

		var searchString = self.searchString.get();
		if (searchString) {
			searchString = new RegExp(searchString, "i");
		}



		var dialogUsers = [];
		var users = [];

		var dialog = IM.getCurrentDialog();
		var dialogUsersIds = dialog && dialog.type === DialogTypes.ROOM ? dialog.userIds: null

		var all = Meteor.users.find({}, {fields: {"profile.preferences": 0}}).fetch();
		for(var i=0; i < all.length; i++){
			var user = all[i];
			if(user._id === Meteor.userId() || (searchString && !user.profile.displayName.match(searchString))){
				continue;
			}
			var array = dialogUsersIds && dialogUsersIds.indexOf(user._id) >=0 ? dialogUsers : users;
			if(user.profile.presence){
				array.unshift(user);
			} else {
				array.push(user);
			}
		}
		return {
			dialogUsers: dialogUsers,
			users: users
		}
	}

	self.usersArray = new ReactiveVar([]);
	self.autorun(function () {
		var t = new Date().getTime()
		self.usersArray.set(self.users());
		console.log("Users rerender...")
		console.log("Time: ", (new Date().getTime() - t))
	});
})

Template.allUserList.onDestroyed(function () {
	var self = this;
	self.destroyed = true;
	self.list && self.list.off("scroll");
});

Template.allUserList.onRendered(function () {
	var self = this;

	self.list = self.$(".scrollable-list");
	var onScroll = function (e) {
		var maxScroll = self.list.find("#users-scrollable-wrapper").height();
		var scrollPos = self.list.scrollTop();
		var d = 7 / 10;
		var opts = self.opts.get();
		if (scrollPos >= maxScroll * d) {
			opts.offset = Math.round(opts.limit * (1 - d) + opts.offset);
			self.list.off("scroll")
			self.t = new Date().getTime()
			self.doAfterFetch = function () {
				self.list.scrollTop(scrollPos - maxScroll * (1 - d));
				self.list.on("scroll", onScroll);
			}
			self.opts.set(opts);
		} else if (scrollPos <= maxScroll * (1 - d) && opts.offset > 0) {
			opts.offset = Math.round(opts.offset - opts.limit * (1 - d));
			self.list.off("scroll");

			self.t = new Date().getTime()
			self.doAfterFetch = function () {

				self.list.scrollTop(scrollPos + maxScroll * (1 - d));
				self.list.on("scroll", onScroll);
			}
			self.opts.set(opts);
		}

	};
	self.list.on("scroll", onScroll);
});

Template.allUserList.helpers({
	users: function () {
		var self = Template.instance();
		var opts = self.opts.get();
		self.doAfterFetch && self.doAfterFetch();
		self.doAfterFetch = null;
		//console.log(self.opts.get().offset, " ", self.opts.get().limit, " ", self.usersArray.get().length)
		var users = self.usersArray.get().users;
		var dialogUsers = self.usersArray.get().dialogUsers;
		var realOffset = opts.offset - dialogUsers.length;
		var realLimit = realOffset + opts.limit
		var r = users.slice(realOffset < 0 ? 0 : realOffset, realLimit < 0 ? 0 : realLimit);
		return r
	},
	dialogUsers:function(){
		var self = Template.instance();
		var opts = self.opts.get();
		var dialogUsers = self.usersArray.get().dialogUsers;
		var r =  dialogUsers.slice(opts.offset, opts.limit + opts.offset);
		return r;
	},
	selectedId: function () {
		return Template.instance().selectedId.get();
	}
});

Template.allUserList.events({
	"input .filter-users": function (e, t) {
		t.onSearchInput($(e.target).val());
	},
	"click .all-user-list": function (e, t) {
		var userItem = $(e.target).closest(".general-user-item")
		if (userItem.length) {
			var _id = userItem.attr("_id");
			t.selectedId.set(_id);
			t.$(".user-menu").addClass("fadeInRight")
		} else if ($(e.target).closest(".close-user-menu").length) {
			t.$(".user-menu").addClass("fadeOutRight");
			t.selectedId.set(null);
			Meteor.setTimeout(function () {
				!t.destroyed && t.$(".user-menu").removeClass("fadeOutRight").removeClass("fadeInRight");
			}, 500);
		}

	}
});

