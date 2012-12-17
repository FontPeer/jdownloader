var myTvRssParser = require('./../models/fs_parser.js');
    fsParser = require('./../models/tv_rss_parser.js');

exports.index = function(req, res) {
    myTvRssParser.get(req.query["id"], function(data) {
        var body = '';
        body += '<h1>New episodes</h1>';
        body += '<ul>';
        for ( var i in data) {
            var item = data[i];
            body += '<li>';
            body += '<h2>' + item.title + '</h2>';
            body += '<a href="' + item.youtubeUrl + '">YouTube</a><br />';
            body += '<a href="/links/?q=' + encodeURIComponent(item.searchQuery) + '">Get links</a><br />';
        }
        body += '</ul>';
        res.setHeader('Content-Type', 'text/html');
        res.end(body);
    });
};

exports.links = function(req, res) {
    var body = '<a href="javascript:history.back()">Back</a>';
    fsParser.getSearch(req.query["q"], function(data) {
        body += '<h1>Results for ' + req.query["q"] + '</h1>';
        body += '<textarea style="width:100%;height:400px">';
        body += data.join('\n');
        body += '</textarea>';
        res.setHeader('Content-Type', 'text/html');
        res.end(body);
    });
}

exports.setup = function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res
            .end('<a href="/get/?id=82392689611">TBBT, HIMYM, Misfits & Modern Family</a>');
}