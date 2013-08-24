var sockets = io.connect();
sockets.on('got_mail',function(msg){
	console.log(arguments);
});