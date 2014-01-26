var util = require('util');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var path = require('path');
// in-memory event emitting storage of emails

var dataPath = path.join(__dirname, '../data.json');

var Storage = function Storage(){
	this.mails = [];
	try {
	  this.mails = require(dataPath);
	} catch(e){}
};

util.inherits(Storage, EventEmitter);

Storage.prototype.push = function (mail) {
	this.mails.push(mail);
	this.emit('got_mail', mail);
	console.log('got_mail', this.mails.length);
	fs.writeFile(dataPath, JSON.stringify(this.mails, null, '\t'));
};

var s = new Storage();

module.exports = s;