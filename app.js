var express = require('express');
var logger = require('morgan');
var errorhandler = require('errorhandler');
var http = require('http');
var path = require('path');
var storage = require('./lib/storage');
var browserify = require('connect-browserify');
var reactify = require('reactify');
var uglifyify = require('uglifyify');
var envify = require('envify');

var app = express();

var debug = process.env.NODE_ENV !== 'production';

// all environments
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));

app.use(require('stylus').middleware({
	src: path.join(__dirname, 'public'),
	compress: !debug
}));

var transforms = [reactify, envify];
if (!debug) {
	transforms.push(uglifyify);
}
app.get('/bundle.js', browserify.serve({
	entry: path.join(__dirname, 'client/app.jsx'),
	debug: debug,
	watch: debug,
	transforms: transforms,
	extensions: ['.jsx']
}));

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
	app.use(errorhandler());
}

var server = http.createServer(app).listen(app.get('port'), function () {
	console.log(
		'Web server listening on port ' + app.get('port') + ' (' + app.get('env') + ')');
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	socket.emit('init', storage.mails);
	socket.on('clear_all_emails', function (data) {
		storage.clearAll();
		// update all clients
		io.sockets.emit('init', storage.mails);
	});
	storage.on('got_mail', function (mail) {
		socket.emit('got_mail', mail);
	});
});
