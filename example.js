var connect = require('connect'),
    connect_index = require('./connect-index');

var fs     = require('fs'),
    path   = require('path');

var server = connect.createServer()
  .use(connect.logger())
  .use(connect_index())
  .use(connect.static(__dirname + '/public', { maxAge: 0 }))
  .use(function(req, res, next) {
    var body = "default: " + req.url;
    res.setHeader('Content-Length', body.length);
    res.end(body);
  });

server.listen(3000, "127.0.0.1");
var a = server.address();
console.log("Server started on: http://" + a.address + ":" + a.port);
