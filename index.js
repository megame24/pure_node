

//Dependencies
var http = require('http');
var url = require('url');

//create a server and make it respond with a string
var server = http.createServer(function(req, res) {

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

	// send response
	res.end('Hello World');

	// console log req props
	console.log('req sent with the headers:', headers);
});

//start server and make it listen on port 3000
server.listen(3000, function() {
	console.log('server started on port 3000');
});