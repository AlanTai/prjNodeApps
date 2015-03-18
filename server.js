/* required modules */

GLOBAL.http = reuiqre('http');
GLOBAL.url = require('url');
GLOBAL.fs = require('fs');

GLOBAL.server = http.createServer(function(req, res){
	console.log('Connection');
	var path = url.parse(req.url).pathname;
	
	// switcher
	switch(path){
		case '/':
			res.writeHead(200, {Content-Type : 'text/html'});
			res.write('Hello World');
			break;
		case 'socket.html':
			fs.readFile(__dirname + path, function(err, data){
				if(err){
					res.writeHead(404);
					res.write("This page doesn't exist- 404");
				}else{
					res.writeHead(200, {Content-Type : "text/html"});
					res.write(data, "utf8");
				}
			});
			break;
		default:
			res.writeHead(404);
			res.write("This page doesn't exist - 404");
	};
	
	//
	res.end();
});

// start server
server.listen(8001);