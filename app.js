var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
/*var mqtt = require('mqtt');  //for mqtt
var options = {
    port: 18407,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'dvbrnzqn',
    password: 'Znlid1bMKEXd',
    encoding: 'utf8'
};
var client = mqtt.connect('mqtt://m13.cloudmqtt.com',options);
client.on('connect', function() { // When connected
  console.log("mqtt connected");
  
  
});
*/
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
	  /*var Pt=JSON.parse(data);   //for mqtt
	  client.publish(Pt.PtName,Pt.PtVal.toString());*/
	  console.log('data='+data);
}
