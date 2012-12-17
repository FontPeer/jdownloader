var parser = require('./models/tv_rss_parser.js');

parser.getSearch('Big Bang Theory S06E11', function(data) {
    console.log('finished');
    console.log(data.join('\n'));
});