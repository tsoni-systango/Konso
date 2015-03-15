# meteor-atlassian-crowd
A Meteor package for the Atlassian Crowd nodejs module.

## Documentation

Access the module in js as <code>AtlassianCrowd</code>.

You can create an instance of <code>AtlassianCrowd</code> by passing it an options doc.

<pre>
var options = {
  "crowd": {
    "base": "http://crowd.yourdomain.com:8059/crowd/",
  },
  "application": {
    "name": "username",
    "password": "password"
  }
}

crowd = new AtlassianCrowd(options);
</pre>

## Miscellany

Further documenation about Atlassian Crow applications.
https://confluence.atlassian.com/display/CROWD/Adding+an+Application#AddinganApplication-add

## Kudos

Uses the node package to facilitate access and api calls to atlassian-crowd package.
https://www.npmjs.com/package/atlassian-crowd

