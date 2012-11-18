var http    = require('http');

// Get the environment variables we need.
var ipaddr = process.env.OPENSHIFT_INTERNAL_IP;
var port = process.env.OPENSHIFT_INTERNAL_PORT || 8080;

http.createServer(function(req,res) {

res.writeHead(200, {'Content-Type': 'text/plain'});
res.end('hello Tom Peeters from Nodejs\n');

}).listen(port,ipaddr);

console.log("server running at http://" + ipaddr + ":" + port + "/");