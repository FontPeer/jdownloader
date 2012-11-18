var url = require('url');

function route(request) {
    var path = url.parse(request.url).pathname;
    return path;
}

exports.route = route;