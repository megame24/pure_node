/*
* main entry to our api
*
*/


//Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

//dedicated server for http
var httpServer = http.createServer(function(req, res) {
	unifiedServer(req, res);
});

//start http serer
httpServer.listen(config.httpPort, function() {
	console.log('server started on port ' + config.httpPort);
});

//dedicated server for https
var httpsServerOptions = {
	'key': fs.readFileSync('./https/key.pem'),
	'cert': fs.readFileSync('./https/cert.pem')
}
var httpsServer = https.createServer(httpsServerOptions, function(req, res) {
	unifiedServer(req, res);
});

//start https server
httpServer.listen(config.httpsPort, function() {
	console.log('server started on port ' + config.httpsPort);
});

//holds the logic for both http & https servers
var unifiedServer = function(req, res) {

	// parse the url: break it down to useable components
	var parsedUrl = url.parse(req.url, true);

	// get just the path
	var path = parsedUrl.pathname;

	// trim path to get useable path, by trimming off unnecessary '/'
	var trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// get the query string(s) from the url as an object
	var queryStringObject = parsedUrl.query;

	// get the http method coupled with the request
	var method = req.method.toLowerCase();

	// get req headers as object
	var headers = req.headers;

	// get payload from req if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';

	req.on('data', function(data) {
		buffer += decoder.write(data);
	});

	req.on('end', function() {
		buffer += decoder.end();

		//figure out the route handler from the req, if none, result to 404 not found
		var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handler.notFound;

		//create a data object from the parsed url and req
		var data = {
			'payload': buffer,
			'headers': headers,
			'method': method,
			'queryStringObject': queryStringObject
		}

		//call the route handler to process data and return payload
		chosenHandler(data, function(statusCode, payload) {
			//check if statusCode is valid, else default it to 200
			statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

			//check if payload is an object of key value pairs, if not default it to an empty object
			payload = typeof(payload) === 'object' ? payload : {};

			//convert payload to JSON string
			var payloadString = JSON.stringify(payload);

			//include the status code in the res header and set type as json in the header
			res.setHeader('content-type', 'application/json');
			res.writeHeader(statusCode);

			// send response
			res.end(payloadString);

			// console log req props
			console.log('responded with', statusCode, payloadString);
		})

	});

}

//route handler
var handler = {};

//ping handler
handler.ping = function(data, callback) {
	callback(200);
};

//handle 404 not found
handler.notFound = function(data, callback) {
	callback(404);
};

//routers
var router = {
	'ping': handler.ping
};