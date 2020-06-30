# express-server

This represents the backend of the [basic-web-dashboard](https://github.com/RPi-WebTools/basic-web-dashboard).
It supplies the web page with monitored data such as CPU, memory, network and storage usage, but also offers a (semi-automatic) watcher that can create calendar events to notify you of new movie or tv show releases.

## Setup
```
npm install
```
You may need to run this command in the submodules directories as well.

### Set TMDb API key
To use TVspotter, create a file `key.js` in the `TVspotter` directory and put this inside:
```javascript
module.exports = '<your api key>'
```

## Start the server
To start the server, you have to supply it with some arguments. 
```
-e      Endpoint URL to a CalDAV server
-u      CalDAV user name
-p      CalDAV password
-l      Language that is used to query TMDb
```

You can use one of these methods to start it (change parameters to fit your needs):
```shell
# starts the server and auto reloads if you change something in the code
npx supervisor -- server.js -e http://192.168.0.100/dav.php -u viperinius -p supersecure -l de-DE

# simply start it via node directly
node server.js -e http://192.168.0.100/dav.php -u viperinius -p supersecure -l de-DE
```