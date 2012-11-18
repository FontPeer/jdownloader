var express = require('express');
var app = express();

var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_INTERNAL_PORT || 8080;

app.get('/hello.txt', function(req, res) {
    console.log('request');
    var body = 'Hello World';
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);
});
app.listen(port, ipaddr);
console.log('Done.');