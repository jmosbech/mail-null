var simplesmtp = require('simplesmtp');
var MailParser = require('mailparser').MailParser;
var mailparser = new MailParser();
mailparser.on('end', function(email){
	global.mails.push(email);
});

var port = process.env.SMTP_PORT || 2525;

simplesmtp.createSimpleServer({SMTPBanner:'/mail/null - where your test mails go to die'}, function(req){
	req.pipe(mailparser);
	req.accept();
}).listen(port);

console.log('mail-sink server listening on port ' + port);
