var rss = require('./../sax-feed-parser'),
    url = require('url'),
    relativeDate = require('relative-date');

var SECOND = 1000,
    MINUTE = 60 * SECOND,
    HOUR = 60 * MINUTE,
    DAY = 24 * HOUR,
    WEEK = 7 * DAY,
    YEAR = DAY * 365,
    MONTH = YEAR / 12;

exports.get = function(id, callback) {
    rss.get_rss('www.mytvrss.com', 80, '/tvrss.xml?id=' + id, function(data) {
        var l = data.length,
            result = [],
            item, epinfo, query, match, timestamp, published, diff, filestubeLinks;
        for (var i = 0; i < l; i++) {
            query = url.parse(data[i]['link']).path;
            match = /\/show\/([^\/]+)\/episode\/([^\/]+)/.exec(query);
            timestamp = new Date();
            published = new Date(data[i]['dc:date']);
            diff = timestamp.getTime() - published.getTime();
            if ((match !== null) && (diff <= WEEK * 2)) {
                epinfo = /S(\d+)E(\d+)/.exec(match[2]);
                query = match[1].replace(/_/gi, ' ') + ' ' + match[2];
                item = {};
                item.youtubeUrl = 'http://www.youtube.com/results?search_query=' + encodeURIComponent(query + ' promo');
                item.published = relativeDate(published);
                item.title = data[i]['title'];
                item.searchQuery = query;
                item.serie = epinfo[1];
                item.episode = epinfo[2];
                result.push(item);
            }
        };
        callback(result);
    });
}

