var express = require('express');
var db=require('./db.js');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var buf_str=[];
app.use(express.static('public'))
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');

});

http.listen(2000, function(){
  console.log('listening on *:2000');
});

io.sockets.on('connection', function (socket) {
  console.log("socket connect OK");
  var table_str=JSON.stringify(db.AIPoint);
  socket.emit('aitable',table_str);
  socket.on('aitable', function (data) {
    console.log('recieve table');
  });
  socket.on('analog1', function (data) {
    console.log('recieve analog');
	 //buf_str.push(data);
	 sendanalog(data);
	 //socket.emit('analog', 'dddd');
  });
});



/*var aipt=db.updateAI(pt.PtName,pt.PtVal);
	  
  			var str=JSON.stringify(aipt);
			io.emit('analog', str);
*/
function sendanalog(data)
{
      io.emit('analog', data);
	  console.log('data='+data);
	
}
