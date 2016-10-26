var nodemailer = require('nodemailer');

// Create a SMTP transport object
var transport = nodemailer.createTransport({
	port: 2525
});

var message = {

	// sender info
	from: 'Sender Name <sender@example.com>',

	// Comma separated list of recipients
	to: '"Receiver Name" <nodemailer@disposebox.com>',

	// Subject of the message
	subject: 'My Test Subject ✔', //

	headers: {
		'X-Laziness-level': 1000
	},

	// plaintext body
	text: 'Hello to myself!\nFrom myself',

	// HTML body
	html:'<p><b>Hello</b> to myself <img src="cid:note@node"/></p>',


	// Binary Buffer attachment
	attachments: [{
		filename: 'image.png',
		content: new Buffer('iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
							'//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
							'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC', 'base64'),
		cid: 'note@node'
	}]
};

transport.sendMail(message, function(error, info){
	if(error){
		console.log('Error occured');
		console.log(error.message);
		return;
	}
	console.log('Message sent: ' + info.response);

	// if you don't want to use this transport object anymore, uncomment following line
	transport.close(); // close the connection pool
});