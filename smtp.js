var simplesmtp = require('simplesmtp');

var port = process.env.SMTP_PORT || 2525;

var smtp = simplesmtp.createServer({
	SMTPBanner:"/mail/null - where your test mails go to die",
	ignoreTLS: true,
	requireAuthentication: false,
	secureConnection: false,
	disableDNSValidation: true});

smtp.listen(port);

smtp.on('startData', function(connection){
	console.log(connection);
	connection.bodyData = [];
});

smtp.on('data', function(connection, chunk){
	connection.bodyData.push(chunk.toString());
});

smtp.on('dataReady', function(connection, callback){
	var email = {
		content: connection.bodyData.join(''),
		to: connection.to,
		from: connection.from,
		host: connection.host,
		remoteAddress: connection.remoteAddress,
		date: connection.date
	};
	global.mails.push(email);
	callback();
});

console.log('mail-sink server listening on port ' + port);
