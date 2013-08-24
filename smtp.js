var smtp = require('simplesmtp');

var port = process.env.SMTP_PORT || 2525;

console.log('mail-sink server listening on port ' + port);

smtp.createSimpleServer({SMTPBanner:"/mail/null - where your mails go to die"}, function(req){
	req.pipe(process.stdout);
	req.accept();
}).listen(port);