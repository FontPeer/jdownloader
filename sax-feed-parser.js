var sax=require('sax');
var http=require('http');

var callback=function(){};

exports.get_rss=function(host,port,path, cb) {
    callback=cb;
    var parser = sax.parser(true);
    var item = null;
    var currentTag = null;
    var items=[];
    var cnt=0;

    parser.onclosetag = function (tagName) {
        var tag_name=tagName.toLowerCase();
        if (tag_name === 'item' || tag_name === 'entry') {
            currentTag = item = null;
            cnt++;
            return;
        }
        if (currentTag && currentTag.parent) {
            var p = currentTag.parent;
            delete currentTag.parent;
            currentTag = p;
        }
    };

    parser.onopentag = function (tag) {
        var tag_name=tag.name.toLowerCase();
        if (tag_name !== 'item' && tag_name !== 'entry' && !item) return
        if (tag_name === 'item') {
            item = tag;
            items[cnt]={};
        }
        tag.parent = currentTag;
        tag.children = [];
        tag.parent && tag.parent.children.push(tag);
        currentTag = tag;
    };

    parser.ontext = function (text) {
        if (currentTag) {
            items[cnt][currentTag.name.toLowerCase()]=text;
        }
    };

    parser.onend = function () {
        callback(items);
    };

    var body='';
    http.get( { host:host, path:path, port:port }, function(res) {
        res.addListener('end', function() {
            parser.write(body).end();
        });
        res.setEncoding('utf8');
        res.on('data', function(d) {
            body+=d;
        });
    });
};