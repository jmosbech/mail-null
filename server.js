var Storage = require('./lib/storage');
global.mails = new Storage();

global.mails.on('got_mail', function() { console.log('yo', arguments);});

var smtp = require('./smtp');
var app = require('./app');