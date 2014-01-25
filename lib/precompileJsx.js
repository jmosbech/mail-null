var path = require('path');
var fs = require('fs');
var reactTools = require('react-tools');

// middleware
module.exports = function (basePath) {
	return function precompileJsx(req, res, next) {
		if (req.url.slice(-4) !== '.jsx') {
			return next();
		}
		// do some caching here
		var file = path.join(basePath, req.url);
		fs.readFile(file, 'utf8', function (error, content) {
			if (error) {
				res.send(500, 'Could not load ' + req.url + '\n' +
					error.stack || error.message);
				return;
			}
			try {
				var compiled = reactTools.transform(content);
				res.set('content-type', 'application/javascript;charset=utf-8');
				res.send(compiled);
			} catch (e) {
				res.send(500, 'Could not compile JSX: ' + req.url + '\n' +
					(e.stack || 'Reason: ' + e.message));
			}
		});
	}};

