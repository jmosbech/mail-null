var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var precompileJsx = require('./lib/precompileJsx');
var storage = require('./lib/storage');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(precompileJsx(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// development only
if ('development' === app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function () {
	console.log('Web server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);

io.set('log level', 1);

io.sockets.on('connection', function (socket) {
	socket.emit('init', storage.mails);
	storage.on('got_mail', function (mail) {
		socket.emit('got_mail', mail);
	});
});
