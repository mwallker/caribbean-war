var http = require('http');
var server = http.createServer(function (request, response) {
	console.log(request.method);
	var header = {
		'Content-Type': 'application/json'
	};

	switch (request.url) {
	case '/status':
		break;
	default:
		break;
	}

	response.writeHead(404, {
		'Content-Type': 'application/json'
	});
	response.end(JSON.stringify({
		message: 'Sorry, unknown url'
	}));

});
server.listen(1337, function () {
	console.log('Server is listening on port 1337');
});
