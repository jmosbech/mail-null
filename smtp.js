var simplesmtp = require('simplesmtp');
var MailParser = require('mailparser').MailParser;
var storage = require('./lib/storage');

var port = process.env.SMTP_PORT || 2525;

simplesmtp.createSimpleServer(
	{disableSTARTTLS: true, ignoreTLS: true, SMTPBanner: '/mail/null - where your test emails go to die'},
	function (req) {
		var mailparser = new MailParser();
		mailparser.on('end', function (email) {
			email.attachments = (email.attachments||[]).map(function(attachment){
				attachment.content = attachment.content.toString('base64');
				return attachment;
			});
			storage.push(email);
		});
		req.pipe(mailparser);
		req.accept();
	}).listen(port);

console.log('SMTP server listening on port ' + port);
