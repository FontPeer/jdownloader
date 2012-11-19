#!/bin/env node

var express = require('express');
var app = express();
var rss = require('./sax-feed-parser');
var url = require('url');
var relativeDate = require('relative-date');

var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_INTERNAL_PORT || 8080;

var SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
    WEEK = 7 * DAY,
    YEAR = DAY * 365,
    MONTH = YEAR / 12;

app.get('/', function(req, res) {
    rss.get_rss('www.mytvrss.com', 80, '/tvrss.xml?id=' + req.query["id"], function(data) {
        var l = data.length,
            body = '',
            query, match, timestamp, published, diff, filestubeLinks;
        body = '<h1>New series in last 14 days</h1>';
        for (var i = 0; i < l; i++) {

            query = url.parse(data[i]['link']).path;
            match = /\/show\/([^\/]+)\/episode\/([^\/]+)/.exec(query);
            timestamp = new Date();
            published = new Date(data[i]['dc:date']);
            diff = timestamp.getTime() - published.getTime();
            if ((match !== null) && (diff <= WEEK * 2)) {
                query = match[1].replace(/_/gi, ' ') + ' ' + match[2];
                body += '<h2>' + data[i]['title'] + '</h2>';
                body += '<p>' + relativeDate(published);
                body += ' <a href="http://www.youtube.com/results?search_query=' + encodeURIComponent(query + ' promo') + '" target="_blank">YouTube</a></p>';
                body += '<textarea rows="5" style="width: 90%">';
                filestubeLinks = [];
                for (var page = 1; page <= 4; page++) {
                    filestubeLinks.push('http://www.filestube.com/look_for.html?q=' + encodeURIComponent(query) + '&select=avi&page=' + page);
                }
                body += filestubeLinks.join('\n');
            }
            body += '</textarea>';
        };
        res.setHeader('Content-Type', 'text/html');
        res.end(body);
    });

});
app.listen(port, ipaddr);
console.log('Listening on port ' + ipaddr + ':' + port);
