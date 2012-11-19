#!/bin/env node

var express = require('express');
var index = require('./controllers/index');
var app = express();
var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_INTERNAL_PORT || 8080;
app.get('/get', index.index);
app.get('/', index.setup);
app.listen(port, ipaddr);
console.log('Listening on port ' + ipaddr + ':' + port);
