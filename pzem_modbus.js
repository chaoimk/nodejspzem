var io = require('socket.io-client');
var socket = io.connect('http://localhost:2000', {reconnect: true});
var modbus=require('./modbus.js');
var sleep = require('sleep');


var SerialPort = require('serialport');
var serialPort = new SerialPort('/dev/ttyS0', { //ttyS0 ttyUSB0
    baudRate: 9600
});

serialPort.on('error', function(err) {
  console.log("found " +err); 
  process.exit(1);
});

var rev_buf=[];
serialPort.on('data', function (data) {
    for(var i=0;i<data.length;i++){
         rev_buf.push(data[i]);
   }
    
});

function sendtoapp(ptname,ptval,ptunit)
{
	var str='{"PtName":"'+ptname+'","PtVal":'+ptval.toString()+',"Unit":"'+ptunit+'"}';
	console.log("send to app.js "+str)
    socket.emit('analog1',str);

}
var readAll=function()
{
      var s=[];
	  rev_buf=[];
      var str=modbus.readholdingregister(1,0,10);
	  console.log('tx -> '+str);
	  serialPort.write(str);
	  
}
function decode_modbus()
{
	  var s=[];
	  console.log('rx <- '+rev_buf);
      var s=modbus.decode(rev_buf);
      if(s.length==20)
	  {
          var t=s[0]*256+s[1];
		  var V=t/10;
	  	  sendtoapp('SH.V',V,'V');
          var t=256*(s[4]*256+s[5])+s[2]*256+s[3];
		  var I=t/1000;
	  	  sendtoapp('SH.I',I,'A');
		  var t=256*(s[8]*256+s[9])+s[6]*256+s[7];
		  var P=t/10;
	  	  sendtoapp('SH.P',P,'W');
		  var t=256*(s[12]*256+s[13])+s[10]*256+s[11];
		  var E=t;
	  	  sendtoapp('SH.E',E,'Wh');
          var t=s[14]*256+s[15];
		  var F=t/10;
	  	  sendtoapp('SH.F',F,'Hz');
		  var t=s[16]*256+s[17];
		  var PF=t;
	  	  sendtoapp('SH.PF',PF,'%');
   
	  }
}
var timer_cnt=0;
function timer()
{
	if(timer_cnt==0)
       readAll();
	else if(timer_cnt==1)
      decode_modbus();
	timer_cnt=(timer_cnt+1)%25;
}
setInterval(timer, 200);