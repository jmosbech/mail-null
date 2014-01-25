var util = require('util');
var EventEmitter = require('events').EventEmitter;

// in-memory event emitting storage of emails

var Storage = function Storage(){
	this.mails = [];
};

util.inherits(Storage, EventEmitter);

Storage.prototype.push = function (mail) {
	this.mails.push(mail);
	this.emit('got_mail', mail);
};

var s = new Storage();

module.exports = s;