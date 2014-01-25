var simplesmtp = require('simplesmtp');
var MailParser = require('mailparser').MailParser;
var storage = require('./lib/storage');

var port = process.env.SMTP_PORT || 2525;

simplesmtp.createSimpleServer(
	{SMTPBanner: '/mail/null - where your test emails go to die'},
	function (req) {
		var mailparser = new MailParser();
		mailparser.on('end', function (email) {
			if(email.attachments) {
				email.attachments = email.attachments.map(function(attachment){
					var b = new Buffer(attachment.content);
					attachment.content = b.toString('base64');
					return attachment;	
				});
			}
			storage.push(email);
		});
		req.pipe(mailparser);
		req.accept();
	}).listen(port);

console.log('SMTP server listening on port ' + port);
