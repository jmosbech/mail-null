var simplesmtp = require('simplesmtp');
var MailParser = require('mailparser').MailParser;

var port = process.env.SMTP_PORT || 2525;

simplesmtp.createSimpleServer(
	{SMTPBanner:'/mail/null - where your test mails go to die'},
	function(req){
		var mailparser = new MailParser();
		mailparser.on('end', function(email){
			global.mails.push(email);
		});
		req.pipe(mailparser);
		req.accept();
	}).listen(port);

console.log('SMTP server listening on port ' + port);
