#!/bin/env node

var express = require('express');
var app = express();
var rss = require('./sax-feed-parser');
var url = require('url');
var relativeDate = require('relative-date');

var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_INTERNAL_PORT || 8080;


app.get('/', function(req, res) {
    rss.get_rss('www.mytvrss.com', 80, '/tvrss.xml?id=' + req.query["id"], function(data) {
        var l = data.length;
        var body = '';
        for (var i = 0; i < l; i++) {
            var query = url.parse(data[i]['link']).path;
            var match = /\/show\/([^\/]+)\/episode\/([^\/]+)/.exec(query);

            if (match !== null) {
                query = match[1].replace(/_/gi, ' ') + ' ' + match[2];
                body += '<h1>' + data[i]['title'] + '</h1>';
                body += '<p><a href="http://www.youtube.com/results?search_query=' + encodeURIComponent(query + ' promo') + '" target="_blank">YouTube</a></p>';
                body += '<p>' + relativeDate(new Date(data[i]['dc:date'])) + '</p>';
                body += '<textarea cols=100 rows=5>';
                for (var page = 1; page <= 4; page++) {
                    var filestube = 'http://www.filestube.com/look_for.html?q=' + encodeURIComponent(query) + '&select=avi&page=' + page;
                    body += filestube + '\n';
                }
                body += '\n';
            }
            body += '</textarea>';
        };
        res.setHeader('Content-Type', 'text/html');
        res.end(body);
    });

});
app.listen(port, ipaddr);
console.log('Listening on port ' + ipaddr + ':' + port);
