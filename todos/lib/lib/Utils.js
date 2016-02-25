_now = function () {
	return new Date().getTime();
}

_DayStart = function () {
	return new Date(moment().startOf('day'))
}

_DayEnd = function () {
	return new Date(moment().endOf('day'))
}

_Now = function () {
	return new Date()
}

Utils = new function () {
	this.getUsername = function (user) {
		if (!user) {
			return "Anonymous User";
		}
		return user.profile && user.profile.displayName ? user.profile.displayName : user.username;
	};
	this.normalizeMessage = function (message) {
		Tracker.nonreactive(function () {
			var messageOwner = Meteor.users.findOne(message.ownerId, {reactive: false});
			message.ownerName = messageOwner ? Utils.getUsername(messageOwner) : "System";
			if (message.removed) {
				message.plainText = "removed message"
				message.infoText = message.ownerName + "<i> " + message.plainText + "</i>";
			}
			message.plainText = message.text
			message.infoText = message.ownerName + ": " + message.plainText;
		})
	}
	this.linkify = function (text, isBlank) {
		var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
		return text.replace(urlRegex, function (url) {
			if (isBlank) {
				return '<a target="_blank" href="' + url + '">' + url + '</a>';
			} else {
				return '<a href="' + url + '">' + url + '</a>';
			}
		})
	}
	this.getByKey = function (obj, key) {
		if (!obj) return null;
		function _index(obj, i) {
			return obj[i]
		};
		return key.split('.').reduce(_index, obj);
	}
	this.setByKey = function (key, object, value, ifNotExists) {
		var keys = key.split('.');
		var currentObject = object;
		for (var i = 0; i < keys.length; i++) {
			var _key = keys[i];
			if (i === keys.length - 1) {
				if (ifNotExists && currentObject.hasOwnProperty(_key)) {
					return;
				}
				currentObject[_key] = value;
			} else {
				if (!currentObject[_key]) {
					currentObject[_key] = {};
				}
				currentObject = currentObject[_key];
			}
		}
	}
	this.multikeyVal = function (obj, keys, delimer) {
		var subKeys;
		if (_.isArray(keys)) {
			subKeys = keys;
		} else {
			delimer = delimer || ".";
			subKeys = keys.split(delimer);
		}
		for (var i = 0; i < subKeys.length; i++) {
			if (!obj) return null;
			obj = obj[subKeys[i]];
			if (subKeys.length === i + 1) {
				if (typeof obj === "undefined") {
					return null;
				} else {
					return obj;
				}
			}
		}
		return null;
	}
	this.isUserInGroup = function (user, groupName) {
		if (!groupName || !user || !user.groups) {
			return false;
		}
		if (_.isArray(user.groups)) {
			var inGroup = false;
			user.groups.forEach(function (g) {
				if (_.isArray(groupName)) {
					if (groupName.indexOf(g) >= 0) {
						inGroup = true;
					}
				} else {
					if (g === groupName) {
						inGroup = true;
					}
				}
			});
			return inGroup;
		} else {
			if (_.isArray(groupName)) {
				return groupName.indexOf(user.groups) >= 0;
			}
			return user.groups === groupName;
		}
	}
	this.random = function(prefix){
		prefix = prefix || "id_";
		return prefix + Math.floor(Math.random() * 1000000000);
	}
}
