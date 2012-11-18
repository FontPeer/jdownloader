var http = require('http'),
	util = require('util'),
	url = require('url')
;

console.log(process.version);

process.on('uncaughtException', function (err) {
  console.error('Caught exception: ' + err);
});

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  var name = url.parse(request.url, true).query.name;
  var str = 'Hello ' + name + '\n' + 'I am online for ' + process.uptime() + '\n';
  response.end(str);
}).on('request', function() {
	var cp = require('child_process');
	var n = cp.fork(__dirname + '/miniserver.js');
}).listen(80);

console.log(util.inspect(process.memoryUsage()));
console.log('Server running at http://127.0.0.1:80/');