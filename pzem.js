var io = require('socket.io-client');
var socket = io.connect('http://localhost:2000', {reconnect: true});



var SerialPort = require('serialport');
var serialPort = new SerialPort('/dev/ttyS0', { //ttyS0 ttyUSB0
    baudRate: 9600
});

serialPort.on('error', function(err) {
  console.log("found " +err); 
  process.exit(1);
});

var rev_buf=[];
var rev_cnt=0;
serialPort.on('data', function (data) {
    var str='';
	//rev_buf=rev_buf+data;
    for(var i=0;i<data.length;i++){
         //str=str+String.fromCharCode(data[i]);
        // console.log(data[i]);
         rev_buf.push(data[i]);
   }
    
});



var PZEMsetadd_str=[0xB4,0xC0,0xA8,0x01,0x01,0x00,0x1E]
var PZEMvolt_str=[0xB0,0xC0,0xA8,0x01,0x01,0x00,0x1A]
var PZEMamp_str=[0xB1,0xC0,0xA8,0x01,0x01,0x00,0x1B]
var PZEMpower_str=[0xB2,0xC0,0xA8,0x01,0x01,0x00,0x1C]
var PZEMenergy_str=[0xB3,0xC0,0xA8,0x01,0x01,0x00,0x1D]
var V=0;
var I=0;
var P=0;
var E=0;
var step=0;
var txrx=5;
var timecnt=0;

function sendtoapp(ptname,ptval,ptunit)
{
	var str='{"PtName":"'+ptname+'","PtVal":'+ptval.toString()+',"Unit":"'+ptunit+'"}';
	console.log("json="+str)
    socket.emit('analog1',str);

}

function decode_str()
{
	 if (rev_buf.length>=7)
	 {
            console.log(rev_buf[0]);
            
         switch (rev_buf[0])
         {
         case 0xA0:
			 V=rev_buf[2]+(rev_buf[3]/10);
             console.log("Read OK");
             console.log(V);
			 sendtoapp('SH.V',V,'V');
             break;
         case 0xA1:
			 I=rev_buf[2]+(rev_buf[3]/100);console.log(I);sendtoapp('SH.I',I,'A');break;
         case 0xA2:
			 P=256*rev_buf[1]+rev_buf[2];console.log(P);sendtoapp('SH.P',P,'W');break;
         case 0xA3:
			 E=256*(256*rev_buf[1]+rev_buf[2])+rev_buf[3];console.log(E);sendtoapp('SH.E',E,'Wh');break;
        
		 
		 }
rev_buf=[];
	 }
}



function sendstr()
{
	if(txrx==0 && timecnt>5)
	{
      step=(step+1)%4;
      switch (step)
      {
      case 0:
          serialPort.write(PZEMvolt_str);
	      console.log('readvolt')
          break;
      case  1:
          serialPort.write(PZEMamp_str);
	      console.log('readamp')
          break;
	  case  2:
          serialPort.write(PZEMpower_str);
	      console.log('readpower')
          break;
      case  3:
          serialPort.write(PZEMenergy_str);
	      console.log('readpenergy')
          break;
      }
	  txrx=1;
      timecnt=0;
    }
	else if(txrx==1)
	{
	  	 txrx=0;decode_str();

	}
	timecnt++
     //console.log('sendvolt')
     //serialPort.write(PZEMvolt_str);
     // serialPort.write(0xB4);serialPort.write(0xC0);serialPort.write(0xA8);serialPort.write(0x01);
     //serialPort.write(0x01);serialPort.write(0x00);serialPort.write(0x1E);
}
serialPort.write(PZEMsetadd_str);
txrx=0;
setInterval(sendstr, 500);
