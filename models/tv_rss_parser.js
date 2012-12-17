var url = require('url'),
    http = require('http'),
    async = require('async'),
    cheerio = require('cheerio');

var get, parseSearch;
get = function (url, callback) {
    var options = {
            host : 'www.filestube.com',
            port : 80,
            path : url,
            method : 'GET'
        };
        var req = http.get(options, function(res) {
            var pageData = "";
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                pageData += chunk;
            });
            res.on('end', function() {
                callback(pageData);
            });
        });
};

exports.getSearch = function(query, callback) {
    var detailLinks = [];
    var resultLinks = [];
    var callbackLinks = [];
    count = 1;
    get('/look_for.html?q=' + encodeURIComponent(query) + '&select=avi&page=1', function (data) {
        parseSearchResults(data, function (link) {
            detailLinks.push(link);
            for (i in detailLinks) {
            if (detailLinks.length == 10) {
                    get(detailLinks[i], function (data) {
                        parseDetail(data, function(data) {
                            resultLinks.push(data);
                            if (resultLinks.length == detailLinks.length) {
                                for (i in resultLinks) {
                                    for (j in resultLinks[i]) {
                                        callbackLinks.push(resultLinks[i][j]);
                                    }
                                }
                                callback(callbackLinks.sort().filter(function(el,i,a){if(i==a.indexOf(el))return 1;return 0;}));
                            }
                        });
                    });
                }
            }
        });
    });
};

parseSearchResults = function(page, callback) {
    $ = cheerio.load(page);
    $('#results a.resultsLink').each(function(i, el) {
        var x = $(el).attr('href');
        callback(x);
    });
};
parseDetail = function(content, callback) {
    $ = cheerio.load(content);
    var arr = $('#copy_paste_links').html().split('\n').map(function(item) {
        return item.replace(/(^\s*|\s*$)/g, '');
    });
    arr = arr.filter(function(item){return item;});
    callback(arr);
};