connect = require('connect');

var fs     = require('fs'),
    path   = require('path');

/*
 * Our middleware (connect-autoindex)
 * Before the static middleware !!
 * IF request is dir && exists
 *    send html with view of the directory (links to other dirs and files)
 * ELSE
 *    next(); // Connect will take care of the request 
 */

var foo = function(options) {
  return function(req, resp, next) {
    var body = req.url;
    var filename = path.join(__dirname + '/public' + req.url);

    path.exists(filename, function(exists) {  
      if (exists) { 
        fs.stat(filename, function (error, stats) {
          if (stats.isDirectory()) {
            var body = filename + " is a Directory.";
            resp.setHeader('Content-Length', body.length);
            resp.end(body);
          } else {
            next();
          }
        }); 
      }
    }); 
  }  
}

var server = connect.createServer()
  .use(connect.logger())
  .use(foo())
  .use(connect.static(__dirname + '/public', { maxAge: 0 }))
  .use(function(req, res, next) {
    var body = "default: " + req.url;
    res.setHeader('Content-Length', body.length);
    res.end(body);
  });

server.listen(3000, "127.0.0.1");
var a = server.address();
console.log("Server started on: http://" + a.address + ":" + a.port);

/*
connect(
    connect.static(__dirname + '/public', { maxAge: 0 })
  , function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.end('<img src="/tobi.jpeg" />')
  }
).listen(3000);
*/
