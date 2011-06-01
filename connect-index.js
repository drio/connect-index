var fs     = require('fs'),
    path   = require('path');

/*
 * Our middleware (connect-autoindex)
 * Before the static middleware !!
 */
module.exports = function(options) {
  return function(req, resp, next) {
    var pub_dir      = __dirname + '/public';
    var filename     = path.join(pub_dir + req.url);
    var trimmed_path = filename.replace(pub_dir + "/", '');

    path.exists(filename, function(exists) {  
      if (exists) { 
        fs.stat(filename, function (error, stats) {
          if (stats.isDirectory()) {
            var body = 'listing here <br>' + '\n';
            fs.readdir(filename, function(err, list) {
              if (err || !list) next(); // TODO
              list.forEach(function(f) {
                var link = trimmed_path === '' 
                           ? '/' + f 
                           : "/" + trimmed_path + "/" + f;
                body += '<a href="' + link + '">' + f + '</a><br>' + "\n";
              });
              resp.writeHead(200, {'Content-Type': 'text/html'}); 
              resp.end(body);
            });
          } else {
            next();
          }
        }); 
      }
    }); 
  }  
}
