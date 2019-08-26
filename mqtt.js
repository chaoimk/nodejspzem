var mqtt = require('mqtt');
var options = {
    port: 18407,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'dvbrnzqn',
    password: 'Znlid1bMKEXd',
    encoding: 'utf8'
};
var client = mqtt.connect('mqtt://m13.cloudmqtt.com',options);
var io = require('socket.io-client');
var socket = io.connect('http://localhost:2000', {reconnect: true});
client.on('connect', function() { // When connected
  console.log("mqtt connected");
  
  
});

io.sockets.on('connection', function (socket) {
  console.log("socket connect OK");
  socket.on('analog1', function (data) {
    console.log('recieve analog');
	var Pt=JSON.parse(data);
	client.publish(Pt.PtName,Pt.PtVal);
  });
});
