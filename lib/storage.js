var util = require('util');
var ee = require('events').EventEmitter;

var Storage = function Storage(){
	this.mails = [];
};

util.inherits(Storage, ee);

Storage.prototype.push = function (mail) {
	this.mails.push(mail);
	this.emit('got_mail', mail);
};

module.exports = Storage;