/* required modules */
GLOBAL.http = require('http');
GLOBAL.url = require('url');
GLOBAL.fs = require('fs');
// GLOBAL.io = require('socket.io');

GLOBAL.server = http.createServer(function(req, res){
	console.log('Connected...');
	var path = url.parse(req.url).pathname;
	var query = url.parse(req.url, true).query;
	
	// switcher
	switch(path){
		case '/':
			res.writeHead(200, {'Content-Type' : 'text/html'});
			res.write('Hello World');
			break;
		case 'socket.html':
			fs.readFile(__dirname + path, function(err, data){
				if(err){
					res.writeHead(404);
					res.write("This page doesn't exist- 404");
				}else{
					res.writeHead(200, {'Content-Type' : "text/html"});
					res.write(data, "utf8");
				}
			});
			break;
		case '/check_status':
			res.writeHead(200, {"Content-Type": "application/json"});
			res.write(query.callback + '(' + JSON.stringify({ 'msg' : 'hello node.js'}) + ');');
			break;
		default:
			res.writeHead(404);
			res.write("This page doesn't exist - 404");
			break;
	};
	
	// end response
	res.end();
});

// start server
server.listen(8001);
//var GLOBAL.io.listen(server);
