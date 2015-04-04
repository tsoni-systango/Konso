AtlassianCrowd = Npm.require('atlassian-crowd');
Future = Npm.require('fibers/future');

ATLASSIAN_CROWD_CONFIG = {};

var loginWithAtlassianCrowdSync = function (username, password) {
    if (!ATLASSIAN_CROWD_CONFIG.crowd || !ATLASSIAN_CROWD_CONFIG.crowd.base) {
        throw new Meteor.Error("Malformed config", "crowd.base is not defined");
    }
    if (!ATLASSIAN_CROWD_CONFIG.application.name) {
        throw new Meteor.Error("Malformed config", "application.name is not defined");
    }
    if (!ATLASSIAN_CROWD_CONFIG.application.password) {
        throw new Meteor.Error("Malformed config", "application.password is not defined");
    }
    _doRequest=null;
    var crowd = new AtlassianCrowd(ATLASSIAN_CROWD_CONFIG);
    _doRequest_patch();
    _doRequest = null;
    console.log(_doRequest);
    var syncFuture = new Future();
    crowd.user.authenticate(username, password, function (err, res) {
            syncFuture.return({
                error: err ? err.message : null,
                success: res
            });
    });

    return syncFuture.wait();
}

Accounts.registerLoginHandler("atlassianCrowd", function (loginRequest) {
    if (!loginRequest.atlassianCrowdAuth) {
        return undefined;
    }
    var u = loginRequest.atlassianCrowdAuth.crowdUsername;
    var p = loginRequest.atlassianCrowdAuth.crowdUserPassword;

    var result = loginWithAtlassianCrowdSync(u, p);

    if (result.error) {
        throw new Meteor.Error("Invalid credentials", result.error);
    } else {
        var res = result.success;
        var userId = null;
        var stampedToken = {
            token: null
        };
        var username = res.name;
        if (!res.active) {
            throw new Meteor.Error("Not Active", "User exists but is not active");
        }
        // Look to see if user already exists
        var user = Meteor.users.findOne({
            username: username
        });
        if (user) {
            // Set initial userId and token vals
            userId = user._id;

            // Create hashed token so user stays logged in
            stampedToken = Accounts._generateStampedLoginToken();
            var hashStampedToken = Accounts._hashStampedToken(stampedToken);
            // Update the user's token in mongo
            Meteor.users.update(userId, {
                $push: {
                    'services.resume.loginTokens': hashStampedToken
                }
            });
        } else {
            var userObject = {
                username: username,
                profile: {}
            };
            // Set email
            if (res.email) userObject.email = res.email;
            if (res['display-name']) {
                userObject.profile.displayName = res['display-name'];
            }

            userId = Accounts.createUser(userObject);
        }
        return {
            userId: userId,
            token: stampedToken.token
        };
    }
})

function _doRequest_patch() {
    _doRequest = function (options, callback) {
        var data = "", error;

        var opts = {
            hostname: this.settings.hostname,
            port: this.settings.port,
            auth: this.settings.authstring,
            method: options.method,
            path: settings.pathname + settings.apipath + options.path,
            headers: {
                "Accept": "application/json"
            }
        };

        if (options.method === "POST" || options.method === "PUT") {
            if (options.data) {
                opts.headers['content-type'] = "application/json";
                opts.headers['content-length'] = options.data.length;
            }
            else {
                error = new Error("Missing POST Data");
                error.type = "BAD_REQUEST";
                return callback(error);
            }
        }
        else {
            if (options.method === "DELETE") {
                // nginx requires content-length header also for DELETE requests
                opts.headers['content-length'] = '0';
            }
        }

        var protocol = (settings.protocol == "https:") ? https : http;

        var request = protocol.request(opts, function (response) {

            response.on('data', function (chunk) {
                data += chunk.toString();
            });

            if (response.statusCode === 204) {
                return callback(null, response.statusCode);
            }

            if (response.statusCode === 401) {
                error = new Error("Application Authorization Error");
                error.type = "APPLICATION_ACCESS_DENIED";
                return callback(error);
            }

            if (response.statusCode === 403) {
                error = new Error("Application Permission Denied");
                error.type = "APPLICATION_PERMISSION_DENIED";
                return callback(error);
            }

            response.on('end', function () {
                if (response.headers['content-type'] !== "application/json") {
                    error = new Error("Invalid Response from Atlassian Crowd");
                    error.type = "INVALID_RESPONSE";
                    return callback(error);
                }
                else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data.reason || data.message) {
                            if (typeof data.reason === "undefined") {
                                data.reason = "BAD_REQUEST";
                                data.message = "Invalid Request to Atlassian Crowd";
                            }
                            error = new Error(data.message);
                            error.type = data.reason;
                            return callback(error);
                        }
                        else {
                            return callback(null, data);
                        }
                    }
                    else {
                        return callback(null, response.statusCode);
                    }
                }
            });
        });

        request.on("error", function (e) {
            return callback(e);
        });

        if (options.data) {
            request.end(options.data);
        }
        else {
            request.end();
        }
    };
}