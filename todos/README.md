# Konso app

## Config
All possible configurations are:
```javascript
{
  "public": {
    "defaultAuth": "crowd",
    "uploadsDir": "~/uploads",
    "privileges": {
      "createChannels": ["crowd-administrators"],
      "createChatAlerts": ["Admins"]
    }
  },
  "authentication": {
    "crowd": {
      "baseUrl": "http://localhost:8095/crowd/",
      "appName": "im",
      "appPassword": "123qwe"
    },
    "ldap": {
      "baseUrl": "ldap://ldap.forumsys.com",
      "port": 389,
      "dn": "dc=example,dc=com"
    }
  }
}
```

##Widget
Widget is fully supported if the app is running on 80 port by default, not 3000 or whatever. It also requires HTTPS support to be embeddable to web sites that use HTTPS protocol.

## HTTPS Support
To have full ssl support we need to install nginx.
http://wiki.nginx.org/Install

Example of Ubuntu installation:

```bash
apt-get install nginx
```

Also we need to have a valid ssl certificate. Suppose we have our application hosted on <code>example.com</code>.

Retrieve a valid ssl certificate from any `trusted` vendor you know and copy it with a public key to the nginx ssl folder:

Example:
```bash
cp ./example.com.key /etc/nginx/ssl
cp ./example.com.crt /etc/nginx/ssl
```
You also can generate your own certificate for a specific domain, but browsers will reject it unless you force to add it as a `trusted certificate`
How to generate: https://www.digitalocean.com/community/tutorials/how-to-create-a-ssl-certificate-on-nginx-for-ubuntu-12-04
How to first get and then add to Chrome: http://www.richud.com/wiki/Ubuntu_chrome_browser_import_self_signed_certificate#Via_GUI

Open nginx config

```bash
nano /etc/nginx/sites-available/meteor.conf
```
Add the following (supposing you have Konso app running on http://localhost:3000):

```javascript
server {
	listen   443;
	server_name example.com;
	client_max_body_size 500M;

	access_log /var/log/nginx/meteorapp.access.log;
	error_log /var/log/nginx/meteorapp.error.log;

	location / {
	        proxy_pass http://localhost:3000;
	        proxy_set_header X-Real-IP $remote_addr;
	        proxy_http_version 1.1;
	        proxy_set_header Upgrade $http_upgrade;
	        proxy_set_header Connection "upgrade";
        }


	ssl on;
	ssl_certificate /etc/nginx/ssl/example.com.crt;
	ssl_certificate_key /etc/nginx/ssl/example.com.key;
	ssl_verify_depth 3;
}
```

Start nginx
```bash
service nginx start
```

Check if nginx runs
```bash
service nginx status
```

You are good to go!
