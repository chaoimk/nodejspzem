var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('public'))
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');

});

http.listen(2000, function(){
  console.log('listening on *:2000');
});

io.sockets.on('connection', function (socket) {
  console.log("socket connect OK");
  socket.on('analog1', function (data) {
    console.log('recieve analog');
	 sendanalog(data);
  });
});

function sendanalog(data)
{
      io.emit('analog', data);
	  console.log('data='+data);
}