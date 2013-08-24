var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Storage = function Storage(){
	this.mails = [];
};

util.inherits(Storage, EventEmitter);

Storage.prototype.push = function (mail) {
	this.mails.push(mail);
	this.emit('got_mail', mail);
};

module.exports = Storage;