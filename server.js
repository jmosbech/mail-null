var Storage = require('./lib/storage');
global.mails = new Storage();

var smtp = require('./smtp');
var app = require('./app');